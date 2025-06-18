<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->date('published_date')->nullable();
            $table->string('isbn')->unique()->nullable();
            $table->integer('pages')->nullable();
            $table->string('language', 10)->default('en');

            //Cover Image
            $table->string('cover_image_url')->nullable();
            $table->string('cover_image_public_id')->nullable();

            //Ebook File
            $table->string('ebook_url')->nullable();
            $table->string('ebook_public_id')->nullable();

            $table->unsignedBigInteger('download_count')->default(0);
            $table->unsignedBigInteger('views_count')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
