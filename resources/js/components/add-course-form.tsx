import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Program } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from './input-error';

interface AddCourseFormProps {
    programs: Program[];
    onSuccess: () => void;
}

export function AddCourseForm({ programs, onSuccess }: AddCourseFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        program_id: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="program_id">Program</Label>
                <Select onValueChange={(value) => setData('program_id', value)} defaultValue={data.program_id}>
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
                </Select>
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
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onSuccess()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create Course'}
                </Button>
            </div>
        </form>
    );
}
