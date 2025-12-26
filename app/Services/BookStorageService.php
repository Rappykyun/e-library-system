<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookStorageService
{
    private string $driver;
    private string $localDisk;

    public function __construct(private AzureBlobService $azureBlobService)
    {
        $this->driver = strtolower((string) config('book_storage.driver', 'local'));
        $this->localDisk = (string) config('book_storage.local_disk', 'public');
    }

    public function createContextFromName(string $name): array
    {
        $baseName = pathinfo($name, PATHINFO_FILENAME);
        $sanitizedName = Str::slug($baseName);

        if ($sanitizedName === '') {
            $sanitizedName = 'book';
        }

        return [
            'sanitized_name' => $sanitizedName,
            'unique_id' => uniqid(),
            'timestamp' => now()->format('Y/m'),
        ];
    }

    public function storeEbook(UploadedFile $file): array
    {
        $context = $this->createContextFromName($file->getClientOriginalName());
        $extension = $file->getClientOriginalExtension();
        $fileName = $context['unique_id'] . '_' . $context['sanitized_name'] . '.' . $extension;
        $path = 'books/pdfs/' . $context['timestamp'] . '/' . $fileName;

        $result = $this->storeFile($file, $path);
        $result['context'] = $context;

        return $result;
    }

    public function storeThumbnail(UploadedFile $file, array $context): array
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = $context['unique_id'] . '_' . $context['sanitized_name'] . '_thumb.' . $extension;
        $path = 'books/thumbnails/' . $context['timestamp'] . '/' . $fileName;

        return $this->storeFile($file, $path);
    }

    public function deleteFile(?string $publicId): void
    {
        if (!$publicId) {
            return;
        }

        if ($this->driver === 'azure') {
            $this->azureBlobService->deleteFile($publicId);
            return;
        }

        $disk = Storage::disk($this->localDisk);
        if ($disk->exists($publicId)) {
            $disk->delete($publicId);
        }
    }

    public function localDisk(): string
    {
        return $this->localDisk;
    }

    private function storeFile(UploadedFile $file, string $path): array
    {
        if ($this->driver === 'azure') {
            $result = $this->azureBlobService->uploadFile($file, $path);
            if (!$result['success']) {
                return [
                    'success' => false,
                    'error' => $result['error'] ?? 'Azure upload failed.',
                ];
            }

            return [
                'success' => true,
                'url' => $result['url'] ?? $this->azureBlobService->getPublicUrl($path),
                'public_id' => $result['blob_name'] ?? $path,
            ];
        }

        $directory = pathinfo($path, PATHINFO_DIRNAME);
        $fileName = pathinfo($path, PATHINFO_BASENAME);
        $storedPath = $file->storeAs($directory, $fileName, $this->localDisk);

        if (!$storedPath) {
            return [
                'success' => false,
                'error' => 'Local file storage failed.',
            ];
        }

        return [
            'success' => true,
            'url' => Storage::disk($this->localDisk)->url($storedPath),
            'public_id' => $storedPath,
        ];
    }
}
