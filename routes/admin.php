<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;

use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/books/{book}/download', [BookController::class, 'download'])->name('books.download');
    Route::resource('/books', BookController::class);
    Route::resource('/categories', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('/users', UserController::class)->only(['index', 'update', 'destroy']);
    // Route::get('/tags', fn() => Inertia::render('admin/tags/index'))->name('tags.index');

});
