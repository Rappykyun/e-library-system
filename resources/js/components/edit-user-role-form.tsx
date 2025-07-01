import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/hooks/use-user';
import { type Role, type User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function EditUserRoleForm({ user, roles, userCount }: { user: User; roles: Role[]; userCount: number }) {
    const { user: authUser } = useUser();
    const [processing, setProcessing] = useState(false);

    const { props } = usePage();
    const authRoles = (props.auth?.roles ?? []) as string[];
    const isSuperAdmin = authRoles.includes('super_admin');

    const isLastAdmin = user.roles[0]?.name === 'admin' && userCount === 1;
    const isEditingSelf = authUser?.id === user.id;

    const handleRoleChange = (newRole: string) => {
        if (isLastAdmin && newRole !== 'admin') {
            toast.error('Cannot remove the last admin role.');
            return;
        }

        setProcessing(true);
        router.patch(
            route('admin.users.update', user.id),
            { role: newRole },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    toast.success('User role updated successfully');
                },
                onError: () => {
                    toast.error('Failed to update user role');
                },
            },
        );
    };

    const currentRole = user.roles.find((r: any) => r.name === 'super_admin')?.name ?? user.roles[0]?.name;

    return (
        <div className="w-full max-w-[200px]">
            <Select onValueChange={handleRoleChange} defaultValue={currentRole} disabled={processing || isEditingSelf}>
                <SelectTrigger className={`w-full ${processing ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    {roles
                        .filter((role) => {
                            // Hide super_admin from non-super admins
                            if (role.name === 'super_admin' && !isSuperAdmin) return false;
                            return true;
                        })
                        .map((role) => (
                            <SelectItem key={role.id} value={role.name} disabled={isLastAdmin && role.name !== 'admin'} className="capitalize">
                                {role.name.replace('_', ' ')}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
            {isEditingSelf && <p className="mt-1 text-xs text-muted-foreground">You cannot change your own role</p>}
            {isLastAdmin && <p className="mt-1 text-xs text-amber-600">Last admin - role cannot be changed</p>}
        </div>
    );
}
