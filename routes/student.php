<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:student'])->group(function () {
    // You can add your student-specific routes here
    Route::get('/books', fn() => Inertia::render('student/books/index'))->name('books.index');
    Route::get('/bookmarks', fn() => Inertia::render('student/bookmarks/index'))->name('bookmarks.index');
});