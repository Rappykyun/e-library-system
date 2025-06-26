import { AppPagination } from '@/components/app-pagination';
import { BookCard } from '@/components/book-cards';
import { BookFilters } from '@/components/book-filter';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileQuestion } from 'lucide-react';
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

    const [debouncedFilters] = useDebounce(localFilters, 100);
    const handleFilterChange = (name: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        router.get(route('student.books.index'), debouncedFilters, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedFilters]);
    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="p-2 lg:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Browse Books</h1>
                        <BookFilters categories={categories} filters={localFilters} onFilterChange={handleFilterChange} />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {books.total > 0 && (
                            <div className="text-sm text-gray-500">
                                Showing {books.from} to {books.to} of {books.total} books.
                            </div>
                        )}
                        {/* <div className="p-6 text-gray-900">Here you can browse books.</div> */}
                        {books.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {books.data.map((book) => (
                                    <BookCard key={book.id} book={book} categories={categories} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                                <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">No Books Found</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    We couldn't find any books matching your search. Try adjusting your filters.
                                </p>
                            </div>
                        )}
                        {books.last_page > 1 && (
                            <div className="flex justify-center p-4">
                                <AppPagination data={books} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
