import { AddProgramForm } from '@/components/add-program-form';
import { DeleteProgramDialog } from '@/components/delete-program-dialog';
import { EditProgramForm } from '@/components/edit-program-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Paginated, Program } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface ProgramsIndexProps extends PageProps {
    programs: Paginated<Program>;
}

export default function ProgramsIndex({ auth, programs }: ProgramsIndexProps) {
    const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);

    return (
        <AppLayout user={auth.user}>
            <Head title="Manage Programs" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Academic Programs</span>
                                <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add New Program</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Program</DialogTitle>
                                        </DialogHeader>
                                        <AddProgramForm onSuccess={() => setIsAddProgramOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/2">Name</TableHead>
                                        <TableHead>Courses</TableHead>
                                        <TableHead>Books</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {programs.data.length > 0 ? (
                                        programs.data.map((program) => (
                                            <TableRow key={program.id}>
                                                <TableCell className="font-medium">{program.name}</TableCell>
                                                <TableCell>{program.courses_count}</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <EditProgramForm program={program} />
                                                        <DeleteProgramDialog program={program} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No programs found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
