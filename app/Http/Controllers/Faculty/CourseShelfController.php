<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Course;
use App\Models\Category;
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

    public function show(Course $course, Request $request)
    {
        abort_if(!Auth::user()->teachingCourses()->where('id', $course->id)->exists(), 403);

        // Get search and filter parameters
        $filters = $request->only(['search', 'category']);
        $search = $request->input('search');
        $category = $request->input('category');

        // Build the books query with search and filters
        $booksQuery = Book::query()
            ->with(['category'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('author', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->when($category && $category !== 'all', function ($query, $category) {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            });

        // Get all books matching the search/filter criteria
        $allBooks = $booksQuery->orderBy('title')->get();

        // Load the course with its shelf books
        $course->load('shelfBooks');

        // Get categories for the filter dropdown
        $categories = Category::orderBy('name')->get();

        return Inertia::render('faculty/courses/show', [
            'course' => $course,
            'allBooks' => $allBooks,
            'categories' => $categories,
            'filters' => $filters,
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
