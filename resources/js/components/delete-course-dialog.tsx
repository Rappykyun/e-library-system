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
import { Course } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function DeleteCourseDialog({ course }: { course: Course }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleDelete() {
        setIsSubmitting(true);
        router.delete(route('admin.courses.destroy', course.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="ml-2">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the course "{course.name}" ({course.code}).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
