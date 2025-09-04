import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Book, Category, Course, SharedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Download, Filter, Grid3X3, List, Loader2, Search, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface FacultyCourseShowProps extends SharedData {
    course: Course;
    allBooks: Book[];
    categories: Category[];
    filters: { search: string; category: string };
}

export default function FacultyCourseShow({ course, allBooks, categories, filters }: FacultyCourseShowProps) {
    const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        category: filters.category || 'all',
    });
    const [isSearching, setIsSearching] = useState(false);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [sortBy, setSortBy] = useState<'relevance' | 'title_asc' | 'title_desc' | 'author_asc' | 'year_desc' | 'downloads_desc'>('relevance');

    const { data, setData, put, processing } = useForm({
        book_ids: course.shelf_books?.map((b) => b.id) || [],
    });

    // Debounce search
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
  
        const hasQueryChanged = debouncedFilters.search !== (filters.search || '') || debouncedFilters.category !== (filters.category || 'all');

        if (!hasQueryChanged) {
            return;
        }

        setIsSearching(true);
        router.get(
            route('faculty.courses.show', course.id),
            {
                ...debouncedFilters,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            },
        );
    }, [debouncedFilters, course.id, filters.search, filters.category]);

    const handleCheckboxChange = (bookId: number, checked: boolean) => {
        const currentIds = data.book_ids;
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

    const initialSelectedIds = course.shelf_books?.map((b) => b.id) || [];
    const hasChanges =
        initialSelectedIds.length !== data.book_ids.length ||
        initialSelectedIds.some((id) => !data.book_ids.includes(id)) ||
        data.book_ids.some((id) => !initialSelectedIds.includes(id));

    // Visible books after client-side toggles/sorting
    const visibleBooks = (() => {
        let list = allBooks;
        if (showSelectedOnly) {
            const selectedSet = new Set<number>(data.book_ids);
            list = list.filter((b) => selectedSet.has(b.id));
        }
        switch (sortBy) {
            case 'title_asc':
                return [...list].sort((a, b) => a.title.localeCompare(b.title));
            case 'title_desc':
                return [...list].sort((a, b) => b.title.localeCompare(a.title));
            case 'author_asc':
                return [...list].sort((a, b) => (a.author || '').localeCompare(b.author || ''));
            case 'year_desc':
                return [...list].sort((a, b) => parseInt(b.published_year || '0') - parseInt(a.published_year || '0'));
            case 'downloads_desc':
                return [...list].sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
            case 'relevance':
            default:
                return list;
        }
    })();

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
                className={`group transition-all duration-200 ${
                    isSelected ? 'border-primary shadow-md' : 'hover:shadow-sm'
                } ${isOutdated ? 'border-l-4 border-l-destructive' : ''}`}
            >
                <div className="p-3">
                    <div className="flex gap-3">
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            {book.cover_image_url ? (
                                <img src={book.cover_image_url} alt={book.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h4 className="line-clamp-2 text-sm leading-tight font-medium">{book.title}</h4>
                                <div className="flex items-center gap-2">
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
                                    <Checkbox
                                        id={`book-${book.id}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => handleCheckboxChange(book.id, Boolean(checked))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate">{book.author}</span>
                                {book.category && (
                                    <>
                                        <span>•</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {book.category.name}
                                        </Badge>
                                    </>
                                )}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                {book.published_year && <span>Year: {book.published_year}</span>}
                                <span className="flex items-center">
                                    <Download className="mr-1 h-3 w-3" />
                                    {book.download_count || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <AppLayout>
            <Head title={`Manage Shelf for ${course.name}`} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        {/* Header */}
                        <div className="mb-6">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h1 className="text-2xl font-bold">Manage "{course.name}" Shelf</h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-xs">
                                            {course.code}
                                        </Badge>
                                        {course.program?.name && (
                                            <Badge variant="secondary" className="text-xs">
                                                {course.program.name}
                                            </Badge>
                                        )}
                                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">
                                            {course.status}
                                        </Badge>
                                        {typeof course.shelf_books_count === 'number' && <span>• {course.shelf_books_count} on shelf</span>}
                                        {typeof course.outdated_books_count === 'number' && course.outdated_books_count > 0 && (
                                            <span className="flex items-center gap-1 text-destructive">
                                                <AlertTriangle className="h-3 w-3" />
                                                {course.outdated_books_count} outdated
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">Select books to include on this course's shelf</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
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
                                    <Button type="submit" disabled={processing || !hasChanges}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : hasChanges ? (
                                            'Save Changes'
                                        ) : (
                                            'Saved'
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-1 items-center gap-2">
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
                                    {(localFilters.search || localFilters.category !== 'all') && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setLocalFilters({ search: '', category: 'all' })}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Switch id="selected-only" checked={showSelectedOnly} onCheckedChange={setShowSelectedOnly} />
                                        <label htmlFor="selected-only" className="text-sm text-muted-foreground">
                                            Selected only
                                        </label>
                                    </div>
                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="relevance">Sort: Relevance</SelectItem>
                                            <SelectItem value="title_asc">Sort: Title (A-Z)</SelectItem>
                                            <SelectItem value="title_desc">Sort: Title (Z-A)</SelectItem>
                                            <SelectItem value="author_asc">Sort: Author (A-Z)</SelectItem>
                                            <SelectItem value="year_desc">Sort: Newest Year</SelectItem>
                                            <SelectItem value="downloads_desc">Sort: Popularity</SelectItem>
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
                        {isSearching ? (
                            <div className={selectedView === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                                {Array.from({ length: selectedView === 'grid' ? 6 : 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={
                                            selectedView === 'grid'
                                                ? 'h-28 animate-pulse rounded-lg border bg-muted/30'
                                                : 'h-16 animate-pulse rounded-lg border bg-muted/30'
                                        }
                                    />
                                ))}
                            </div>
                        ) : visibleBooks.length > 0 ? (
                            <div className={selectedView === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                                {visibleBooks.map((book) =>
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
                                    {localFilters.search || localFilters.category !== 'all' || showSelectedOnly
                                        ? 'Try clearing filters or showing all books'
                                        : 'No books available'}
                                </p>
                            </div>
                        )}

                        {/* Sticky Actions Bar */}
                        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4">
                            <div className="pointer-events-auto mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-lg border bg-background/90 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="rounded-md bg-muted px-2 py-1">{data.book_ids.length} selected</span>
                                    {outdatedBooksCount > 0 && (
                                        <span className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            {outdatedBooksCount} outdated
                                        </span>
                                    )}
                                    {hasChanges && <span className="text-muted-foreground">Unsaved changes</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setData('book_ids', [])}
                                        disabled={data.book_ids.length === 0}
                                    >
                                        Clear selection
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const visibleIds = new Set<number>(visibleBooks.map((b) => b.id));
                                            const merged = Array.from(new Set<number>([...data.book_ids, ...visibleIds]));
                                            setData('book_ids', merged);
                                        }}
                                        disabled={visibleBooks.length === 0}
                                    >
                                        Select all visible
                                    </Button>
                                    <Separator orientation="vertical" className="mx-1 h-6" />
                                    <Button type="submit" disabled={processing || !hasChanges}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : hasChanges ? (
                                            'Save Changes'
                                        ) : (
                                            'Saved'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
