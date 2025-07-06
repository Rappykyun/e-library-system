import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { type Role, type User } from '@/types';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import InputError from './input-error';

interface EditUserFormProps {
    user: User;
    roles: Role[];
}

export function EditUserForm({ user, roles }: EditUserFormProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        role: user.roles[0]?.name || '',
    });

    // Filter out the 'admin' role, as it should not be assignable from the UI
    const selectableRoles = roles.filter((role) => role.name !== 'admin');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id), {
            onSuccess: () => {
                toast.success(`User ${user.name}'s role has been updated to ${data.role}.`);
                setOpen(false);
            },
            onError: (errors) => {
                const errorMessage = errors.role || 'An unexpected error occurred.';
                toast.error(errorMessage);
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                // Reset form state when dialog is closed
                if (!isOpen) {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Role for {user.name}</DialogTitle>
                    <DialogDescription>Select a new role for this user. The change will be applied immediately.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select onValueChange={(value) => setData('role', value)} defaultValue={data.role}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectableRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {/* Capitalize first letter for display */}
                                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
