import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type Book } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export function BookCard({ book}: { book: Book}) {
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleImageError = () => {
        console.error('Failed to load cover image:', book.cover_image_url);

        //  try alternative formats
        if (book.cover_image_url?.includes('cloudinary.com') && retryCount < 3) {
            const cloudName = 'djsiztcin'; // Your cloud name
            const publicId = book.cover_image_public_id;

            const alternativeFormats = [
                `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_600,c_fill,f_jpg,pg_1/${publicId}.pdf`,
                `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_400,h_600,f_jpg,pg_1/${publicId}`,
                `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_600,c_fill,f_jpg,page_1/${publicId}`,
            ];

            if (retryCount < alternativeFormats.length) {
              
                setRetryCount(retryCount + 1);
                return;
            }
        }

        setImageError(true);
    };

    const getImageSrc = () => {
        if (imageError) {
            return `https://via.placeholder.com/400x600/4A90E2/FFFFFF?text=${encodeURIComponent(book.title)}`;
        }

        // If we're retrying with alternative formats
        if (book.cover_image_url?.includes('cloudinary.com') && retryCount > 0) {
            const cloudName = 'djsiztcin';
            const publicId = book.cover_image_public_id;

            const alternativeFormats = [
                `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_600,c_fill,f_jpg,pg_1/${publicId}.pdf`,
                `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_400,h_600,f_jpg,pg_1/${publicId}`,
                `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_600,c_fill,f_jpg,page_1/${publicId}`,
            ];

            return alternativeFormats[retryCount - 1] || book.cover_image_url;
        }

        return book.cover_image_url ?? 'https://via.placeholder.com/300x440.png?text=No+Cover';
    };

    return (
        <Card className="flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-lg">
            <CardHeader className="relative p-0">
                <Link href={route('admin.books.show', book.id)}>
                    <img src={getImageSrc()} alt={`Cover of ${book.title}`} className="h-64 w-full object-cover" onError={handleImageError} />
                </Link>
                {book.category && (
                    <Badge className="absolute top-2 right-2" variant={'secondary'}>
                        {book.category.name}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <CardTitle className="mb-1 line-clamp-2 text-lg leading-tight font-bold">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <CardDescription className="mt-2 line-clamp-3 text-sm">{book.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={route('admin.books.show', book.id)} className="w-full">
                    <Button variant="outline" className="w-full">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
