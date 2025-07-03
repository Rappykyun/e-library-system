import { DeleteUserDialog } from '@/components/delete-user-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type Paginated, type Role, type User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { usePermission } from '@/hooks/use-permission';
import { useUser } from '@/hooks/use-user';
import { useState } from 'react';
import { toast } from 'sonner';

interface UsersIndexProps {
    users: Paginated<User>;
    roles: Role[];
}

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const { hasRole } = usePermission();
    const { user: authUser } = useUser();
    const [processingUsers, setProcessingUsers] = useState<Set<number>>(new Set());
    
    const isAdmin = hasRole('admin');
    
    // Role statistics
    const roleStats = {
        admin: users.data.filter(u => u.roles[0]?.name === 'admin').length,
        librarian: users.data.filter(u => u.roles[0]?.name === 'librarian').length,
        student: users.data.filter(u => u.roles[0]?.name === 'student').length,
    };

    // Handle role change
    const handleRoleChange = (user: User, newRole: string) => {
        if (authUser?.id === user.id) {
            toast.error('You cannot change your own role.');
            return;
        }

        if (user.roles[0]?.name === 'admin') {
            toast.error('Administrator roles cannot be changed.');
            return;
        }

        setProcessingUsers(prev => new Set(prev).add(user.id));
        
        router.patch(
            route('admin.users.update', user.id),
            { role: newRole },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(user.id);
                        return newSet;
                    });
                },
                onSuccess: () => {
                    toast.success(`User role updated to ${newRole}`);
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors)[0] || 'Failed to update user role';
                    toast.error(errorMessage);
                },
            },
        );
    };

    // Role badge component
    const RoleBadge = ({ roleName }: { roleName: string }) => {
        switch(roleName) {
            case 'admin': 
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Administrator</Badge>;
            case 'librarian': 
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Librarian</Badge>;
            case 'student': 
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Student</Badge>;
            default: 
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    // Role selector component
    const RoleSelector = ({ user }: { user: User }) => {
        const currentRole = user.roles[0]?.name || 'student';
        const isEditingSelf = authUser?.id === user.id;
        const isUserAdmin = currentRole === 'admin';
        const isProcessing = processingUsers.has(user.id);

        // If user is admin or editing self, just show badge
        if (isUserAdmin || isEditingSelf || !isAdmin) {
            return (
                <div className="flex items-center gap-2">
                    <RoleBadge roleName={currentRole} />
                    {isEditingSelf && (
                        <span className="text-xs text-muted-foreground">(You)</span>
                    )}
                    {!isAdmin && (
                        <span className="text-xs text-muted-foreground">(View only)</span>
                    )}
                </div>
            );
        }

        // Show dropdown for student/librarian roles
        return (
            <div className="flex items-center gap-2">
                <RoleBadge roleName={currentRole} />
                <div className="w-[120px]">
                    <Select 
                        onValueChange={(newRole) => handleRoleChange(user, newRole)}
                        defaultValue={currentRole} 
                        disabled={isProcessing}
                    >
                        <SelectTrigger className={`h-7 text-xs ${isProcessing ? 'opacity-50' : ''}`}>
                            <SelectValue placeholder="Change role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student" className="text-xs">
                                Student
                            </SelectItem>
                            <SelectItem value="librarian" className="text-xs">
                                Librarian
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Manage Users" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Administrators</p>
                                        <p className="text-2xl font-bold text-red-600">{roleStats.admin}</p>
                                    </div>
                                    <Badge className="bg-red-100 text-red-800">Admin</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Librarians</p>
                                        <p className="text-2xl font-bold text-blue-600">{roleStats.librarian}</p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">Librarian</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Students</p>
                                        <p className="text-2xl font-bold text-green-600">{roleStats.student}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Student</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Users Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Manage Users</span>
                                <Badge variant="outline">{users.data.length} total users</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Name</TableHead>
                                            <TableHead className="w-[250px]">Email</TableHead>
                                            <TableHead className="w-[200px]">Role</TableHead>
                                            <TableHead className="w-[120px]">Joined</TableHead>
                                            {isAdmin && <TableHead className="w-[80px] text-right">Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={isAdmin ? 5 : 4} className="h-24 text-center text-muted-foreground">
                                                    No users found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.data.map((user: User) => (
                                                <TableRow key={user.id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{user.name}</span>
                                                            {authUser?.id === user.id && (
                                                                <span className="text-xs text-blue-600">(Your account)</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        <RoleSelector user={user} />
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    {isAdmin && (
                                                        <TableCell className="text-right">
                                                            <DeleteUserDialog user={user} />
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination would go here if needed */}
                        </CardContent>
                    </Card>

                    {/* Help text for admins */}
                    {isAdmin && (
                        <Card className="mt-4">
                            <CardContent className="p-4">
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium mb-2">Role Management Guide:</p>
                                    <ul className="space-y-1 ml-4">
                                        <li>• <strong>Students</strong> can browse and bookmark books</li>
                                        <li>• <strong>Librarians</strong> can manage books and categories</li>
                                        <li>• <strong>Administrators</strong> have full system access</li>
                                        <li>• Use the dropdown to promote students to librarians or vice versa</li>
                                        <li>• Administrator roles cannot be changed for security</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
