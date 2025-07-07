<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'program_id', 'description'];

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
}
