import { ShowBookDetails } from '@/components/show-book-details';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type Book,type Category } from '@/types';
import { Head } from '@inertiajs/react';

interface BookProps {
    book: Book;
    categories: Category[],
}

export default function ShowBook({ book ,categories}: BookProps) {
    return (
        <AppHeaderLayout>
        <Head title={book.title } />
            <ShowBookDetails book={book} categories={categories} />
        </AppHeaderLayout>
    );
}
