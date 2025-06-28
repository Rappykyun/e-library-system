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

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with('category')->latest()->paginate(4);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/books/index', [
            'books' => $books,
            'categories' => $categories
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
    public function store(Request $request, AzureBlobService $azureBlobService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'isbn' => 'nullable|string|max:20|unique:books',
            'language' => 'nullable|string|max:10',
            'ebook' => 'required|file|mimes:pdf,epub|max:30720',
        ]);

        $file = $request->file('ebook');
        // Generate a clean, unique blob name (no container duplication and URL-safe)
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $sanitizedName = Str::slug($originalName);
        $blobName = uniqid() . '_' . $sanitizedName . '.' . $extension;

        $uploadResult = $azureBlobService->uploadFile($file, $blobName);

        if (!$uploadResult['success']) {
            return back()->withErrors(['ebook' => 'Failed to upload file to Azure storage: ' . $uploadResult['error']]);
        }

        $uploadUrl = $uploadResult['url'];

        // Generate Cloudinary fetch URL for thumbnail
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $encodedSource = urlencode($uploadUrl);
        $finalCoverUrl = "https://res.cloudinary.com/{$cloudName}/image/fetch/"
            . "c_fill,w_400,h_600,q_auto,f_jpg,pg_1/{$encodedSource}";

        $bookData = array_merge($validated, [
            'cover_image_url' => $finalCoverUrl,
            'ebook_url' => $uploadUrl,
            'ebook_public_id' => $blobName,
        ]);

        Book::create($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Created');
    }
    // public function generateUploadSignature()
    // {
    //     $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));
    //     $timestamp = time();
    //     $folder = 'ebooks';

    //     $signature = $cloudinary->apiUtils()->signParameters([
    //         'timestamp' => $timestamp,
    //         'folder' => $folder,
    //     ]);

    //     return response()->json([
    //         'signature' => $signature,
    //         'timestamp' => $timestamp,
    //         'folder' => $folder,
    //         'api_key' => config('cloudinary.api_key'),
    //         'cloud_name' => config('cloudinary.cloud_name'),
    //     ]);
    // }

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
    public function update(Request $request, Book $book, AzureBlobService $azureBlobService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'isbn' => 'nullable|string|max:20|unique:books,isbn,' . $book->id,
            'pages' => 'nullable|integer',
            'language' => 'nullable|string|max:10',
            'ebook' => 'nullable|file|mimes:pdf,epub|max:30720',
        ]);

        $bookData = $validated;

        if ($request->hasFile('ebook')) {
            // Delete old PDF from Azure
            if ($book->ebook_public_id) {
                $azureBlobService->deleteFile($book->ebook_public_id);
            }

            // Upload new PDF to Azure
            $newFile = $request->file('ebook');
            $originalName = pathinfo($newFile->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $newFile->getClientOriginalExtension();
            $sanitizedName = Str::slug($originalName);
            $newBlobName = uniqid() . '_' . $sanitizedName . '.' . $extension;

            $uploadResult = $azureBlobService->uploadFile($newFile, $newBlobName);

            if (!$uploadResult['success']) {
                return back()->withErrors(['ebook' => 'Failed to upload file to Azure storage: ' . $uploadResult['error']]);
            }

            $newUrl = $uploadResult['url'];

            // Generate new Cloudinary fetch thumbnail
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $encodedSource = urlencode($newUrl);
            $finalCoverUrl = "https://res.cloudinary.com/{$cloudName}/image/fetch/"
                . "c_fill,w_400,h_600,q_auto,f_jpg,pg_1/{$encodedSource}";

            $bookData = array_merge($bookData, [
                'cover_image_url' => $finalCoverUrl,
                'ebook_url' => $newUrl,
                'ebook_public_id' => $newBlobName,
            ]);
        }

        $book->update($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(book $book, AzureBlobService $azureBlobService)
    {
        if ($book->ebook_public_id) {
            $azureBlobService->deleteFile($book->ebook_public_id);
        }

        $book->delete();

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Deleted');
    }



    public function download(Book $book)
    {
        $book->increment('download_count');

        if ($book->ebook_url) {
            return Redirect::away($book->ebook_url);
        }

        return back()->with('error', 'No downloadable file found for this book.');
    }
}
