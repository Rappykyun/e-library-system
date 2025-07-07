import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as ShadSelect } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Course, Program, SelectOption, User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import Select from 'react-select';
import InputError from './input-error';

interface EditCourseFormProps {
    course: Course;
    programs: Program[];
    faculty: User[];
    students: User[];
}

export function EditCourseForm({ course, programs, faculty, students }: EditCourseFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        name: course.name,
        code: course.code,
        program_id: course.program_id.toString(),
        description: course.description || '',
        faculty: course.faculty?.map((f: User) => ({ value: f.id.toString(), label: f.name })) || [],
        students: course.students?.map((s: User) => ({ value: s.id.toString(), label: s.name })) || [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use Inertia's router for requests that need data transformation.
        router.patch(
            route('admin.courses.update', { course: course.id }),
            {
                // Spread the form data
                ...data,
                // And add the transformed faculty_ids and student_ids
                faculty_ids: data.faculty.map((f: SelectOption) => f.value),
                student_ids: data.students.map((s: SelectOption) => s.value),
            },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                preserveState: true,
            },
        );
    };

    const facultyOptions: SelectOption[] = faculty.map((f) => ({
        value: f.id.toString(),
        label: f.name,
    }));

    const studentOptions: SelectOption[] = students.map((s) => ({
        value: s.id.toString(),
        label: s.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
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
                        <Select
                            isMulti
                            options={facultyOptions}
                            value={data.faculty}
                            onChange={(selected) => setData('faculty', selected as SelectOption[])}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select faculty..."
                        />
                        <InputError message={errors.faculty} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student_ids">Enrolled Students</Label>
                        <Select
                            isMulti
                            options={studentOptions}
                            value={data.students}
                            onChange={(selected) => setData('students', selected as SelectOption[])}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select students..."
                        />
                        <InputError message={errors.students} />
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
