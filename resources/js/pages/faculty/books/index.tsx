import { AppPagination } from '@/components/app-pagination';
import { BookCard } from '@/components/book-cards';
import { BookFilters } from '@/components/book-filter';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileQuestion, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface BooksIndexProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
    filters: { search: string; category: string };
}

export default function BooksIndex({ books, categories, filters }: BooksIndexProps) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search ?? '',
        category: filters.category ?? 'all',
    });
    const [isSearching, setIsSearching] = useState(false);

    const [debouncedFilters] = useDebounce(localFilters, 300);

    const handleFilterChange = (name: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [name]: value }));

        if (name === 'search') {
            setIsSearching(true);
        }
    };

    useEffect(() => {
        if (debouncedFilters.search === filters.search && debouncedFilters.category === filters.category) {
            return;
        }

        setIsSearching(true);

        router.get(route('student.books.index'), debouncedFilters, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, [debouncedFilters, filters.search, filters.category]);

    return (
        <AppLayout>
            <Head title="Browse Books" />
            <div className="p-2 lg:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Browse Books</h1>
                        <BookFilters categories={categories} filters={localFilters} onFilterChange={handleFilterChange} isSearching={isSearching} />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Search Results Info */}
                        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-3">
                            <div className="flex items-center gap-2">
                                {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span className="text-sm text-gray-600">
                                    {books.total > 0 ? (
                                        <>
                                            Showing {books.from} to {books.to} of {books.total} books
                                            {localFilters.search && <span className="font-medium"> for "{localFilters.search}"</span>}
                                        </>
                                    ) : (
                                        'No books found'
                                    )}
                                </span>
                            </div>

                            {/* Quick Stats */}
                            {books.total > 0 && (
                                <div className="text-xs text-gray-500">
                                    Page {books.current_page} of {books.last_page}
                                </div>
                            )}
                        </div>

                        {/* Books Grid */}
                        {books.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {books.data.map((book) => (
                                    <BookCard key={book.id} book={book} categories={categories} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                                <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    {localFilters.search ? 'No Search Results' : 'No Books Found'}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    {localFilters.search
                                        ? `No books found matching "${localFilters.search}". Try different keywords or browse categories.`
                                        : "We couldn't find any books matching your filters. Try adjusting your search criteria."}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {books.last_page > 1 && (
                            <div className="flex justify-center border-t bg-gray-50 p-4">
                                <AppPagination data={books} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
