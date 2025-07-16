<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'description',
        'isbn',
        'published_year',
        'pages',
        'language',
        'category_id',
        'course_id',
        'cover_image_url',
        'cover_image_public_id',
        'ebook_url',
        'ebook_public_id',
        'views_count',
        'thumbnail_public_id',
        'downloads_count',
    ];

    protected $casts = [
        'download_count' => 'integer',
        'views_count' => 'integer',
        'pages' => 'integer',
        'published_year' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function coursesOnShelf(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_book');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function bookmarkedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'bookmarks');
    }

    public function ratedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'ratings');
    }

    public function isBookmarkedBy(?User $user): bool
    {
        if (!$user)
            return false;
        return $this->bookmarks()->where('user_id', $user->id)->exists();
    }

    public function getUserRating(?User $user): ?int
    {
        if (!$user)
            return null;
        return $this->ratings()->where('user_id', $user->id)->value('rating');
    }



    public function scopeWithUserData($query, ?User $user)
    {
        if (!$user)
            return $query;

        return $query->with([
            'bookmarks' => fn($q) => $q->where('user_id', $user->id),
            'ratings' => fn($q) => $q->where('user_id', $user->id),
        ]);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        $search = trim($search);

        // Use full-text search for better performance and relevance
        if (strlen($search) >= 3) {
            return $query->whereRaw(
                'MATCH(title, author, description) AGAINST(? IN BOOLEAN MODE)',
                ['+' . str_replace(' ', ' +', $search) . '*']
            );
        }

        // Fallback to LIKE search for short queries, but optimize with indexes
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', $search . '%')  // Use prefix search for better index usage
                ->orWhere('author', 'like', $search . '%')
                ->orWhere('title', 'like', '%' . $search . '%')  // Fallback to contains search
                ->orWhere('author', 'like', '%' . $search . '%');
        });
    }

    public function scopeFilterBy($query, array $filters)
    {
        return $query
            ->when($filters['category'] ?? null, function ($q, $category) {
                if ($category !== 'all') {
                    // Use direct column comparison instead of whereHas for better performance
                    $q->whereHas('category', fn($cat) => $cat->where('slug', $category));
                }
            })

            ->when($filters['year'] ?? null, function ($q, $year) {
                $q->where('published_year', $year);
            })
            ->when($filters['language'] ?? null, function ($q, $language) {
                $q->where('language', $language);
            });
    }

    /**
     * Optimized scope for fast search with minimal database queries
     */
    public function scopeFastSearch($query, ?string $search, ?string $category = null)
    {
        if (!$search && !$category) {
            return $query;
        }

        // Apply search filter
        if ($search) {
            $query->search($search);
        }

        // Apply category filter efficiently
        if ($category && $category !== 'all') {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        return $query;
    }

    /**
     * Get popular books efficiently
     */
    public function scopePopular($query, int $limit = 10)
    {
        return $query->orderByDesc('views_count')
            ->orderByDesc('download_count')
            ->limit($limit);
    }

    /**
     * Get recent books efficiently
     */
    public function scopeRecent($query, int $limit = 10)
    {
        return $query->orderByDesc('created_at')
            ->limit($limit);
    }
}
