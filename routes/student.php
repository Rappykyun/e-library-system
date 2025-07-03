<?php
use App\Http\Controllers\Student\BookController;
use App\Http\Controllers\Student\BookmarkController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/books', [BookController::class, 'index'])->name('books.index');
        Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');

        // Bookmark routes
        Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
        Route::post('/bookmarks', [BookmarkController::class, 'store'])->name('bookmarks.store');
        Route::delete('/bookmarks', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');
    });