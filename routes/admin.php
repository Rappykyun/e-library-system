<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BookController;
use Illuminate\Support\Facades\Route;

// 📚 LIBRARIAN + ADMIN ROUTES - Book and Category Management
Route::middleware(['auth', 'verified', 'role:admin|librarian'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Book management
        Route::get('/books/{book}/download', [BookController::class, 'download'])->name('books.download');
        Route::resource('/books', BookController::class);

        // Category management
        Route::resource('/categories', CategoryController::class)->except(['create', 'edit', 'show']);
    });

// 👑 ADMIN ONLY ROUTES - User Management & System Settings
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('/users', UserController::class)->only(['index', 'update', 'destroy']);
        // Add future admin-only routes here (settings, reports, etc.)
    });