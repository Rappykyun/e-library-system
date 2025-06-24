<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::resource('/books', \App\Http\Controllers\Admin\BookController::class);
    Route::resource('/categories', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('/users', UserController::class)->only(['index', 'update', 'destroy']);
    // Route::get('/tags', fn() => Inertia::render('admin/tags/index'))->name('tags.index');

});
