import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type Book, type Category } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Download } from 'lucide-react';
import { useState } from 'react';
import { DeleteBookDialog } from './delete-book-dialog';
import { EditBookForm } from './edit-book-form';



    export function BookCard({ book, categories ,showAdminActions}: { book: Book; categories: Category[] ,showAdminActions? : boolean}) {
    const [isImageBroken, setIsImageBroken] = useState(false);

    const handleImageError = () => {
        setIsImageBroken(true);
    };

    const CoverImage = () => (
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
            {isImageBroken || !book.cover_image_url ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-secondary p-4 text-center text-secondary-foreground">
                    <BookOpen className="mb-2 h-8 w-8" />
                    <p className="line-clamp-3 font-semibold">{book.title}</p>
                </div>
            ) : (
                <img
                    src={book.cover_image_url}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                />
            )}
        </div>
    );

    return (
        <Card className="group relative flex h-full transform flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link href={route('admin.books.show', book.id)} className="block flex-shrink-0 p-4 pb-0">
                <CoverImage />
            </Link>

            <CardContent className="flex flex-grow flex-col p-4">
                <div className="mb-2 flex items-center justify-between">
                    {book.category && <Badge variant="outline">{book.category.name}</Badge>}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="mr-1 h-4 w-4" />
                        <span>{book.download_count}</span>
                    </div>
                </div>
                <h3 className="line-clamp-2 flex-grow leading-tight font-semibold tracking-tight">{book.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
            </CardContent>
            {showAdminActions && ( 
                <div className="mt-auto border-t p-2">
                    <div className="flex items-center justify-end space-x-2">
                        <EditBookForm book={book} categories={categories} />
                        <DeleteBookDialog book={book} />
                    </div>
                </div>
            )}
        </Card>
    );
}
