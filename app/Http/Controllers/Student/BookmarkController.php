<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index()
    {
        $bookmarks = Auth::user()
            ->bookmarkedBooks()
            ->with([
                'category',
                'bookmarks' => function ($query) {
                    $query->where('user_id', Auth::id());
                }
            ])
            ->latest('bookmarks.created_at')
            ->paginate(12);

        return Inertia::render('student/bookmarks/index', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id'
        ]);

        $user = Auth::user();
        $bookId = $request->book_id;

        // Check if already bookmarked
        $existingBookmark = Bookmark::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->first();

        if ($existingBookmark) {
            return back()->with('message', 'Book is already bookmarked');
        }

        // Create bookmark
        Bookmark::create([
            'user_id' => $user->id,
            'book_id' => $bookId
        ]);

        return back()->with('success', 'Book bookmarked successfully');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id'
        ]);

        $user = Auth::user();
        $bookId = $request->book_id;

        $bookmark = Bookmark::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->first();

        if (!$bookmark) {
            return back()->with('error', 'Bookmark not found');
        }

        $bookmark->delete();

        return back()->with('success', 'Bookmark removed successfully');
    }
}