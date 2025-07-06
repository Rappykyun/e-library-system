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
        'average_rating',
        'total_ratings',
        'downloads_count',
    ];

    protected $casts = [
        'average_rating' => 'decimal:1',
        'total_ratings' => 'integer',
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

    public function bookMarks(): HasMany
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
        return $this->bookMarks()->where('user_id', $user->id)->exists();
    }

    public function getUserRating(?User $user): ?int
    {
        if (!$user)
            return null;
        return $this->ratings()->where('user_id', $user->id)->value('rating');
    }

    public function getAverageRating(): void
    {
        $avg = $this->ratings()->avg('rating');
        $count = $this->ratings()->count();

        $this->update([
            'average_rating' => $avg ? round($avg, 1) : 0,
            'total_ratings' => $count,
        ]);
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
        if (!$search)
            return $query;

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('author', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('isbn', 'like', "%{$search}%");
        });
    }

    public function scopeFilterBy($query, array $filters)
    {
        return $query
            ->when($filters['category'] ?? null, function ($q, $category) {
                if ($category !== 'all') {
                    $q->whereHas('category', fn($cat) => $cat->where('slug', $category));
                }
            })
            ->when($filters['rating'] ?? null, function ($q, $rating) {
                $q->where('average_rating', '>=', $rating);
            })
            ->when($filters['year'] ?? null, function ($q, $year) {
                $q->where('published_year', $year);
            })
            ->when($filters['language'] ?? null, function ($q, $language) {
                $q->where('language', $language);
            });
    }
}
