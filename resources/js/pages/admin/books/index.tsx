import { AddBookForm } from '@/components/add-book-form';
import { AppPagination } from '@/components/app-pagination';
import { BookFilters } from '@/components/book-filter';
import { DeleteBookDialog } from '@/components/delete-book-dialog';
import { EditBookForm } from '@/components/edit-book-form';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category, type Course } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface BooksIndexProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
    courses: Course[];
    filters: { search: string; category: string };
}

export default function BooksIndex({ books, categories, courses, filters }: BooksIndexProps) {
    const isInitialRender = useRef(true);

    // Normalize filters to handle null/undefined values
    const normalizedFilters = {
        search: filters.search || '',
        category: filters.category || 'all',
    };

    const [localFilters, setLocalFilters] = useState(normalizedFilters);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce for better UX
    const [debouncedFilters] = useDebounce(localFilters, 300);

    const handleBookAdded = () => {
        router.reload({ only: ['books'] });
    };

    const handleBookUpdated = () => {
        router.reload({ only: ['books'] });
    };

    const handleFilterChange = (name: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [name]: value }));

        if (name === 'search') {
            setIsSearching(true);
        }
    };

    useEffect(() => {
        // Skip search on initial render to avoid loading indicator on page refresh
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        // Check if filters actually changed
        if (debouncedFilters.search === normalizedFilters.search && debouncedFilters.category === normalizedFilters.category) {
            return;
        }

        setIsSearching(true);

        router.get(route('admin.books.index'), debouncedFilters, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, [debouncedFilters, normalizedFilters.search, normalizedFilters.category]);

    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading title="Manage Books" description="Manage all books in the library system." />
                        <AddBookForm categories={categories} courses={courses} onBookAdded={handleBookAdded} />
                    </div>

                    {/* Search Filters */}
                    <div className="mb-4 flex items-center justify-between">
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
                        <BookFilters categories={categories} filters={localFilters} onFilterChange={handleFilterChange} isSearching={isSearching} />
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Downloads</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.data.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell>
                                            <img
                                                src={book.cover_image_url || '/placeholder-book.jpg'}
                                                alt={book.title}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.category.name}</TableCell>
                                        <TableCell>{book.views_count}</TableCell>
                                        <TableCell>{book.download_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={route('admin.books.show', book.id)}>
                                                    <Button variant="ghost" size="sm" className="hover:bg-gray-300">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <EditBookForm
                                                    book={book}
                                                    categories={categories}
                                                    courses={courses}
                                                    onBookUpdated={handleBookUpdated}
                                                />
                                                <DeleteBookDialog book={book} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="pt-4">
                        <AppPagination data={books} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
