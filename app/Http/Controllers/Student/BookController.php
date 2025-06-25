<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;

use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {

        $filters = $request->only(['search', 'category']);

        // $books = Book::with('category')->latest()->paginate(4);
        $books = Book::query()
            ->with('category')
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")->orWhere('author', 'like', "%{$search}%");
                });
            })
            ->when($request->input('category'), function ($query, $categorySlug) {
                if ($categorySlug !== 'all') {
                    $query->whereHas('category', function ($q) use ($categorySlug) {
                        $q->where('slug', $categorySlug);
                    });
                }
            })
            ->latest()
            ->paginate(4)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('student/books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }
    public function show(Book $book)
    {
        $book->increment('views_count');
        $book->load('category');

        $categories = Category::orderBy('name')->get();
        return Inertia::render('student/books/show', [
            'book' => $book,
            'categories' => $categories
        ]);
    }
}
