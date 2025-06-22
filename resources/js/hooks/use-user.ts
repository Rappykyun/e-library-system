import { type User } from '@/types';
import { usePage } from '@inertiajs/react';

export function useUser() {
    const { props } = usePage();
    const user = props.auth.user as User;
    return { user };
}
