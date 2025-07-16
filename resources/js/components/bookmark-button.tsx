import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BookmarkButtonProps {
    bookId: number;
    isBookmarked: boolean;
    variant?: 'default' | 'card' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
    className?: string;
}

export function BookmarkButton({ bookId, isBookmarked: initialBookmarked, variant = 'default', size = 'sm', className }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    const handleBookmarkToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);

        if (isBookmarked) {
            // Remove bookmark
            router.delete(route('student.bookmarks.destroy'), {
                data: { book_id: bookId },
                preserveScroll: true,
                onSuccess: (page) => {
                    setIsBookmarked(false);
                    const message = page.props.flash?.success || 'Removed from bookmarks';
                    toast.success(message);
                },
                onError: (errors) => {
                    console.error('Bookmark error:', errors);
                    toast.error('Failed to remove bookmark');
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        } else {
            // Add bookmark
            router.post(
                route('student.bookmarks.store'),
                {
                    book_id: bookId,
                },
                {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        // Check if it was already bookmarked
                        const message = page.props.flash?.message;
                        if (message && message.includes('already bookmarked')) {
                            setIsBookmarked(true);
                            toast.info(message);
                        } else {
                            setIsBookmarked(true);
                            const successMessage = page.props.flash?.success || 'Added to bookmarks';
                            toast.success(successMessage);
                        }
                    },
                    onError: (errors) => {
                        console.error('Bookmark error:', errors);
                        toast.error('Failed to add bookmark');
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                },
            );
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'card':
                return 'absolute top-1 right-1 h-7 w-7 rounded-full bg-white/95 p-0 shadow-md hover:scale-110 hover:bg-white border border-gray-200/50 z-10';
            case 'ghost':
                return 'border border-white/20 backdrop-blur-sm hover:bg-white/60';
            default:
                return '';
        }
    };

    const heartIcon = isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
    ) : (
        <Heart
            className={cn(
                'h-4 w-4 transition-all duration-200',
                isBookmarked ? 'fill-red-500 text-red-500 drop-shadow-sm' : 'text-gray-600 hover:fill-red-100 hover:text-red-500',
            )}
        />
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size={size}
                    variant="ghost"
                    onClick={handleBookmarkToggle}
                    disabled={isLoading}
                    className={cn(getVariantStyles(), 'transition-all duration-200', isLoading && 'cursor-not-allowed opacity-50', className)}
                >
                    {heartIcon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</p>
            </TooltipContent>
        </Tooltip>
    );
}
