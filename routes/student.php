<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/books', [\App\Http\Controllers\Student\BookController::class, 'index'])->name('books.index');
        Route::get('/bookmarks', fn() => Inertia::render('student/bookmarks/index'))->name('bookmarks.index');
    });