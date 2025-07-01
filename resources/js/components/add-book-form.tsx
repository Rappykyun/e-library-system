import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';
import { type Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export function AddBookForm({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        published_year: '',
        pages: '',
        language: '',
        category_id: '',
        description: '',
        ebook: null as File | null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.books.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Book</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new book</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto grid max-h-[60vh] w-full max-w-6xl grid-cols-1 gap-4 overflow-y-auto pr-4 lg:grid-cols-2 lg:gap-6"
                >
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="mt-1 text-xs text-red-700">{errors.title}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" value={data.author} onChange={(e) => setData('author', e.target.value)} />
                            {errors.author && <p className="mt-1 text-xs text-red-700">{errors.author}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="category_id">Category</Label>
                            <Select onValueChange={(value) => setData('category_id', value)} value={data.category_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="mt-1 text-xs text-red-700">{errors.category_id}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="mt-1 text-xs text-red-700">{errors.description}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="publisher">Publisher</Label>
                            <Input id="publisher" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} />
                            {errors.title && <p className="mt-1 text-xs text-red-700">{errors.publisher}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input id="isbn" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} />
                            {errors.isbn && <p className="mt-1 text-xs text-red-700">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="published_year">Published Year</Label>
                            <Input id="published_year" value={data.published_year} onChange={(e) => setData('published_year', e.target.value)} />
                            {errors.published_year && <p className="mt-1 text-xs text-red-700">{errors.published_year}</p>}
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="language">Language</Label>
                            <Input id="language" value={data.language} onChange={(e) => setData('language', e.target.value)} />
                            {errors.language && <p className="mt-1 text-xs text-red-700">{errors.language}</p>}
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="ebook">Ebook File (PDF only)</Label>
                            <Input
                                id="ebook"
                                type="file"
                                accept=".pdf,.epub"
                                onChange={(e) => setData('ebook', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.ebook && <p className="mt-1 text-xs text-red-700">{errors.ebook}</p>}
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" disabled={processing} onClick={handleSubmit} size={'lg'}>
                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Book'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
