<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index(){
        $bookmarks = Auth::user()
            ->bookmarkedBooks()
            ->with('category')
            ->withUserData(Auth::user())
            ->latest('bookmarks.created_at')
            ->paginate(8);

        return Inertia::render('student/bookmarks/index', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
