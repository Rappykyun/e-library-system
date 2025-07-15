<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('books/{book}/download', [BookController::class, 'download'])->name('books.download');
    Route::get('books/{book}/preview', [BookController::class, 'preview'])->name('books.preview');
});

require __DIR__ . '/admin.php';
require __DIR__ . '/student.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/faculty.php';
require __DIR__ . '/auth.php';
