import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type Book } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteBookDialog({ book }: { book: Book }) {
    const { delete: destroy, processing } = useForm();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('admin.books.destroy', book.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the book "{book.title}" by {book.author} and remove all associated
                        files from cloud storage.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing ? 'Deleting...' : 'Delete Book'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
