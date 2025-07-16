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
        $course->load([
            'program',
            'faculty',
            'shelfBooks.category',
            'shelfBooks.bookmarks' => function ($query) {
                $query->where('user_id', Auth::id())
                    ->select('id', 'user_id', 'book_id');
            },
            'shelfBooks.ratings' => function ($query) {
                $query->where('user_id', Auth::id())
                    ->select('id', 'user_id', 'book_id', 'rating');
            }
        ]);

        return Inertia::render('student/courses/show', [
            'course' => $course
        ]);
    }
}