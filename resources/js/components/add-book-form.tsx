import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Category } from '@/types';

import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export function AddBookForm({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, progress, reset } = useForm({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        published_year: '',
        pages: '',
        language: '',
        category_id: '',
        description: '',
        cover_image: null as File | null,
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new book</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <p className="mt-1 text-xs text-red-700">{errors.title}</p>}
                    </div>
                    <div>
                        <Label htmlFor="author">Author</Label>
                        <Input id="title" value={data.author} onChange={(e) => setData('author', e.target.value)} />
                        {errors.author && <p className="mt-1 text-xs text-red-700">{errors.author}</p>}
                    </div>
                    <div>
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
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        {errors.description && <p className="mt-1 text-xs text-red-700">{errors.description}</p>}
                    </div>
                    <div>
                        <Label htmlFor="publisher">Publisher</Label>
                        <Input id="publisher" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} />
                        {errors.title && <p className="mt-1 text-xs text-red-700">{errors.title}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} />
                        {errors.isbn && <p className="mt-1 text-xs text-red-700">{errors.isbn}</p>}
                    </div>
                    <div>
                        <Label htmlFor="published_year">published Year</Label>
                        <Input id="published_year" value={data.published_year} onChange={(e) => setData('published_year', e.target.value)} />
                        {errors.published_year && <p className="mt-1 text-xs text-red-700">{errors.published_year}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pages">Pages</Label>
                        <Input id="pages" value={data.pages} onChange={(e) => setData('pages', e.target.value)} />
                        {errors.pages && <p className="mt-1 text-xs text-red-700">{errors.pages}</p>}
                    </div>
                    <div>
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" value={data.language} onChange={(e) => setData('language', e.target.value)} />
                        {errors.language && <p className="mt-1 text-xs text-red-700">{errors.language}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cover_image">Cover Image</Label>
                        <Input
                            id="cover_image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                        />
                        {errors.cover_image && <p className="mt-1 text-xs text-red-700">{errors.cover_image}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ebook">Ebook File (PDF, EPUB)</Label>
                        <Input
                            id="ebook"
                            type="file"
                            accept=".pdf,.epub"
                            onChange={(e) => setData('ebook', e.target.files ? e.target.files[0] : null)}
                        />
                        {errors.ebook && <p className="mt-1 text-xs text-red-700">{errors.ebook}</p>}
                    </div>
                </form>
                {progress && <Progress value={progress.percentage} className="w-full" />}

                <Button type="submit" disabled={processing} onClick={handleSubmit} className="w-full">
                    {processing ? 'Uploading...' : 'Save Book'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
