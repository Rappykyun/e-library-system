import { AppPagination } from '@/components/app-pagination';
import { BookCard } from '@/components/book-cards';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type Book, type PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookMarked, Library } from 'lucide-react';

interface BookmarksIndexProps {
    bookmarks: PaginatedResponse<Book>;
}

export default function BookmarksIndex({ bookmarks }: BookmarksIndexProps) {
    return (
        <AppLayout>
            <Head title="My Bookmarks" />
            <div className="p-2 lg:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">My Bookmarks</h1>
                        <Link href={route('student.books.index')}>
                            <Button variant="outline" className="gap-2">
                                <Library className="h-4 w-4" />
                                Browse Books
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {bookmarks.total > 0 && (
                            <div className="p-6 pb-0 text-sm text-gray-500">
                                Showing {bookmarks.from} to {bookmarks.to} of {bookmarks.total} bookmarked books.
                            </div>
                        )}

                        {bookmarks.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {bookmarks.data.map((book) => (
                                    <BookCard key={book.id} book={book} categories={[]} showAdminActions={false} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                                <BookMarked className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">No Bookmarks Yet</h3>
                                <p className="mt-2 text-sm text-gray-500">Start browsing books and bookmark your favorites to see them here.</p>
                                <Link href={route('student.books.index')} className="mt-4">
                                    <Button className="gap-2">
                                        <Library className="h-4 w-4" />
                                        Browse Books
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {bookmarks.last_page > 1 && (
                            <div className="flex justify-center p-4">
                                <AppPagination data={bookmarks} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
