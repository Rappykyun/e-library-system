<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Mathematics',
                'description' => 'Books covering algebra, geometry, calculus, and other mathematical disciplines.'
            ],
            [
                'name' => 'Science',
                'description' => 'Books on biology, chemistry, physics, and other scientific fields.'
            ],
            [
                'name' => 'Technology',
                'description' => 'Books about advancements in technology, engineering, and innovation.'
            ],
            [
                'name' => 'Humanities',
                'description' => 'Books on literature, philosophy, arts, and cultural studies.'
            ],
            [
                'name' => 'Social Sciences',
                'description' => 'Books about sociology, psychology, economics, and political science.'
            ],
            [
                'name' => 'Education',
                'description' => 'Books on teaching methods, curriculum development, and educational research.'
            ],
            [
                'name' => 'Business',
                'description' => 'Books on management, entrepreneurship, finance, and marketing.'
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
            ]);
        }
    }
}
