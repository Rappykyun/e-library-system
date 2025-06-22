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
            },
        );
    };

    const currentRole = user.roles.find((r: any) => r.name === 'super_admin')?.name ?? user.roles[0]?.name;

    return (
        <form>
            <Select onValueChange={handleRoleChange} defaultValue={currentRole} disabled={processing || isEditingSelf}>
                <SelectTrigger className="w-[180px]">
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
                            <SelectItem key={role.id} value={role.name} disabled={isLastAdmin && role.name !== 'admin'}>
                                {role.name}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </form>
    );
}
