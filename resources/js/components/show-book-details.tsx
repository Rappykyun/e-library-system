import { EditBookForm } from '@/components/edit-book-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Book, type Category } from '@/types';
import { Link } from '@inertiajs/react';
import { DeleteBookDialog } from './delete-book-dialog';
import { ArrowLeft, BookOpen, Building2, Calendar, Download, Eye, FileText, Globe, Hash, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface ShowBooksDetailsProps {
    book: Book;
    categories: Category[];
    showAdminActions?: boolean;
}

export function ShowBookDetails({ book, categories,showAdminActions }: ShowBooksDetailsProps) {

    console.log('Categories:',categories)
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleDownload = () => {
        if (book.ebook_url) {
            window.open(book.ebook_url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header with back button */}
                <div className="mb-8 flex justify-between">
                    <Link href={route(showAdminActions ? 'admin.books.index' : 'student.books.index')}>
                        <Button variant="outline" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Library
                        </Button>
                    </Link>
                    
                    {showAdminActions && (
                        <div className="flex gap-2">
                            <EditBookForm book={book} categories={categories} />
                            <DeleteBookDialog book={book} />
                        </div>
                    )}
                </div>

                {/* Main content grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left column - Book cover and actions */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Book cover */}
                                    <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-xl shadow-lg">
                                        <img
                                            src={
                                                imageError
                                                    ? `https://via.placeholder.com/400x600/4A90E2/FFFFFF?text=${encodeURIComponent(book.title)}`
                                                    : book.cover_image_url
                                            }
                                            alt={`Cover of ${book.title}`}
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={handleImageError}
                                        />
                                        {/* Category badge overlay */}
                                        {book.category && (
                                            <Badge className="absolute top-3 right-3 bg-black/70 text-white">{book.category.name}</Badge>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="space-y-3">
                                        <Button onClick={handleDownload} className="w-full" size="lg" disabled={!book.ebook_url}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </Button>

                                        <Button variant="outline" className="w-full" size="lg">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview Online
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column - Book details */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {/* Title and author */}
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{book.title}</h1>
                                <div className="flex items-center gap-2 text-xl text-gray-600">
                                    <User className="h-5 w-5" />
                                    <span>by {book.author}</span>
                                </div>
                            </div>

                            {/* Description */}
                            {book.description && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="leading-relaxed text-gray-700">{book.description}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Book details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Book Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {book.isbn && (
                                            <div className="flex items-center gap-3">
                                                <Hash className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">ISBN</p>
                                                    <p className="text-gray-900">{book.isbn}</p>
                                                </div>
                                            </div>
                                        )}

                                        {book.publisher && (
                                            <div className="flex items-center gap-3">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Publisher</p>
                                                    <p className="text-gray-900">{book.publisher}</p>
                                                </div>
                                            </div>
                                        )}

                                        {book.published_year && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Published Year</p>
                                                    <p className="text-gray-900">{book.published_year}</p>
                                                </div>
                                            </div>
                                        )}

                                        {book.pages && (
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Pages</p>
                                                    <p className="text-gray-900">{book.pages}</p>
                                                </div>
                                            </div>
                                        )}

                                        {book.category && (
                                            <div className="flex items-center gap-3">
                                                <Tag className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Category</p>
                                                    <Badge variant="secondary">{book.category.name}</Badge>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Language</p>
                                                <p className="text-gray-900">{book.language || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Library Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Added to Library</p>
                                            <p className="text-gray-900">
                                                {new Date(book.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="text-gray-900">
                                                {new Date(book.updated_at).toLocaleDateString('en-US', {
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
    );
}
