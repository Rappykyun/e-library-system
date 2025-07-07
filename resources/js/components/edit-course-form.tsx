import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as ShadSelect } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Course, Program, User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from './input-error';

interface EditCourseFormProps {
    course: Course;
    programs: Program[];
    faculty: User[];
    students: User[];
}

interface SearchableMultiSelectProps {
    options: { value: string; label: string }[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
}

function SearchableMultiSelect({
    options,
    value,
    onValueChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search...',
}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false);

    const selectedOptions = options.filter((option) => value.includes(option.value));

    const handleSelect = (optionValue: string) => {
        const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
        onValueChange(newValue);
    };

    const handleRemove = (optionValue: string) => {
        onValueChange(value.filter((v) => v !== optionValue));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto min-h-10 w-full justify-between">
                    <div className="flex flex-1 flex-wrap gap-1">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedOptions.map((option) => (
                                <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                                    {option.label}
                                    <button
                                        type="button"
                                        className="ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        aria-label={`Remove ${option.label}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRemove(option.value);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleRemove(option.value)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command
                    filter={(itemValue, search) => {
                        const currentOption = options.find((option) => option.value === itemValue);
                        if (currentOption?.label.toLowerCase().includes(search.toLowerCase())) {
                            return 1;
                        }
                        return 0;
                    }}
                >
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                                    <Check className={cn('mr-2 h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function EditCourseForm({ course, programs, faculty, students }: EditCourseFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        name: course.name,
        code: course.code,
        program_id: course.program_id.toString(),
        description: course.description || '',
        faculty_ids: course.faculty?.map((f: User) => f.id.toString()) || [],
        student_ids: course.students?.map((s: User) => s.id.toString()) || [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.patch(route('admin.courses.update', { course: course.id }), data, {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
            preserveState: true,
        });
    };

    const facultyOptions = faculty.map((f) => ({
        value: f.id.toString(),
        label: f.name,
    }));

    const studentOptions = students.map((s) => ({
        value: s.id.toString(),
        label: s.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="program_id">Program</Label>
                        <ShadSelect onValueChange={(value) => setData('program_id', value)} defaultValue={data.program_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem key={program.id} value={program.id.toString()}>
                                        {program.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </ShadSelect>
                        <InputError message={errors.program_id} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Course Code</Label>
                        <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} required />
                        <InputError message={errors.code} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                        <InputError message={errors.description} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="faculty_ids">Assigned Faculty</Label>
                        <SearchableMultiSelect
                            options={facultyOptions}
                            value={data.faculty_ids}
                            onValueChange={(selectedValues) => setData('faculty_ids', selectedValues)}
                            placeholder="Select faculty..."
                            searchPlaceholder="Search faculty..."
                        />
                        <InputError message={errors.faculty_ids} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student_ids">Enrolled Students</Label>
                        <SearchableMultiSelect
                            options={studentOptions}
                            value={data.student_ids}
                            onValueChange={(selectedValues) => setData('student_ids', selectedValues)}
                            placeholder="Select students..."
                            searchPlaceholder="Search students..."
                        />
                        <InputError message={errors.student_ids} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
