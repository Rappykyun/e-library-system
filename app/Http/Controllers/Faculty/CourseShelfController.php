<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseShelfController extends Controller
{
    // List courses taught by the logged-in faculty member
    public function index()
    {
        $courses = Auth::user()
            ->teachingCourses()
            ->where('status', 'active')
            ->with('shelfBooks')
            ->withCount('shelfBooks')
            ->get();

        return Inertia::render('faculty/courses/index', ['courses' => $courses]);
    }


    public function show(Course $course)
    {

        abort_if(!Auth::user()->teachingCourses()->where('id', $course->id)->exists(), 403);

        $course->load('shelfBooks');
        $allBooks = Book::orderBy('title')->get();

        return Inertia::render('faculty/courses/show', [
            'course' => $course,
            'allBooks' => $allBooks,
        ]);
    }

    // Update the list of books on a course shelf
    public function update(Request $request, Course $course)
    {
        // Ensure the faculty is assigned to this course
        abort_if(!Auth::user()->teachingCourses()->where('id', $course->id)->exists(), 403);

        $request->validate(['book_ids' => 'required|array']);

        // Sync the pivot table with the new list of book IDs
        $course->shelfBooks()->sync($request->book_ids);

        return back()->with('success', 'Course shelf updated successfully.');
    }
}
