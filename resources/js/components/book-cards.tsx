import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { type Book, type Category } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Download } from 'lucide-react';
import { BookmarkButton } from './bookmark-button';
// import { DeleteBookDialog } from './delete-book-dialog';
// import { EditBookForm } from './edit-book-form';

export function BookCard({ book, showAdminActions }: { book: Book; categories: Category[]; showAdminActions?: boolean }) {
    // Check if book is bookmarked by checking if user bookmark data exists
    const isBookmarked = !!(book.bookmarks && book.bookmarks.length > 0);

    const CoverImage = () => (
        <div className="relative aspect-[3/4] w-full max-w-[120px] overflow-visible rounded-md bg-muted shadow-sm">
            {book.cover_image_url ? (
                <>
                    <img src={book.cover_image_url} alt={book.title} className="h-full w-full rounded-md object-cover" />
                    {!showAdminActions && <BookmarkButton bookId={book.id} isBookmarked={isBookmarked} variant="card" />}
                </>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-secondary p-2 text-center text-secondary-foreground">
                    <BookOpen className="mb-1 h-6 w-6" />
                    <p className="line-clamp-2 text-xs font-medium">{book.title}</p>
                    {!showAdminActions && <BookmarkButton bookId={book.id} isBookmarked={isBookmarked} variant="card" />}
                </div>
            )}
        </div>
    );

    return (
        <Card className="group relative flex transform overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex w-full gap-3 p-3">
                {/* Book Cover - Smaller and on the left */}
                <Link href={route(showAdminActions ? 'admin.books.show' : 'student.books.show', book.id)} className="flex-shrink-0">
                    <CoverImage />
                </Link>

                {/* Book Info - Takes remaining space */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            {book.category && (
                                <Badge variant="secondary" className="text-xs">
                                    {book.category.name}
                                </Badge>
                            )}
                        </div>

                        <Link href={route(showAdminActions ? 'admin.books.show' : 'student.books.show', book.id)}>
                            <h3 className="line-clamp-2 text-sm leading-tight font-semibold tracking-tight transition-colors hover:text-primary">
                                {book.title}
                            </h3>
                        </Link>

                        <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>
                        <div className="flex cursor-pointer items-center text-xs text-muted-foreground">
                            <Download className="mr-1 h-3 w-3" />
                            <span>{book.download_count || 0}</span>
                        </div>
                    </div>

                    {/* {showAdminActions && (
                        <div className="mt-2 flex items-center justify-end space-x-1">
                            <EditBookForm book={book} categories={categories} courses={[]} />
                            <DeleteBookDialog book={book} />
                        </div>
                    )} */}
                </div>
            </div>
        </Card>
    );
}
