<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;

use Inertia\Inertia;

class BookController extends Controller
{
    public function index(){
        $books = Book::with('category')->latest()->paginate(4);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('student/books/index', [
            'books' => $books,
            'categories' => $categories
        ]);
    }
    public function show(Book $book){
        $book->increment('views_count');
        $book->load('category');

        $categories = Category::orderBy('name')->get();
        return Inertia::render('student/books/show', [
            'book' => $book,
            'categories' => $categories
        ]);
    }
}
