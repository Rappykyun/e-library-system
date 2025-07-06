import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Book, Course, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface FacultyCourseShowProps extends PageProps {
    course: Course;
    allBooks: Book[];
}

export default function FacultyCourseShow({ auth, course, allBooks }: FacultyCourseShowProps) {
    const { data, setData, put, processing } = useForm({
        book_ids: course.shelf_books?.map((b) => b.id) || [],
    });

    const handleCheckboxChange = (bookId: number, checked: boolean) => {
        let currentIds = data.book_ids;
        if (checked) {
            setData('book_ids', [...currentIds, bookId]);
        } else {
            setData(
                'book_ids',
                currentIds.filter((id) => id !== bookId),
            );
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('faculty.courses.update', course.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Manage Shelf for ${course.name}`} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Manage "{course.name}" Shelf</h1>
                                <p className="text-muted-foreground">Select the books to include on this course's shelf.</p>
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Shelf'}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {allBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="flex items-center gap-4 rounded-md border p-4 transition-all has-[:checked]:border-primary"
                                >
                                    <Checkbox
                                        id={`book-${book.id}`}
                                        checked={data.book_ids.includes(book.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(book.id, Boolean(checked))}
                                    />
                                    <label htmlFor={`book-${book.id}`} className="w-full cursor-pointer">
                                        <p className="font-medium">{book.title}</p>
                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
