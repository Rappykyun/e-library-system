import { EditBookForm } from '@/components/edit-book-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Book, type Category } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Building2, Calendar, Download, Eye, FileText, Globe, Hash, Share2, Star, Tag, User } from 'lucide-react';
import { useState } from 'react';
import { BookmarkButton } from './bookmark-button';
import { DeleteBookDialog } from './delete-book-dialog';

interface ShowBooksDetailsProps {
    book: Book;
    categories: Category[];
    showAdminActions?: boolean;
}

export function ShowBookDetails({ book, categories, showAdminActions }: ShowBooksDetailsProps) {
    const [imageError, setImageError] = useState(false);
    const isBookmarked = !!(book.bookmarks && book.bookmarks.length > 0);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleDownload = () => {
        const downloadUrl = route('books.download', book.id);
        window.location.href = downloadUrl;
    };

    const handlePreview = () => {
        if (book.ebook_url) {
            window.open(book.ebook_url, '_blank');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Check out "${book.title}" by ${book.author}`,
                url: window.location.href,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            {/* Hero Section with Blurred Background */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
                <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Navigation */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link href={route(showAdminActions ? 'admin.books.index' : 'student.books.index')}>
                            <Button variant="ghost" className="group border border-white/20 backdrop-blur-sm hover:bg-white/60">
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Library
                            </Button>
                        </Link>

                        <div className="flex gap-2">
                            {/* Quick Actions */}
                            {!showAdminActions && <BookmarkButton bookId={book.id} isBookmarked={isBookmarked} variant="ghost" />}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="border border-white/20 backdrop-blur-sm hover:bg-white/60"
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>

                            {showAdminActions && (
                                <>
                                    <EditBookForm book={book} categories={categories} />
                                    <DeleteBookDialog book={book} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column - Book Cover and Actions */}
                        <div className="lg:col-span-4 xl:col-span-3">
                            <div className="sticky top-6 space-y-6">
                                {/* Book Cover Card */}
                                <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Enhanced Book Cover */}
                                            <div className="group relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
                                                <img
                                                    src={
                                                        imageError
                                                            ? `https://via.placeholder.com/400x600/4A90E2/FFFFFF?text=${encodeURIComponent(book.title)}`
                                                            : book.cover_image_url
                                                    }
                                                    alt={`Cover of ${book.title}`}
                                                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                                                    onError={handleImageError}
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

                                                {/* Category badge overlay */}
                                                {book.category && (
                                                    <Badge className="absolute top-3 right-3 border-0 bg-black/80 text-white backdrop-blur-sm">
                                                        {book.category.name}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/80 p-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">{book.views_count || 0}</span>
                                                    <span className="text-gray-500">views</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Download className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium">{book.download_count || 0}</span>
                                                    <span className="text-gray-500">downloads</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleDownload}
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:from-blue-700 hover:to-blue-800"
                                                size="lg"
                                                disabled={!book.ebook_url}
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download PDF
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/80"
                                                size="lg"
                                                onClick={handlePreview}
                                                disabled={!book.ebook_url}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview Online
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Right Column - Book Information */}
                        <div className="lg:col-span-8 xl:col-span-9">
                            <div className="space-y-6">
                                {/* Title and Author Section */}
                                <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                                    {book.title}
                                                </h1>
                                                <div className="flex items-center gap-3 text-lg text-gray-600 sm:text-xl">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                    <span>
                                                        by <span className="font-semibold text-gray-800">{book.author}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Rating placeholder */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">(4.5 • 124 reviews)</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Description */}
                                {book.description && (
                                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                        <CardHeader className="pt-2">
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                Description
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="">
                                            <p className="text-base leading-relaxed text-gray-700">{book.description}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Book Details Grid */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Publication Details */}
                                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                        <CardHeader className="pt-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <BookOpen className="h-5 w-5 text-green-600" />
                                                Publication Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {book.isbn && (
                                                <div className="flex items-start gap-3">
                                                    <Hash className="mt-1 h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-500">ISBN</p>
                                                        <p className="font-mono text-sm text-gray-900">{book.isbn}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {book.publisher && (
                                                <div className="flex items-start gap-3">
                                                    <Building2 className="mt-1 h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-500">Publisher</p>
                                                        <p className="text-gray-900">{book.publisher}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {book.published_year && (
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="mt-1 h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-500">Published Year</p>
                                                        <p className="text-gray-900">{book.published_year}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {book.pages && (
                                                <div className="flex items-start gap-3">
                                                    <FileText className="mt-1 h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-500">Pages</p>
                                                        <p className="text-gray-900">{book.pages} pages</p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Tag className="h-5 w-5 text-purple-600" />
                                                Additional Info
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {book.category && (
                                                <div className="flex items-start gap-3">
                                                    <Tag className="mt-1 h-4 w-4 text-gray-400" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                                        <Badge variant="secondary" className="mt-1">
                                                            {book.category.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-3">
                                                <Globe className="mt-1 h-4 w-4 text-gray-400" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500">Language</p>
                                                    <p className="text-gray-900">{book.language || 'English'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Calendar className="mt-1 h-4 w-4 text-gray-400" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500">Added to Library</p>
                                                    <p className="text-gray-900">
                                                        {new Date(book.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
