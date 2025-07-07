<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/courses/index', [
            'courses' => Course::with(['program', 'faculty', 'students'])->withCount('shelfBooks')->latest()->paginate(10),
            'programs' => Program::orderBy('name')->get(),
            'faculty' => User::role('faculty')->orderBy('name')->get(),
            'students' => User::role('student')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:courses',
            'program_id' => 'required|exists:programs,id',
            'description' => 'nullable|string',
        ]);

        Course::create($validated);

        return Redirect::route('admin.courses.index')->with('success', 'Course created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:courses,code,' . $course->id,
            'program_id' => 'required|exists:programs,id',
            'description' => 'nullable|string',
            'faculty_ids' => 'nullable|array',
            'faculty_ids.*' => 'exists:users,id',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        $course->update([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'program_id' => $validated['program_id'],
            'description' => $validated['description'],
        ]);

        if ($request->has('faculty_ids')) {
            $course->faculty()->sync($request->faculty_ids);
        } else {
            $course->faculty()->sync([]);
        }

        if ($request->has('student_ids')) {
            $course->students()->sync($request->student_ids);
        } else {
            $course->students()->sync([]);
        }

        return Redirect::route('admin.courses.index')->with('success', 'Course updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return Redirect::route('admin.courses.index')->with('success', 'Course deleted.');
    }
}

