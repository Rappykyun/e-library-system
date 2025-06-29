import { AddBookForm } from '@/components/add-book-form';
import { AppPagination } from '@/components/app-pagination';
import { DeleteBookDialog } from '@/components/delete-book-dialog';
import { EditBookForm } from '@/components/edit-book-form';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type Book, type Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface BooksIndexProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
}

export default function BooksIndex({ books, categories }: BooksIndexProps) {
    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="p-2 lg:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Manage Books</h1>
                        <AddBookForm categories={categories} />
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
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
                                        <TableCell className="font-medium ">
                                            <div className="flex items-center gap-2">
                                                <img src={book.cover_image_url} alt={book.title} className="h-30 w-25 object-cover" />
                                                {book.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className='item-center'>{book.author}</TableCell>
                                        <TableCell className='item-center'>{book.category?.name}</TableCell>
                                        <TableCell className='items-center'>{book.views_count}</TableCell>
                                        <TableCell>{book.download_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={route('admin.books.show', book.id)}>
                                                    <Button variant="outline" className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <EditBookForm book={book} categories={categories} />
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
