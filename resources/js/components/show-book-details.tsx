import { EditBookForm } from '@/components/edit-book-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Book, type Category, type Course } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Building2,
    Calendar,
    Download,
    Eye,
    FileText,
    Globe,
    Hash,
    Layers,
    Share2,
    Sparkles,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { BookmarkButton } from './bookmark-button';
import { DeleteBookDialog } from './delete-book-dialog';

interface ShowBooksDetailsProps {
    book: Book;
    categories: Category[];
    courses?: Course[];
    showAdminActions?: boolean;
}

export function ShowBookDetails({ book, categories, courses = [], showAdminActions }: ShowBooksDetailsProps) {
    const [imageError, setImageError] = useState(false);
    const isBookmarked = !!(book.bookmarks && book.bookmarks.length > 0);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleDownload = () => {
        const downloadUrl = route('books.download', book.id);
        window.open(downloadUrl, '_blank');
    };

    const handlePreview = () => {
        const previewUrl = route('books.preview', book.id);
        window.open(previewUrl, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Check out "${book.title}" by ${book.author}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const details = [
        book.isbn && { icon: Hash, label: 'ISBN', value: book.isbn },
        book.publisher && { icon: Building2, label: 'Publisher', value: book.publisher },
        book.pages && { icon: FileText, label: 'Pages', value: `${book.pages}` },
        book.language && { icon: Globe, label: 'Language', value: book.language.toUpperCase() },
        book.published_year && { icon: Calendar, label: 'Year', value: book.published_year },
    ].filter(Boolean) as { icon: typeof Hash; label: string; value: string | number }[];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80 dark:from-[#0a0a0a] dark:via-[#0c0f1a] dark:to-[#0a0a0a]">
            {/* Subtle decorative background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-1/4 -top-32 h-96 w-96 rounded-full bg-[#2A5298]/5 blur-[100px] dark:bg-[#2A5298]/10" />
                <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-[#2A5298]/5 blur-[100px] dark:bg-[#2A5298]/10" />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6">
                {/* Header */}
                <header className="flex items-center justify-between gap-3">
                    <Link href={route(showAdminActions ? 'admin.books.index' : 'student.books.index')}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="group h-9 gap-2 rounded-lg border-gray-200 bg-white px-4 text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            <span className="hidden sm:inline">Back to Library</span>
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                        {!showAdminActions && (
                            <BookmarkButton bookId={book.id} isBookmarked={isBookmarked} variant="ghost" />
                        )}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleShare}
                            className="h-9 w-9 rounded-lg border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        {showAdminActions && (
                            <>
                                <EditBookForm book={book} categories={categories} courses={courses} />
                                <DeleteBookDialog book={book} />
                            </>
                        )}
                    </div>
                </header>

                {/* Main Card */}
                <main className="mt-6">
                    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/30">
                        {/* Hero Section */}
                        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:p-6">
                            {/* Book Cover */}
                            <div className="group relative mx-auto w-full max-w-[180px] shrink-0 sm:mx-0 sm:max-w-[160px]">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100 shadow-md ring-1 ring-gray-200/80 dark:bg-neutral-800 dark:ring-neutral-700">
                                    <img
                                        src={
                                            imageError
                                                ? `https://via.placeholder.com/400x600/2A5298/FFFFFF?text=${encodeURIComponent(book.title.slice(0, 15))}`
                                                : book.cover_image_url
                                        }
                                        alt={`Cover of ${book.title}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>
                                {/* Stats overlay */}
                                <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                                    <span className="flex items-center gap-1 text-gray-500 dark:text-neutral-400">
                                        <Eye className="h-3 w-3 text-[#2A5298] dark:text-[#7da5ff]" />
                                        <span className="font-semibold text-gray-700 dark:text-neutral-200">{book.views_count || 0}</span>
                                    </span>
                                    <span className="h-3 w-px bg-gray-200 dark:bg-neutral-600" />
                                    <span className="flex items-center gap-1 text-gray-500 dark:text-neutral-400">
                                        <Download className="h-3 w-3 text-[#2A5298] dark:text-[#7da5ff]" />
                                        <span className="font-semibold text-gray-700 dark:text-neutral-200">{book.download_count || 0}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Book Info */}
                            <div className="mt-4 flex min-w-0 flex-1 flex-col sm:mt-0">
                                {/* Tags */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {book.category && (
                                        <Badge className="rounded-full border-0 bg-[#2A5298]/10 px-2.5 py-0.5 text-xs font-medium text-[#2A5298] dark:bg-[#2A5298]/20 dark:text-[#7da5ff]">
                                            <Layers className="mr-1 h-3 w-3" />
                                            {book.category.name}
                                        </Badge>
                                    )}
                                    {book.published_year && (
                                        <Badge
                                            variant="outline"
                                            className="rounded-full border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                                        >
                                            {book.published_year}
                                        </Badge>
                                    )}
                                </div>

                                {/* Title & Author */}
                                <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-[1.65rem] dark:text-white">
                                    {book.title}
                                </h1>
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
                                    <User className="h-3.5 w-3.5 text-gray-400 dark:text-neutral-500" />
                                    <span className="font-medium text-gray-700 dark:text-neutral-300">{book.author}</span>
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                    <Button
                                        onClick={handleDownload}
                                        disabled={!book.ebook_url}
                                        className="h-10 gap-2 rounded-lg bg-[#2A5298] px-5 font-medium text-white shadow-md shadow-[#2A5298]/20 transition-all hover:bg-[#1f3d73] hover:shadow-lg hover:shadow-[#2A5298]/25 disabled:opacity-40 dark:bg-[#2A5298] dark:shadow-[#2A5298]/10 dark:hover:bg-[#3a6cc4]"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handlePreview}
                                        disabled={!book.ebook_url}
                                        className="h-10 gap-2 rounded-lg border-gray-200 bg-white px-5 font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        {details.length > 0 && (
                            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6 dark:border-neutral-800 dark:bg-neutral-800/30">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                    {details.map((detail, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm transition-colors hover:border-gray-200 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:hover:border-neutral-600"
                                        >
                                            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                                                <detail.icon className="h-3 w-3" />
                                                {detail.label}
                                            </span>
                                            <span className="truncate text-sm font-medium text-gray-800 dark:text-neutral-200">{detail.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {book.description && (
                            <div className="border-t border-gray-100 px-5 py-5 sm:px-6 dark:border-neutral-800">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                                    <Sparkles className="h-3.5 w-3.5 text-[#2A5298] dark:text-[#7da5ff]" />
                                    About this book
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-neutral-400">{book.description}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-neutral-800 dark:bg-neutral-800/30 dark:text-neutral-500">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" />
                                Added{' '}
                                {new Date(book.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                            {book.language && (
                                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-neutral-700">
                                    <Globe className="h-3 w-3" />
                                    {book.language.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
