<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasRole('admin')) {
            // Basic stats
            $totalBooks = Book::count();
            $totalUsers = User::role(['student', 'faculty'])->count();
            $totalPrograms = Program::count();
            $totalCategories = Category::count();
            $totalDownloads = Book::sum('download_count') ?? 0;
            $totalViews = Book::sum('views_count') ?? 0;

            // Popular books (by downloads)
            $popularBooks = Book::with('category')
                ->orderBy('download_count', 'desc')
                ->take(5)
                ->get(['id', 'title', 'author', 'download_count', 'category_id']);

            // Most viewed books
            $mostViewedBooks = Book::with('category')
                ->orderBy('views_count', 'desc')
                ->take(5)
                ->get(['id', 'title', 'author', 'views_count', 'category_id']);

            // Recently added books
            $recentBooks = Book::with('category')
                ->latest('created_at')
                ->take(5)
                ->get(['id', 'title', 'author', 'created_at', 'category_id']);

            // Books added over time (last 12 months)
            $booksByMonth = Book::query()
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, DATE_FORMAT(created_at, "%b") as month_name, COUNT(*) as total')
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('month', 'month_name')
                ->orderBy('month')
                ->get();

            // Category distribution
            $booksByCategory = Category::withCount('books')
                ->having('books_count', '>', 0)
                ->orderBy('books_count', 'desc')
                ->get(['name', 'books_count']);

            // User activity trend (registrations per month)
            $usersByMonth = User::query()
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, DATE_FORMAT(created_at, "%b") as month_name, COUNT(*) as total')
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('month', 'month_name')
                ->orderBy('month')
                ->get();

            // Recent user activity
            $recentUsers = User::role(['student', 'faculty'])
                ->latest('created_at')
                ->take(5)
                ->get(['id', 'name', 'email', 'created_at'])
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at,
                        'role' => $user->roles->first()->name ?? 'student',
                    ];
                });

            // Top rated books - OMITTED because `average_rating` and `total_ratings` columns are missing from the `books` table.
            // $topRatedBooks = Book::with('category')
            //     ->where('total_ratings', '>', 0)
            //     ->orderBy('average_rating', 'desc')
            //     ->orderBy('total_ratings', 'desc')
            //     ->take(5)
            //     ->get(['id', 'title', 'author', 'average_rating', 'total_ratings', 'category_id']);

            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'totalBooks' => $totalBooks,
                    'totalUsers' => $totalUsers,
                    'totalPrograms' => $totalPrograms,
                    'totalCategories' => $totalCategories,
                    'totalDownloads' => $totalDownloads,
                    'totalViews' => $totalViews,
                    'popularBooks' => $popularBooks,
                    'mostViewedBooks' => $mostViewedBooks,
                    'recentBooks' => $recentBooks,
                    'booksByMonth' => $booksByMonth,
                    'booksByCategory' => $booksByCategory,
                    'usersByMonth' => $usersByMonth,
                    'recentUsers' => $recentUsers,
                    // 'topRatedBooks' => $topRatedBooks,
                ],
            ]);
        }

        if ($request->user()->hasRole('student')) {
            return redirect()->route('student.books.index');
        }

        return Inertia::render('dashboard');
    }
}
