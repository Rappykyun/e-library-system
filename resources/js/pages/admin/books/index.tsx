import { AddBookForm } from '@/components/add-book-form';
import { AppPagination } from '@/components/app-pagination';
import { DeleteBookDialog } from '@/components/delete-book-dialog';
import { EditBookForm } from '@/components/edit-book-form';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category, type Course } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Eye } from 'lucide-react';

interface BooksIndexProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
    courses: Course[];
}

export default function BooksIndex({ books, categories, courses }: BooksIndexProps) {
    const handleBookAdded = () => {
  //refresh the current page
        router.reload({ only: ['books'] });
    };

    const handleBookUpdated = () => {
        // Refresh the current page 
        router.reload({ only: ['books'] });
    };

    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="p-2 lg:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Manage Books</h1>
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
                                        <TableCell className="w-20">
                                            <div className="h-30 w-24 overflow-hidden rounded border">
                                                {book.cover_image_url ? (
                                                    <img
                                                        src={book.cover_image_url}
                                                        alt={`Thumbnail of ${book.title}`}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="max-w-xs">
                                                <p className="truncate font-semibold">{book.title}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{book.author.length > 25 ? `${book.author.slice(0, 25)}...` : book.author}</TableCell>
                                        <TableCell>{book.category?.name}</TableCell>
                                        <TableCell>{book.views_count}</TableCell>
                                        <TableCell>{book.download_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={route('admin.books.show', book.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
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

                    {books.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <AppPagination data={books} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
