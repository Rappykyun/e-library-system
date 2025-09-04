<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AzureBlobService
{
    private ?string $accountName;
    private ?string $accountKey;
    private ?string $containerName;
    private ?string $baseUrl;

    public function __construct()
    {
        $this->accountName = config('azure.storage_account_name');
        $this->accountKey = config('azure.storage_account_key');
        $this->containerName = config('azure.storage_container');
        $this->baseUrl = $this->accountName ? "https://{$this->accountName}.blob.core.windows.net" : null;
    }

    private function isConfigured(): bool
    {
        return !empty($this->accountName) && !empty($this->accountKey) && !empty($this->containerName);
    }

    public function uploadFile(UploadedFile $file, string $blobName): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Azure Blob Storage is not configured.'];
        }

        $url = "{$this->baseUrl}/{$this->containerName}/{$blobName}";
        $content = file_get_contents($file->getRealPath());
        $contentLength = strlen($content);
        $contentType = $file->getMimeType();
        $originalFileName = $file->getClientOriginalName();

        Log::info('Starting Azure upload', [
            'file_size' => $contentLength,
            'file_name' => $originalFileName,
            'blob_name' => $blobName
        ]);

        $headers = $this->generateHeaders('PUT', $blobName, $contentLength, $contentType, $originalFileName);

        try {
            // Increase timeout for large files - calculate based on file size
            $timeoutSeconds = max(120, min(600, ceil($contentLength / (1024 * 1024)) * 30)); // 30 seconds per MB, min 2 minutes, max 10 minutes

            $response = Http::withHeaders($headers)
                ->timeout($timeoutSeconds) // Dynamic timeout based on file size
                ->connectTimeout(30) // 30 seconds to establish connection
                ->withBody($content, $contentType)
                ->put($url);

            if ($response->successful()) {
                Log::info('Azure upload successful', ['blob_name' => $blobName]);
                return [
                    'success' => true,
                    'url' => $url,
                    'blob_name' => $blobName,
                ];
            }

            // If the container doesn't exist, create it once and retry
            if ($response->status() === 404 && str_contains($response->body(), 'ContainerNotFound')) {
                Log::info('Container not found, creating and retrying');
                if ($this->createContainer()) {
                    $response = Http::withHeaders($headers)
                        ->timeout($timeoutSeconds)
                        ->connectTimeout(30)
                        ->withBody($content, $contentType)
                        ->put($url);

                    if ($response->successful()) {
                        Log::info('Azure upload successful after container creation', ['blob_name' => $blobName]);
                        return [
                            'success' => true,
                            'url' => $url,
                            'blob_name' => $blobName,
                        ];
                    }
                }
            }

            Log::error('Azure Blob Upload Failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'file_size' => $contentLength,
                'timeout_used' => $timeoutSeconds
            ]);

            return ['success' => false, 'error' => 'Upload failed: ' . $response->body()];
        } catch (\Exception $e) {
            Log::error('Azure Blob Upload Exception', [
                'error' => $e->getMessage(),
                'file_size' => $contentLength,
                'blob_name' => $blobName
            ]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    public function uploadRawContent(string $content, string $blobName, string $contentType): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Azure Blob Storage is not configured.'];
        }

        $url = "{$this->baseUrl}/{$this->containerName}/{$blobName}";
        $contentLength = strlen($content);

        $headers = $this->generateHeaders('PUT', $blobName, $contentLength, $contentType);

        try {

            $response = Http::withHeaders($headers)
                ->timeout(60)
                ->connectTimeout(15)
                ->withBody($content, $contentType)
                ->put($url);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'url' => $url,
                    'blob_name' => $blobName,
                ];
            }

            Log::error('Azure Blob Raw Upload Failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return ['success' => false, 'error' => 'Upload failed: ' . $response->body()];
        } catch (\Exception $e) {
            Log::error('Azure Blob Raw Upload Exception', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    public function deleteFile(string $blobName): bool
    {
        if (!$this->isConfigured()) {
            Log::error('Azure Blob Delete Failed: Not configured.');
            return false;
        }

        $url = "{$this->baseUrl}/{$this->containerName}/{$blobName}";
        $headers = $this->generateHeaders('DELETE', $blobName);

        try {
            $response = Http::withHeaders($headers)->delete($url);
            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Azure Blob Delete Exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get the public, permanent URL for a blob.
     */
    public function getPublicUrl(string $blobName): string
    {
        return "https://{$this->accountName}.blob.core.windows.net/{$this->containerName}/{$blobName}";
    }

    private function generateHeaders(string $method, string $blobName, int $contentLength = 0, string $contentType = '', string $originalFileName = ''): array
    {
        // Generate RFC1123 date string for the x-ms-date header.
        $rfc1123Date = Carbon::now('UTC')->format('D, d M Y H:i:s') . ' GMT';
        $storageServiceVersion = '2020-04-08';

        // Basic headers that are always required.
        $headers = [
            'x-ms-date' => $rfc1123Date,
            'x-ms-version' => $storageServiceVersion,
        ];

        // Additional headers for PUT (upload) operations.
        if ($method === 'PUT') {
            $headers['x-ms-blob-type'] = 'BlockBlob';
            $headers['Content-Length'] = $contentLength;
            $headers['Content-Type'] = $contentType;
            if ($originalFileName) {
                $headers['x-ms-blob-content-disposition'] = 'attachment; filename="' . $originalFileName . '"';
            }
        }

        /**
         * Build the canonicalized headers string.
         * 1. Include only headers that start with x-ms-
         * 2. Convert header names to lowercase.
         * 3. Sort them lexicographically.
         * 4. Format as "name:value" and join with newlines.
         */
        $canonicalizedHeaders = '';
        $headersForCanonical = [];
        foreach ($headers as $headerName => $headerValue) {
            $lowerName = strtolower($headerName);
            if (str_starts_with($lowerName, 'x-ms-')) {
                $headersForCanonical[$lowerName] = trim($headerValue);
            }
        }
        ksort($headersForCanonical);
        foreach ($headersForCanonical as $name => $value) {
            $canonicalizedHeaders .= $name . ':' . $value . "\n";
        }

        // Remove the trailing newline as per Azure specs.
        $canonicalizedHeaders = rtrim($canonicalizedHeaders, "\n");

        // Canonicalized resource: "/<account-name>/<container-name>/<blob-name>"
        $canonicalizedResource = "/{$this->accountName}/{$this->containerName}/{$blobName}";

        // Per Azure docs the Date header field in the stringToSign should be empty when using x-ms-date.
        $dateHeaderForStringToSign = '';

        // Content-Length should be an empty string for zero length, otherwise the number.
        $contentLengthHeader = $contentLength > 0 ? (string) $contentLength : '';

        // Construct the string to sign.
        $stringToSign = $method . "\n" .           // VERB
            "\n" .                                 // Content-Encoding
            "\n" .                                 // Content-Language
            $contentLengthHeader . "\n" .          // Content-Length
            "\n" .                                 // Content-MD5
            ($contentType ?: '') . "\n" .          // Content-Type
            $dateHeaderForStringToSign . "\n" .    // Date (empty because x-ms-date is used)
            "\n" .                                 // If-Modified-Since
            "\n" .                                 // If-Match
            "\n" .                                 // If-None-Match
            "\n" .                                 // If-Unmodified-Since
            "\n" .                                 // Range
            $canonicalizedHeaders . "\n" .
            $canonicalizedResource;

        // Sign the string with the storage account key.
        $signature = base64_encode(hash_hmac('sha256', $stringToSign, base64_decode($this->accountKey), true));

        // Attach the Authorization header.
        $headers['Authorization'] = "SharedKey {$this->accountName}:{$signature}";

        return $headers;
    }

    /**
     * Create the storage container if it doesn't exist.
     */
    private function createContainer(): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        $url = "{$this->baseUrl}/{$this->containerName}?restype=container";

        $headers = $this->generateHeaders('PUT', "{$this->containerName}?restype=container");
        // Container creation requires x-ms-blob-public-access if we want it public; omit for private.

        try {
            $response = Http::withHeaders($headers)->put($url);

            // 201 Created or 409 Conflict (already exists) are both acceptable.
            if ($response->status() === 201 || $response->status() === 409) {
                return true;
            }

            Log::error('Azure Container Create Failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('Azure Container Create Exception', ['error' => $e->getMessage()]);
        }

        return false;
    }
}
