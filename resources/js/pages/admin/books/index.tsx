import { AddBookForm } from '@/components/add-book-form';
import { BookCard } from '@/components/book-cards';
import AppLayout from '@/layouts/app-layout';
import { type Book, type Category } from '@/types';
import { Head } from '@inertiajs/react';
interface BooksIndexProps {
    books: Book[];
    categories: Category[];
}
export default function BooksIndex({ books, categories }: BooksIndexProps) {
    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Manage Books</h1>
                        <AddBookForm categories={categories} />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Here you can manage books.</div>

                        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} categories={categories} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
