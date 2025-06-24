import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Book, type Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export function EditBookForm({ book, categories = [] }: { book: Book; categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, progress } = useForm({
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        isbn: book.isbn || '',
        published_year: book.published_year?.toString() || '',
        pages: book.pages?.toString() || '',
        language: book.language || '',
        category_id: book.category?.id?.toString() || '',
        description: book.description || '',
        ebook: null as File | null,
        _method: 'PUT',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.books.update', book.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>Update the book details below</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 space-y-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="mt-1 text-xs text-red-700">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" value={data.author} onChange={(e) => setData('author', e.target.value)} />
                            {errors.author && <p className="mt-1 text-xs text-red-700">{errors.author}</p>}
                        </div>
                        <div className="space-y-2">
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
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="mt-1 text-xs text-red-700">{errors.description}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="publisher">Publisher</Label>
                            <Input id="publisher" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} />
                            {errors.publisher && <p className="mt-1 text-xs text-red-700">{errors.publisher}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input id="isbn" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} />
                            {errors.isbn && <p className="mt-1 text-xs text-red-700">{errors.isbn}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="published_year">Published Year</Label>
                            <Input id="published_year" value={data.published_year} onChange={(e) => setData('published_year', e.target.value)} />
                            {errors.published_year && <p className="mt-1 text-xs text-red-700">{errors.published_year}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pages">Pages</Label>
                            <Input id="pages" value={data.pages} onChange={(e) => setData('pages', e.target.value)} />
                            {errors.pages && <p className="mt-1 text-xs text-red-700">{errors.pages}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input id="language" value={data.language} onChange={(e) => setData('language', e.target.value)} />
                            {errors.language && <p className="mt-1 text-xs text-red-700">{errors.language}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ebook">Replace Ebook File (Optional)</Label>
                            <Input
                                id="ebook"
                                type="file"
                                accept=".pdf,.epub"
                                onChange={(e) => setData('ebook', e.target.files ? e.target.files[0] : null)}
                            />
                            <p className="text-xs text-muted-foreground">Leave empty to keep current file</p>
                            {errors.ebook && <p className="mt-1 text-xs text-red-700">{errors.ebook}</p>}
                        </div>
                    </div>
                </form>
                {progress && <Progress value={progress.percentage} className="w-full" />}
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} onClick={handleSubmit} size={'lg'}>
                        {processing ? 'Updating...' : 'Update Book'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
