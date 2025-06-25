<?php
use App\Http\Controllers\Student\BookController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/books', [BookController::class, 'index'])->name('books.index');
        Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');
        Route::get('/bookmarks', fn() => Inertia::render('student/bookmarks/index'))->name('bookmarks.index');
    });