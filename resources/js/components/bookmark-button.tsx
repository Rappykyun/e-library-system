import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
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

    const handleBookmarkToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);

        try {
            if (isBookmarked) {
                // Remove bookmark
                await fetch(route('student.bookmarks.destroy'), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ book_id: bookId }),
                });

                setIsBookmarked(false);
                toast.success('Removed from bookmarks');
            } else {
                // Add bookmark
                await fetch(route('student.bookmarks.store'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ book_id: bookId }),
                });

                setIsBookmarked(true);
                toast.success('Added to bookmarks');
            }
        } catch (error) {
            console.error('Bookmark error:', error);
            toast.error('Failed to update bookmark');
        } finally {
            setIsLoading(false);
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'card':
                return 'absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 p-0 shadow-sm hover:scale-110 hover:bg-white';
            case 'ghost':
                return 'border border-white/20 backdrop-blur-sm hover:bg-white/60';
            default:
                return '';
        }
    };

    const heartIcon = isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : (
        <Heart
            className={cn(
                'h-3.5 w-3.5 transition-all duration-200',
                isBookmarked ? 'scale-110 fill-pink-500 text-pink-500' : 'text-pink-500 hover:fill-pink-100',
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
