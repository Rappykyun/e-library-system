import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    const hasRole = (role: string) => {
        return auth.roles.includes(role);
    };

    const hasPermission = (permission: string) => {
        return auth.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions: string[]) => {
        return permissions.some((permission) => auth.permissions.includes(permission));
    };

    const hasAllPermissions = (permissions: string[]) => {
        return permissions.every((permission) => auth.permissions.includes(permission));
    };

    return {
        hasRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
}
