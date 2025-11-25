<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            // Add individual indexes for common search fields
            $table->index('title', 'books_title_index');
            $table->index('author', 'books_author_index');
            $table->index('category_id', 'books_category_id_index');
            $table->index('published_year', 'books_published_year_index');
            $table->index('language', 'books_language_index');

            // Add composite indexes for common filter combinations
            $table->index(['category_id', 'title'], 'books_category_title_index');
            $table->index(['published_year', 'title'], 'books_year_title_index');
            $table->index(['language', 'title'], 'books_language_title_index');

            // Add index for sorting (most common: latest books)
            $table->index('created_at', 'books_created_at_index');

            // Add index for popular books (views and downloads)
            $table->index('views_count', 'books_views_count_index');
            $table->index('download_count', 'books_download_count_index');
        });

        // Add full-text search index for better search performance
        DB::statement('ALTER TABLE books ADD FULLTEXT(title, author, description)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            // Drop individual indexes
            $table->dropIndex('books_title_index');
            $table->dropIndex('books_author_index');
            $table->dropIndex('books_category_id_index');
            $table->dropIndex('books_published_year_index');
            $table->dropIndex('books_language_index');

            // Drop composite indexes
            $table->dropIndex('books_category_title_index');
            $table->dropIndex('books_year_title_index');
            $table->dropIndex('books_language_title_index');

            // Drop sorting indexes
            $table->dropIndex('books_created_at_index');
            $table->dropIndex('books_views_count_index');
            $table->dropIndex('books_download_count_index');
        });

        // Drop full-text index
        DB::statement('ALTER TABLE books DROP INDEX title');
    }
};