<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index()
    {
        // ✅ FIXED: Simple query to get user's bookmarked books
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

    public function store(Request $request): JsonResponse
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
            return response()->json([
                'message' => 'Book is already bookmarked',
                'bookmarked' => true
            ], 200);
        }

        // Create bookmark
        Bookmark::create([
            'user_id' => $user->id,
            'book_id' => $bookId
        ]);

        return response()->json([
            'message' => 'Book bookmarked successfully',
            'bookmarked' => true
        ], 201);
    }

    public function destroy(Request $request): JsonResponse
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
            return response()->json([
                'message' => 'Bookmark not found',
                'bookmarked' => false
            ], 404);
        }

        $bookmark->delete();

        return response()->json([
            'message' => 'Bookmark removed successfully',
            'bookmarked' => false
        ], 200);
    }
}