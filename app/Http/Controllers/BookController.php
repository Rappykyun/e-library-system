<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class BookController extends Controller
{
    /**
     * Handle the book download request for any authenticated user.
     *
     * This method increments the download_count column for the given book
     * and then redirects the requester to the remote PDF file stored in Cloudinary
     * (or any other storage provider) so that the browser initiates the download.
     */
    public function download(Book $book): RedirectResponse
    {
        // Record the download interaction
        $book->increment('download_count');

        // If the book does not have an associated e-book file, abort with 404
        if (!$book->ebook_url) {
            abort(404, 'E-book file not available.');
        }

        // Build a Cloudinary URL that forces download. Adding the `fl_attachment` flag
        // sets the Content-Disposition header to `attachment` so the browser saves
        // the file instead of rendering it in a viewer.

        $downloadUrl = $book->ebook_url;

        // Example Cloudinary URL structure:
        // https://res.cloudinary.com/<cloud_name>/image/upload/v123456/ebooks/foo.pdf
        // We need to insert 'fl_attachment' right after 'upload/'.

        // If the URL already contains the flag we leave it untouched.
        if (!str_contains($downloadUrl, '/upload/fl_attachment')) {
            $downloadUrl = preg_replace('/\/upload\//', '/upload/fl_attachment/', $downloadUrl, 1);
        }

        return Redirect::away($downloadUrl);
    }
}
