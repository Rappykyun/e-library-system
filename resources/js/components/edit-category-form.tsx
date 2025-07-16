import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function EditCategoryForm({ category }: { category: Category }) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        name: category.name,
        description: category.description,
    });

    useEffect(() => {
        setData({
            name: category.name,
            description: category.description,
        });
    }, [category, setData]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        patch(route('admin.categories.update', category.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:w-full">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold">Edit Category</DialogTitle>
                    <DialogDescription>
                        Update the details for the <strong>{category.name}</strong> category
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-1 font-medium">
                            Category Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter category name"
                            className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-medium">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description of the category"
                            className="min-h-[80px]"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-700">{errors.description}</p>}
                    </div>
                </form>

                <DialogFooter className="gap-2 border-t pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} onClick={handleSubmit} className="px-6">
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
