<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    //  admin-specific routes
    Route::get('/books', fn() => Inertia::render('admin/books/index'))->name('books.index');
    Route::get('/categories', fn() => Inertia::render('admin/categories/index'))->name('categories.index');
    Route::get('/tags', fn() => Inertia::render('admin/tags/index'))->name('tags.index');
    Route::get('/users', fn() => Inertia::render('admin/users/index'))->name('users.index');
});