<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'program_id',
        'description',
        'status',
    ];

    protected $appends = [
        'outdated_books_count',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function shelfBooks(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'course_book');
    }

    public function faculty(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_user');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_student');
    }

    /**
     * Get the count of outdated books on this course's shelf.
     * A book is considered outdated if it was published more than 5 years ago.
     */
    public function getOutdatedBooksCountAttribute(): int
    {
        if (!$this->relationLoaded('shelfBooks')) {
            return 0;
        }

        $cutoffYear = Carbon::now()->subYears(5)->year;

        return $this->shelfBooks->filter(function ($book) use ($cutoffYear) {
            // Handle both string and integer published_year
            if (!$book->published_year) {
                return false;
            }

            $publishedYear = is_string($book->published_year) ? (int) $book->published_year : $book->published_year;

            return $publishedYear > 0 && $publishedYear < $cutoffYear;
        })->count();
    }
}
