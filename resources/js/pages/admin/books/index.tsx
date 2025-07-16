import { AddBookForm } from '@/components/add-book-form';
import { AppPagination } from '@/components/app-pagination';
import { DeleteBookDialog } from '@/components/delete-book-dialog';
import { EditBookForm } from '@/components/edit-book-form';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category, type Course } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface BooksIndexProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
    courses: Course[];
}

export default function BooksIndex({ books, categories, courses }: BooksIndexProps) {
    const handleBookAdded = () => {
        router.reload({ only: ['books'] });
    };

    const handleBookUpdated = () => {
        router.reload({ only: ['books'] });
    };

    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading title="Manage Books" description="Manage all books in the library system." />
                        <AddBookForm categories={categories} courses={courses} onBookAdded={handleBookAdded} />
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
                                                    <Button variant="ghost" size="sm">
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
