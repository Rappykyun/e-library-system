import { BookCard } from '@/components/book-cards';
import AppLayout from '@/layouts/app-layout';
import { Course } from '@/types';
import { Head } from '@inertiajs/react';

interface CourseShowProps extends Record<string, unknown> {
    course: Course;
}

export default function CourseShow({ course }: PageProps<CourseShowProps>) {
    const books = course.shelf_books ?? [];

    return (
        <AppLayout>
            <Head title={course.name} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">{course.name}</h1>
                        {course.description && <p className="text-muted-foreground">{course.description}</p>}
                    </div>
                    <div className="mt-6">
                        {books.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {books.map((book) => (
                                    <BookCard key={book.id} book={book} categories={[]} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-muted-foreground">No books have been added to this course's shelf yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
