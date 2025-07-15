import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select as ShadSelect } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Course, Program, User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputError from './input-error';
import SearchableMultiSelect from './searchable-multiselect';

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
        status: course.status || 'active',
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
            preserveState: false,
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
                        <Label htmlFor="status">Status</Label>
                        <ShadSelect onValueChange={(value) => setData('status', value)} defaultValue={data.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </ShadSelect>
                        <InputError message={errors.status} />
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
