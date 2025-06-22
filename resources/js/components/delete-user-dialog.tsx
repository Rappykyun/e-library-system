import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { type User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';

export function DeleteUserDialog({ user }: { user: User }) {
    const { user: authUser } = useUser();
    const { delete: destroy, processing } = useForm();

    const isDeletingSelf = authUser?.id === user.id;

    function handleDelete(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isDeletingSelf) return;
        destroy(route('admin.users.destroy', user.id));
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={isDeletingSelf}>
                    <Trash className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the account for <strong>{user.name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleDelete}>
                        <AlertDialogAction type="submit" disabled={processing}>
                            {processing ? 'Deleting...' : 'Continue'}
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
