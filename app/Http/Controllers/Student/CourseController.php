<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        $student = Auth::user();

        $courses = $student->enrolledCourses()
            ->where('status', 'active')
            ->with('faculty', 'program')
            ->withCount('shelfBooks')
            ->get();

        return Inertia::render('student/courses/index', [
            'courses' => $courses
        ]);
    }

    public function show(Course $course)
    {
        $course->load(['program', 'faculty', 'shelfBooks.category']);

        return Inertia::render('student/courses/show', [
            'course' => $course
        ]);
    }
}