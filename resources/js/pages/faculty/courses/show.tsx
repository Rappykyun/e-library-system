import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Book, Category, Course, PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Filter, Grid3X3, List, Loader2, Search, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface FacultyCourseShowProps extends PageProps {
    course: Course;
    allBooks: Book[];
    categories: Category[];
    filters: { search: string; category: string };
}

export default function FacultyCourseShow({ auth, course, allBooks, categories, filters }: FacultyCourseShowProps) {
    const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        category: filters.category || 'all',
    });
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, put, processing } = useForm({
        book_ids: course.shelf_books?.map((b) => b.id) || [],
    });

    // Debounce search for better performance
    const [debouncedFilters] = useDebounce(localFilters, 300);

    const handleFilterChange = (name: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
        if (name === 'search') {
            setIsSearching(true);
        }
    };

    const clearSearch = () => {
        setLocalFilters((prev) => ({ ...prev, search: '' }));
    };

    useEffect(() => {
        if (debouncedFilters.search === filters.search && debouncedFilters.category === filters.category) {
            return;
        }

        setIsSearching(true);
        router.get(route('faculty.courses.show', course.id), debouncedFilters, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, [debouncedFilters]);

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

    const outdatedBooksCount = data.book_ids.filter((id) => {
        const book = allBooks.find((b) => b.id === id);
        return book && isBookOutdated(book);
    }).length;

    const CompactBookCard = ({ book }: { book: Book }) => {
        const isOutdated = isBookOutdated(book);
        const isSelected = data.book_ids.includes(book.id);

        return (
            <div
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:bg-muted/50 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                } ${isOutdated ? 'border-l-4 border-l-destructive' : ''}`}
            >
                <Checkbox
                    id={`book-${book.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(book.id, Boolean(checked))}
                />

                <div className="flex min-w-0 flex-1 items-center gap-3">
                    {/* Book Cover - Compact */}
                    <div className="relative h-12 w-9 flex-shrink-0">
                        {book.cover_image_url ? (
                            <img src={book.cover_image_url} alt={book.title} className="h-full w-full rounded object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded bg-muted">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Book Info - Compact */}
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start gap-2">
                            <h4 className="line-clamp-1 text-sm font-medium">{book.title}</h4>
                            {isOutdated && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Book is more than 5 years old</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{book.author}</span>
                            {book.category && (
                                <>
                                    <span>•</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {book.category.name}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const GridBookCard = ({ book }: { book: Book }) => {
        const isOutdated = isBookOutdated(book);
        const isSelected = data.book_ids.includes(book.id);

        return (
            <Card
                className={`transition-all duration-200 ${
                    isSelected ? 'border-primary shadow-md' : 'hover:shadow-sm'
                } ${isOutdated ? 'border-l-4 border-l-destructive' : ''}`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id={`book-${book.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleCheckboxChange(book.id, Boolean(checked))}
                            className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="line-clamp-2 text-sm leading-tight font-medium">{book.title}</h4>
                                {isOutdated && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Book is more than 5 years old</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{book.author}</p>
                                {book.category && (
                                    <Badge variant="secondary" className="text-xs">
                                        {book.category.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        );
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Manage Shelf for ${course.name}`} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        {/* Header */}
                        <div className="mb-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Manage "{course.name}" Shelf</h1>
                                    <p className="text-sm text-muted-foreground">Select books to include on this course's shelf</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedView(selectedView === 'grid' ? 'list' : 'grid')}
                                    >
                                        {selectedView === 'grid' ? (
                                            <>
                                                <List className="mr-2 h-4 w-4" />
                                                List
                                            </>
                                        ) : (
                                            <>
                                                <Grid3X3 className="mr-2 h-4 w-4" />
                                                Grid
                                            </>
                                        )}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Shelf'
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1 sm:w-80">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search books by title, author..."
                                            value={localFilters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            className="pr-10 pl-10"
                                        />
                                        {localFilters.search && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearSearch}
                                                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 rounded-full p-0 hover:bg-muted"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                    <Select value={localFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                                        <SelectTrigger className="w-48">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.slug}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-3 text-sm">
                                <div className="flex items-center gap-2">
                                    {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {data.book_ids.length} books selected
                                        {allBooks.length > 0 && ` of ${allBooks.length} available`}
                                    </span>
                                </div>
                                {outdatedBooksCount > 0 && (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>{outdatedBooksCount} outdated books selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Books List */}
                        {allBooks.length > 0 ? (
                            <div className={selectedView === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                                {allBooks.map((book) =>
                                    selectedView === 'grid' ? (
                                        <GridBookCard key={book.id} book={book} />
                                    ) : (
                                        <CompactBookCard key={book.id} book={book} />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-8 text-center">
                                <BookOpen className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No books found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {localFilters.search
                                        ? `No books found matching "${localFilters.search}"`
                                        : 'No books available with the selected filters'}
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
