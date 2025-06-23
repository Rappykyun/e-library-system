<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Cloudinary\Cloudinary;
use Cloudinary\Transformation\Resize;
use Cloudinary\Transformation\Qualifier;
use PhpParser\Node\Stmt\TryCatch;


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
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'isbn' => 'nullable|string|max:20|unique:books',
            'pages' => 'nullable|integer',
            'language' => 'nullable|string|max:10',
            'ebook' => 'required|file|mimes:pdf,epub|max:30720',
        ]);

        $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));
        $ebookResult = $cloudinary->uploadApi()->upload($request->file('ebook')->getRealPath(), [
            'folder' => 'ebooks',
            'resource_type' => 'auto',
            'public_id' => pathinfo($request->file('ebook')->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time(),
            'format' => 'pdf',
            'pages' => true,
        ]);

        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $coverImagePublicId = $ebookResult['public_id'];
        $finalCoverUrl = "https://res.cloudinary.com/{$cloudName}/image/upload/c_fill,w_400,h_600,q_auto,f_jpg,pg_1/{$coverImagePublicId}.pdf";
        $totalPages = $ebookResult['pages'] ?? null;



        // Generate cover image URL from the first page of the PDF (page 1)
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $publicId = $ebookResult['public_id'];

        // Total number of pages reported by Cloudinary (PDFs only)
        $totalPages = $ebookResult['pages'] ?? null;

        // Single transformation URL (400x600, cropped, auto quality, jpg format)
        $finalCoverUrl = "https://res.cloudinary.com/{$cloudName}/image/upload/c_fill,w_400,h_600,q_auto,f_jpg,pg_1/{$publicId}.pdf";



        $bookData = array_merge($validated, [
            'cover_image_url' => $finalCoverUrl,
            'cover_image_public_id' => $ebookResult['public_id'],
            'ebook_url' => $ebookResult['secure_url'],
            'ebook_public_id' => $ebookResult['public_id'],
            // Override/Set pages automatically if Cloudinary provided it
            'pages' => $totalPages ?? $validated['pages'] ?? null,
        ]);

        Book::create($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Books Successfully Created');
    }
    public function generateUploadSignature()
    {
        $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));
        $timestamp = time();
        $folder = 'ebooks';

        $signature = $cloudinary->apiUtils()->signParameters([
            'timestamp' => $timestamp,
            'folder' => $folder,
        ]);

        return response()->json([
            'signature' => $signature,
            'timestamp' => $timestamp,
            'folder' => $folder,
            'api_key' => config('cloudinary.api_key'),
            'cloud_name' => config('cloudinary.cloud_name'),
        ]);
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
            'description' => 'nullable|string',
            'publisher' => 'nullable|string|max:255',
            'published_year' => 'nullable|digits:4',
            'isbn' => 'nullable|string|max:20|unique:books,isbn,' . $book->id,
            'pages' => 'nullable|integer',
            'language' => 'nullable|string|max:10',
            'ebook' => 'nullable|file|mimes:pdf,epub|max:30720',
        ]);

        $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));

        $bookData = $validated;
        if ($request->hasFile('ebook')) {

            if ($book->ebook_public_id) {
                try {
                    $cloudinary->uploadApi()->destroy($book->ebook_public_id, ['resource_type' => 'auto']);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete old ebook from Cloudinary: ' . $e->getMessage());
                }
            }

            // Upload new ebook
            $ebookResult = $cloudinary->uploadApi()->upload($request->file('ebook')->getRealPath(), [
                'folder' => 'ebooks',
                'resource_type' => 'auto',
                'public_id' => pathinfo($request->file('ebook')->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time(),
                'format' => 'pdf',
                'pages' => true,
            ]);
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $publicId = $ebookResult['public_id'];
            $totalPages = $ebookResult['pages'] ?? null;
            $finalCoverUrl = "https://res.cloudinary.com/{$cloudName}/image/upload/c_fill,w_400,h_600,q_auto,f_jpg,pg_1/{$publicId}.pdf";

            $bookData = array_merge($bookData, [
                'cover_image_url' => $finalCoverUrl,
                'cover_image_public_id' => $ebookResult['public_id'],
                'ebook_url' => $ebookResult['secure_url'],
                'ebook_public_id' => $ebookResult['public_id'],
                'pages' => $totalPages ?? $validated['pages'] ?? $book->pages,
            ]);
        }

        $book->update($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(book $book)
    {
        $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));

        if ($book->ebook_public_id) {
            try {
                $cloudinary->uploadApi()->destroy($book->ebook_public_id, ['resource_type' => 'auto']);
            } catch (\Exception $e) {
                Log::warning('Failed to delete ebook form Cloudinary: ' . $e->getMessage());
            }
        }
        $book->delete();
        return Redirect::route('admin.books.index')->with('success', 'Book Successfully Deleted');
    }
}
