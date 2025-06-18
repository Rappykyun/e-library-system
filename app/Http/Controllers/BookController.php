<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\UploadedFile;
use Cloudinary\Cloudinary;


class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with('category')->latest()->get();
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
            'cover_image' => 'required|image|max:2048', 
            'ebook' => 'required|file|mimes:pdf,epub|max:20480',
        ]);

        $cloudinary = new Cloudinary(config('cloudinary.cloud_url'));

        $coverResult = $cloudinary->uploadApi()->upload($request->file('cover_image')->getRealPath(), [
            'folder' => 'book-covers',
        ]);

        $ebookResult = $cloudinary->uploadApi()->upload($request->file('ebook')->getRealPath(), [
            'folder' => 'ebooks',
            'resource_type' => 'raw',
        ]);

        $bookData = array_merge($validated, [
            'cover_image_url' => $coverResult['secure_url'],
            'cover_image_public_id' => $coverResult['public_id'],
            'ebook_url' => $ebookResult['secure_url'],
            'ebook_public_id' => $ebookResult['public_id'],
        ]);

        Book::create($bookData);

        return Redirect::route('admin.books.index')->with('success', 'Books Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
