import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Category, type Course } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle, FileText, Loader2, Upload, X } from 'lucide-react';
import { DragEvent, FormEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AddBookFormProps {
    categories: Category[];
    courses: Course[];
    onBookAdded?: () => void;
}

export function AddBookForm({ categories, courses, onBookAdded }: AddBookFormProps) {
    const [open, setOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        
        author: '',
        publisher: '',
        isbn: '',
        published_year: '',
        pages: '',
        language: 'en',
        category_id: '',
        course_id: '',
        description: '',
        ebook: null as File | null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.ebook) {
            toast.error('Please select a file to upload');
            return;
        }

        // Clear previous errors and set initial progress
        clearErrors();
        setUploadProgress(0);
        setUploadStatus('uploading');

        // Use Inertia's post method with progress tracking
        post(route('admin.books.store'), {
            forceFormData: true, // Force multipart/form-data for file uploads
            onProgress: (progress) => {
                // Convert progress to percentage and reserve 10% for processing
                const percent = Math.round((progress?.percentage ?? 0) * 0.9);
                setUploadProgress(percent);
            },
            onSuccess: () => {
                setUploadProgress(95);
                setUploadStatus('processing');

                // Small delay to show processing state
                setTimeout(() => {
                    setUploadProgress(100);
                    setUploadStatus('success');

                    // Show success toast
                    toast.success('Book uploaded successfully!');

                    // Call the callback if provided
                    if (onBookAdded) {
                        onBookAdded();
                    }

                    // Reset form and close dialog after showing success
                    setTimeout(() => {
                        reset();
                        setOpen(false);
                        setUploadProgress(0);
                        setUploadStatus('idle');
                    }, 1500);
                }, 500);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);

                // Immediately stop upload state and show errors
                setUploadStatus('error');
                setUploadProgress(0);

                // Show toast notification for validation errors
                const errorCount = Object.keys(errors).length;
                if (errorCount === 1) {
                    toast.error('Please fix the validation error below and try again.');
                } else {
                    toast.error(`Please fix the ${errorCount} validation errors below and try again.`);
                }
            },
            onFinish: () => {
                // Always ensure loading state is reset on finish
                // (this runs after onSuccess or onError)
            },
        });
    };

    const handleFileSelect = (file: File) => {
        if (file && (file.type === 'application/pdf' || file.type === 'application/epub+zip')) {
            if (file.size <= 30 * 1024 * 1024) {
                // 30MB limit
                setData('ebook', file);
                clearErrors('ebook');
            } else {
                toast.error('File size must be less than 30MB');
            }
        } else {
            toast.error('Only PDF and EPUB files are allowed');
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const removeFile = () => {
        setData('ebook', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Clear upload error status when user makes changes
    const clearUploadError = () => {
        if (uploadStatus === 'error') {
            setUploadStatus('idle');
            setUploadProgress(0);
        }
    };

    const isUploading = processing || uploadStatus === 'uploading' || uploadStatus === 'processing';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Book
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new book to the library</DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => {
                                            setData('title', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.title ? 'border-red-500' : ''}
                                        placeholder="Enter book title"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Author */}
                                <div className="space-y-2">
                                    <Label htmlFor="author">
                                        Author <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="author"
                                        value={data.author}
                                        onChange={(e) => {
                                            setData('author', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.author ? 'border-red-500' : ''}
                                        placeholder="Enter author name"
                                        required
                                    />
                                    {errors.author && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.author}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData('category_id', value);
                                            clearUploadError();
                                        }}
                                        value={data.category_id}
                                    >
                                        <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Course */}
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course (Optional)</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            // Handle the "None" case
                                            setData('course_id', value === 'none' ? '' : value);
                                            clearUploadError();
                                        }}
                                        value={data.course_id || 'none'}
                                    >
                                        <SelectTrigger className={errors.course_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Assign to a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id.toString()}>
                                                    {course.program.name} - {course.name} ({course.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.course_id && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.course_id}
                                        </p>
                                    )}
                                </div>

                                {/* Publisher */}
                                <div className="space-y-2">
                                    <Label htmlFor="publisher">Publisher</Label>
                                    <Input
                                        id="publisher"
                                        value={data.publisher}
                                        onChange={(e) => {
                                            setData('publisher', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.publisher ? 'border-red-500' : ''}
                                        placeholder="Enter publisher name"
                                    />
                                    {errors.publisher && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.publisher}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => {
                                            setData('description', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.description ? 'border-red-500' : ''}
                                        placeholder="Enter book description (optional)"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* ISBN */}
                                <div className="space-y-2">
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input
                                        id="isbn"
                                        value={data.isbn}
                                        onChange={(e) => {
                                            setData('isbn', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.isbn ? 'border-red-500' : ''}
                                        placeholder="Enter ISBN (10 or 13 digits)"
                                    />
                                    {errors.isbn && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.isbn}
                                        </p>
                                    )}
                                </div>

                                {/* Published Year */}
                                <div className="space-y-2">
                                    <Label htmlFor="published_year">Published Year</Label>
                                    <Input
                                        id="published_year"
                                        type="number"
                                        min="1000"
                                        max={new Date().getFullYear() + 1}
                                        value={data.published_year}
                                        onChange={(e) => {
                                            setData('published_year', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.published_year ? 'border-red-500' : ''}
                                        placeholder="Enter publication year"
                                    />
                                    {errors.published_year && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.published_year}
                                        </p>
                                    )}
                                </div>

                                {/* Pages */}
                                <div className="space-y-2">
                                    <Label htmlFor="pages">Number of Pages</Label>
                                    <Input
                                        id="pages"
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={data.pages}
                                        onChange={(e) => {
                                            setData('pages', e.target.value);
                                            clearUploadError();
                                        }}
                                        className={errors.pages ? 'border-red-500' : ''}
                                        placeholder="Enter number of pages"
                                    />
                                    {errors.pages && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.pages}
                                        </p>
                                    )}
                                </div>

                                {/* Language */}
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData('language', value);
                                            clearUploadError();
                                        }}
                                        value={data.language}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="fil">Filipino</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="zh">Chinese</SelectItem>
                                            <SelectItem value="ja">Japanese</SelectItem>
                                            <SelectItem value="ko">Korean</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.language && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.language}
                                        </p>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="ebook">
                                        Ebook File <span className="text-red-500">*</span>
                                    </Label>
                                    <div
                                        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                            isDragOver ? 'border-blue-500 bg-blue-50' : errors.ebook ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {data.ebook ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <FileText className="h-8 w-8 text-blue-500" />
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Badge variant="secondary">{data.ebook.name}</Badge>
                                                    <Badge variant="outline">{formatFileSize(data.ebook.size)}</Badge>
                                                    <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-center text-sm text-green-600">
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    File selected and ready to upload
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                <div className="text-sm text-gray-600">
                                                    <p>Drag and drop your ebook file here, or</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        Browse Files
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Supported: PDF, EPUB <span className="font-bold">(Max: 30MB)</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.epub"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                        aria-label="Upload ebook file"
                                    />
                                    {errors.ebook && (
                                        <p className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.ebook}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="border-t pt-4">
                    {isUploading && (
                        <div className="w-full space-y-4 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {uploadStatus === 'uploading' && 'Uploading...'}
                                    {uploadStatus === 'processing' && 'Processing...'}
                                    {uploadStatus === 'success' && 'Upload Complete!'}
                                </span>
                                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                            {uploadStatus === 'success' && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    Book uploaded successfully!
                                </div>
                            )}
                        </div>
                    )}
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUploading || !data.title || !data.author || !data.category_id || !data.ebook}
                        onClick={handleSubmit}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {uploadStatus === 'uploading' && 'Uploading...'}
                                {uploadStatus === 'processing' && 'Processing...'}
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Add Book
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
