<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\DownloadLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class BookController extends Controller
{
    /**
     * Handle the book download request for any authenticated user.
     *
     * This method increments the download_count column for the given book
     * and then streams the file from storage, forcing the browser to download it.
     */
    public function download(Book $book)
    {
        // Record the download interaction
        $book->increment('download_count');

        // Log the download activity
        DownloadLog::create([
            'user_id' => Auth::id(),
            'book_id' => $book->id,
            'activity_type' => 'download',
        ]);

        // If the book does not have an associated e-book file, abort with 404
        if (!$book->ebook_url) {
            abort(404, 'E-book file not available.');
        }

        // Create a URL-friendly file name for the download.
        $fileName = Str::slug($book->title) . '.pdf';

        // Use a streamed download to fetch the content from the remote URL
        // and serve it to the user with a 'Content-Disposition: attachment' header.
        return response()->streamDownload(function () use ($book) {
            echo file_get_contents($book->ebook_url);
        }, $fileName);
    }

    /**
     * Handle the book preview request.
     *
     * This method logs the preview event and redirects the user to the ebook URL.
     */
    public function preview(Book $book)
    {
        // Log the preview activity
        DownloadLog::create([
            'user_id' => Auth::id(),
            'book_id' => $book->id,
            'activity_type' => 'preview',
        ]);

        // If the book does not have an associated e-book file, abort with 404
        if (!$book->ebook_url) {
            abort(404, 'E-book file not available.');
        }

        // Redirect to the ebook URL to be opened in a new tab
        return Redirect::to($book->ebook_url);
    }
}
