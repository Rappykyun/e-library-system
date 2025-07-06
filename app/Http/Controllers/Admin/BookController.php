<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Services\AzureBlobService;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Smalot\PdfParser\Parser;
use Ottosmops\Pdftothumb\Converter;
use Illuminate\Http\UploadedFile;
use Symfony\Component\Process\Process;
use App\Models\Course;

class BookController extends Controller
{
    protected $azureBlobService;

    public function __construct(AzureBlobService $azureBlobService)
    {
        $this->azureBlobService = $azureBlobService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with(['category', 'course.program'])->latest()->paginate(4);
        $categories = Category::orderBy('name')->get();
        $courses = Course::with('program')->orderBy('name')->get();

        return Inertia::render('admin/books/index', [
            'books' => $books,
            'categories' => $categories,
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'course_id' => 'nullable|exists:courses,id',
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'pages' => 'nullable|integer|min:1|max:10000',
            'isbn' => 'nullable|string|max:20|unique:books',
            'language' => 'nullable|string|max:10',
            'ebook' => 'required|file|mimes:pdf,epub|max:30720',
        ]);

        $file = $request->file('ebook');

        // Generate unique identifiers
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $sanitizedName = Str::slug($originalName);
        $uniqueId = uniqid();

        $pdfBlobName = 'ebooks/' . $uniqueId . '_' . $sanitizedName . '.' . $extension;
        $thumbnailBlobName = 'thumbnails/' . $uniqueId . '_' . $sanitizedName . '.jpg';

        // 1. Upload PDF to Azure
        $uploadResult = $this->azureBlobService->uploadFile($file, $pdfBlobName);

        if (!$uploadResult['success']) {
            $errorMessage = 'Failed to upload file to Azure storage: ' . $uploadResult['error'];
            return back()->withErrors(['ebook' => $errorMessage]);
        }

        $pdfUrl = $this->azureBlobService->getPublicUrl($pdfBlobName);
        $thumbnailUrl = null;
        $thumbnailPublicId = null;

        // 2. Generate thumbnail if it's a PDF
        if ($file->getMimeType() === 'application/pdf') {
            try {
                $thumbnailResult = $this->generatePdfThumbnail($file, $thumbnailBlobName);

                if ($thumbnailResult['success']) {
                    $thumbnailUrl = $thumbnailResult['url'];
                    $thumbnailPublicId = $thumbnailBlobName;
                }
            } catch (\Exception $e) {
                Log::error('Failed to generate PDF thumbnail: ' . $e->getMessage());
                // Continue without thumbnail - not a critical error
            }
        }

        // 3. Save book to database
        $bookData = array_merge($validated, [
            'ebook_url' => $pdfUrl,
            'ebook_public_id' => $pdfBlobName,
            'cover_image_url' => $thumbnailUrl,
            'thumbnail_public_id' => $thumbnailPublicId,
        ]);

        $book = Book::create($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Created');
    }

    /**
     * Generate thumbnail URL using the same format as working thumbnails
     */
    private function generatePdfThumbnail(UploadedFile $pdfFile, string $thumbnailBlobName): array
    {
        // Create temporary file paths with proper Windows separators
        $tempDir = str_replace('/', DIRECTORY_SEPARATOR, storage_path('app/temp'));
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $tempThumbnailPath = $tempDir . DIRECTORY_SEPARATOR . uniqid() . '_thumbnail';

        try {
            $inputPath = $pdfFile->getRealPath();

            // Normalize paths for Windows
            $inputPath = str_replace('/', DIRECTORY_SEPARATOR, $inputPath);
            $tempThumbnailPath = str_replace('/', DIRECTORY_SEPARATOR, $tempThumbnailPath);

            // Build command array for Process
            $command = [
                'pdftoppm',
                '-jpeg',
                '-f',
                '1',
                '-l',
                '1',
                '-scale-to',
                '600',
                $inputPath,
                $tempThumbnailPath
            ];

            Log::info('Executing pdftoppm with normalized paths', [
                'command' => implode(' ', $command),
                'input_path' => $inputPath,
                'output_base' => $tempThumbnailPath
            ]);

            // Create and run process
            $process = new Process($command);
            $process->setTimeout(60);
            $process->run();

            // Log the process output for debugging
            Log::info('pdftoppm process completed', [
                'exit_code' => $process->getExitCode(),
                'output' => $process->getOutput(),
                'error_output' => $process->getErrorOutput()
            ]);

            if (!$process->isSuccessful()) {
                throw new \Exception('pdftoppm failed: ' . $process->getErrorOutput());
            }

            // Check ALL possible output file patterns (including 3-digit format!)
            $possibleOutputs = [
                $tempThumbnailPath . '-001.jpg',        // 3-digit format (what we found!)
                $tempThumbnailPath . '-01.jpg',         // 2-digit format
                $tempThumbnailPath . '-1.jpg',          // 1-digit format
                $tempThumbnailPath . '1.jpg',           // No dash
                $tempThumbnailPath . '.jpg',            // Just extension
            ];

            $actualThumbnailPath = null;
            foreach ($possibleOutputs as $possiblePath) {
                Log::info('Checking for thumbnail at', ['path' => $possiblePath]);
                if (file_exists($possiblePath)) {
                    $actualThumbnailPath = $possiblePath;
                    Log::info('Found thumbnail at', ['path' => $actualThumbnailPath]);
                    break;
                }
            }

            if (!$actualThumbnailPath) {
                // List all files in temp directory for debugging
                $tempFiles = glob($tempDir . DIRECTORY_SEPARATOR . '*');
                throw new \Exception('Thumbnail file was not created. Checked paths: ' . implode(', ', $possibleOutputs) . '. Files in temp dir: ' . implode(', ', $tempFiles));
            }

            // Read and upload thumbnail
            $thumbnailContent = file_get_contents($actualThumbnailPath);

            $uploadResult = $this->azureBlobService->uploadRawContent(
                $thumbnailContent,
                $thumbnailBlobName,
                'image/jpeg'
            );

            // Clean up
            if (file_exists($actualThumbnailPath)) {
                unlink($actualThumbnailPath);
            }

            Log::info('Thumbnail generated and uploaded successfully', [
                'thumbnail_path' => $actualThumbnailPath,
                'azure_upload_success' => $uploadResult['success']
            ]);

            return $uploadResult;

        } catch (\Exception $e) {
            // Clean up on error - check all possible file patterns
            $cleanupPatterns = [
                $tempThumbnailPath . '*.jpg',
                dirname($tempThumbnailPath) . DIRECTORY_SEPARATOR . basename($tempThumbnailPath) . '*.jpg'
            ];

            foreach ($cleanupPatterns as $pattern) {
                $files = glob($pattern);
                foreach ($files as $file) {
                    if (file_exists($file)) {
                        unlink($file);
                    }
                }
            }

            Log::error('Thumbnail generation failed', [
                'error' => $e->getMessage(),
                'input_path' => $inputPath ?? 'unknown',
                'output_base' => $tempThumbnailPath ?? 'unknown'
            ]);

            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $book->increment('views_count');
        $book->load('category');

        $categories = Category::orderBy('name')->get();
        return Inertia::render('admin/books/show', [
            'book' => $book,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        $categories = Category::orderBy('name')->get();
        $book->load('category');

        return Inertia::render('admin/books/show', [
            'book' => $book,
            'categories' => $categories

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {


        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'course_id' => 'nullable|exists:courses,id',
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'pages' => 'nullable|integer|min:1|max:10000',
            'isbn' => 'nullable|string|max:20|unique:books,isbn,' . $book->id,
            'language' => 'nullable|string|max:10',
            'ebook' => 'nullable|file|mimes:pdf,epub|max:30720',
        ]);

        $bookData = $validated;

        if ($request->hasFile('ebook')) {
            // Delete old files from Azure
            if ($book->ebook_public_id) {
                $this->azureBlobService->deleteFile($book->ebook_public_id);
            }
            if ($book->thumbnail_public_id) {
                $this->azureBlobService->deleteFile($book->thumbnail_public_id);
            }

            $file = $request->file('ebook');

            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $sanitizedName = Str::slug($originalName);
            $uniqueId = uniqid();

            $newPdfBlobName = 'ebooks/' . $uniqueId . '_' . $sanitizedName . '.' . $extension;
            $newThumbnailBlobName = 'thumbnails/' . $uniqueId . '_' . $sanitizedName . '.jpg';

            $uploadResult = $this->azureBlobService->uploadFile($file, $newPdfBlobName);

            if (!$uploadResult['success']) {
                $errorMessage = 'Failed to upload file to Azure storage: ' . $uploadResult['error'];
                return back()->withErrors(['ebook' => $errorMessage]);
            }

            $newPdfUrl = $this->azureBlobService->getPublicUrl($newPdfBlobName);
            $thumbnailUrl = null;
            $thumbnailPublicId = null;

            // Generate new thumbnail
            if ($file->getMimeType() === 'application/pdf') {
                try {
                    $thumbnailResult = $this->generatePdfThumbnail($file, $newThumbnailBlobName);

                    if ($thumbnailResult['success']) {
                        $thumbnailUrl = $thumbnailResult['url'];
                        $thumbnailPublicId = $newThumbnailBlobName;
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to generate PDF thumbnail during update: ' . $e->getMessage());
                }
            }

            $bookData = array_merge($bookData, [
                'ebook_url' => $newPdfUrl,
                'ebook_public_id' => $newPdfBlobName,
                'cover_image_url' => $thumbnailUrl,
                'thumbnail_public_id' => $thumbnailPublicId,
            ]);
        }

        $book->update($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // Delete both PDF and thumbnail from Azure
        if ($book->ebook_public_id) {
            $this->azureBlobService->deleteFile($book->ebook_public_id);
        }
        if ($book->thumbnail_public_id) {
            $this->azureBlobService->deleteFile($book->thumbnail_public_id);
        }

        $book->delete();

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Deleted');
    }

    public function download(Book $book)
    {
        $book->increment('download_count');

        if (!$book->ebook_url) {
            return back()->with('error', 'No downloadable file found for this book.');
        }

        // Create a file name for the download.
        $fileName = Str::slug($book->title) . '.pdf';

        return response()->streamDownload(function () use ($book) {
            echo file_get_contents($book->ebook_url);
        }, $fileName);
    }
}
