import { AddBookForm } from '@/components/add-book-form';
import AppLayout from '@/layouts/app-layout';
import { type Book, type Category } from '@/types';
import { Head } from '@inertiajs/react';

interface BooksIndexProps {
    books: Book[];
    categories: Category[];
}
export default function BooksIndex({ categories }: BooksIndexProps) {
    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <AddBookForm categories={categories} />
                        <div className="p-6 text-gray-900">Here you can manage books.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
