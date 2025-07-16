import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Book, Course, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Building2, Calendar, FileText, Hash, Tag, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface FacultyCourseShowProps extends PageProps {
    course: Course;
    allBooks: Book[];
}

export default function FacultyCourseShow({ auth, course, allBooks }: FacultyCourseShowProps) {
    const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
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

    const isBookOutdated = (book: Book): boolean => {
        if (!book.published_year) return false;
        const cutoffYear = new Date().getFullYear() - 5;
        return parseInt(book.published_year.toString()) < cutoffYear;
    };

    const BookCard = ({ book }: { book: Book }) => {
        const isOutdated = isBookOutdated(book);
        const isSelected = data.book_ids.includes(book.id);

        return (
            <Card
                className={`transition-all duration-200 ${isSelected ? 'border-primary shadow-md' : 'hover:shadow-sm'} ${isOutdated ? 'border-l-4 border-l-destructive' : ''}`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id={`book-${book.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleCheckboxChange(book.id, Boolean(checked))}
                            className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                                    <div className="mt-1 flex items-center gap-1">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                    </div>
                                </div>
                                {isOutdated && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-destructive" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>This book is outdated (published more than 5 years ago)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-3">
                            {book.publisher && (
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Publisher:</span>
                                    <span>{book.publisher}</span>
                                </div>
                            )}
                            {book.published_year && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Published:</span>
                                    <span className={isOutdated ? 'font-medium text-destructive' : ''}>{book.published_year}</span>
                                </div>
                            )}
                            {book.pages && (
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Pages:</span>
                                    <span>{book.pages}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            {book.isbn && (
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">ISBN:</span>
                                    <span className="font-mono text-xs">{book.isbn}</span>
                                </div>
                            )}
                            {book.category && (
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Category:</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {book.category.name}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                    {book.description && (
                        <div className="mt-4 border-t pt-3">
                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{book.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const outdatedBooksCount = allBooks.filter((book) => data.book_ids.includes(book.id) && isBookOutdated(book)).length;

    return (
        <AppLayout user={auth.user}>
            <Head title={`Manage Shelf for ${course.name}`} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="mb-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Manage "{course.name}" Shelf</h1>
                                    <p className="text-muted-foreground">Select the books to include on this course's shelf.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedView(selectedView === 'grid' ? 'list' : 'grid')}
                                    >
                                        {selectedView === 'grid' ? 'List View' : 'Grid View'}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Shelf'}
                                    </Button>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span>{data.book_ids.length} books selected</span>
                                </div>
                                {outdatedBooksCount > 0 && (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>{outdatedBooksCount} outdated books selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={selectedView === 'grid' ? 'grid gap-4 sm:grid-cols-1 lg:grid-cols-2' : 'space-y-4'}>
                            {allBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
