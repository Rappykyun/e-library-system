<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\DownloadLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookController extends Controller
{
    /**
     * Handle the book download request for any authenticated user.
     *
     * This method increments the download_count column for the given book
     * and then streams the file from local storage, forcing the browser to download it.
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
        $disk = config('book_storage.local_disk', 'public');

        // For local storage, we need to handle it differently
        if ($book->ebook_public_id && Storage::disk($disk)->exists($book->ebook_public_id)) {
            return Storage::disk($disk)->download($book->ebook_public_id, $fileName);
        }

        // Fallback for books that might still use remote URLs (legacy support)
        if (filter_var($book->ebook_url, FILTER_VALIDATE_URL)) {
            return response()->streamDownload(function () use ($book) {
                echo file_get_contents($book->ebook_url);
            }, $fileName);
        }

        return back()->with('error', 'File not found.');
    }

    /**
     * Handle the book preview request.
     *
     * This method logs the preview event and serves the PDF for inline viewing.
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

        // For local storage, serve the file directly for inline viewing
        $disk = config('book_storage.local_disk', 'public');
        if ($book->ebook_public_id && Storage::disk($disk)->exists($book->ebook_public_id)) {
            return Storage::disk($disk)->response($book->ebook_public_id, null, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . Str::slug($book->title) . '.pdf"'
            ]);
        }

        // Fallback for books that might still use remote URLs (legacy support)
        if (filter_var($book->ebook_url, FILTER_VALIDATE_URL)) {
            return Redirect::to($book->ebook_url);
        }

        return back()->with('error', 'File not found.');
    }
}
