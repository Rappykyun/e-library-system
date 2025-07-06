import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

export function AddUserForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                toast.success(`User ${data.name} created successfully with role: ${data.role}.`);
                reset();
                onClose();
            },
            onError: (errors) => {
                const errorCount = Object.keys(errors).length;
                toast.error(`Please fix the ${errorCount} validation errors below.`);
            },
        });
    };

    const generatePassword = () => {
        const newPassword = Math.random().toString(36).slice(-10); // 10-char random string
        setData({
            ...data,
            password: newPassword,
            password_confirmation: newPassword,
        });
        toast.info('Generated a new password. Make sure to save it!');
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                <InputError message={errors.email} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setData('role', value)} defaultValue={data.role}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.role} className="mt-2" />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                    </Button>
                </div>
                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                <InputError message={errors.password} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}
