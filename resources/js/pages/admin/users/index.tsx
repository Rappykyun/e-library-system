import { AddUserForm } from '@/components/add-user-form';
import { DeleteUserDialog } from '@/components/delete-user-dialog';
import { EditUserForm } from '@/components/edit-user-form';
import { Heading } from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermission } from '@/hooks/use-permission';
import { useUser } from '@/hooks/use-user';
import AppLayout from '@/layouts/app-layout';
import { type Paginated, type Role, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface UsersIndexProps {
    users: Paginated<User>;
    roles: Role[];
}

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const { hasRole } = usePermission();
    const { user: authUser } = useUser();
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const isAdmin = hasRole('admin');

    // Role statistics
    const roleStats = {
        admin: users.data.filter((u) => u.roles?.[0]?.name === 'admin').length,
        librarian: users.data.filter((u) => u.roles?.[0]?.name === 'librarian').length,
        faculty: users.data.filter((u) => u.roles?.[0]?.name === 'faculty').length,
        student: users.data.filter((u) => u.roles?.[0]?.name === 'student').length,
    };

    // Role badge component
    const RoleBadge = ({ roleName }: { roleName: string }) => {
        const roleDisplay = roleName.charAt(0).toUpperCase() + roleName.slice(1);
        switch (roleName) {
            case 'admin':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{roleDisplay}</Badge>;
            case 'librarian':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{roleDisplay}</Badge>;
            case 'faculty':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{roleDisplay}</Badge>;
            case 'student':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{roleDisplay}</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Users" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading title="Manage Users" description="Manage all users in the system." />
                        {isAdmin && (
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button>Add New User</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                    </DialogHeader>
                                    <AddUserForm onClose={() => setIsAddUserOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Administrators</p>
                                            <p className="text-2xl font-bold text-red-600">{roleStats.admin}</p>
                                        </div>
                                        <RoleBadge roleName="admin" />
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
                                        <RoleBadge roleName="librarian" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                                            <p className="text-2xl font-bold text-yellow-600">{roleStats.faculty}</p>
                                        </div>
                                        <RoleBadge roleName="faculty" />
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
                                        <RoleBadge roleName="student" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Users Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>All Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <RoleBadge roleName={user.roles?.[0]?.name || 'unknown'} />
                                                </TableCell>
                                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <EditUserForm user={user} roles={roles} />
                                                        {isAdmin && authUser?.id !== user.id && <DeleteUserDialog user={user} />}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
