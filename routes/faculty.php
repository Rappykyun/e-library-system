<?php

use App\Http\Controllers\Faculty\CourseShelfController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:faculty'])->prefix('faculty')->name('faculty.')->group(function () {
    Route::get('courses', [CourseShelfController::class, 'index'])->name('courses.index');
    Route::get('courses/{course}', [CourseShelfController::class, 'show'])->name('courses.show');
    Route::put('courses/{course}', [CourseShelfController::class, 'update'])->name('courses.update');
});