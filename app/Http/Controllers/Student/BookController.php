<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\DownloadLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category']);
        $search = $request->input('search');
        $category = $request->input('category');
        $page = $request->input('page', 1);

        // Create cache key for search results (without user-specific data)
        $cacheKey = 'books_search_' . md5(json_encode($filters) . '_page_' . $page);

        // Get books from cache (without user-specific relationships)
        $books = Cache::remember($cacheKey, 300, function () use ($search, $category) {
            return Book::query()
                ->with(['category:id,name,slug'])  // Only load category, not user-specific data
                ->select([
                    'id',
                    'title',
                    'author',
                    'category_id',
                    'cover_image_url',
                    'download_count',
                    'views_count',
                    'created_at'
                ])
                ->fastSearch($search, $category)
                ->orderByDesc('created_at')  // Use indexed field for sorting
                ->paginate(12)  // Increase page size for better performance
                ->withQueryString();
        });

        // Load user-specific relationships (bookmarks, ratings) outside cache for real-time updates
        $books->load([
            'bookmarks' => function ($query) {
                $query->where('user_id', Auth::id())
                    ->select('id', 'user_id', 'book_id');
            },
            'ratings' => function ($query) {
                $query->where('user_id', Auth::id())
                    ->select('id', 'user_id', 'book_id', 'rating');
            }
        ]);

        // Cache categories for 1 hour
        $categories = Cache::remember('categories_list', 3600, function () {
            return Category::select('id', 'name', 'slug')
                ->orderBy('name')
                ->get();
        });

        return Inertia::render('student/books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function show(Book $book)
    {
        $book->increment('views_count');

        $book->load([
            'category',
            'bookmarks' => function ($query) {
                $query->where('user_id', Auth::id());
            }
        ]);

        $categories = Category::orderBy('name')->get();
        return Inertia::render('student/books/show', [
            'book' => $book,
            'categories' => $categories
        ]);
    }
}