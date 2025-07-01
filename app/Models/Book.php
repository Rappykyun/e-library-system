<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

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
        'cover_image_url',
        'cover_image_public_id',
        'ebook_url',
        'ebook_public_id',
        'views_count',
        'thumbnail_public_id',
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
