import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { useState } from 'react';

export function AddCategoryForm() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:w-full">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold">Add New Category</DialogTitle>
                    <DialogDescription>Add a new category to organize books in the library</DialogDescription>
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
                    <Button type="button" variant="outline" onClick={() => reset()} disabled={processing}>
                        Reset
                    </Button>
                    <Button type="submit" disabled={processing} onClick={handleSubmit} className="px-6">
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Category'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
