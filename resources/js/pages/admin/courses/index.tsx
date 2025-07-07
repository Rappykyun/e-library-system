import { AddCourseForm } from '@/components/add-course-form';
import { DeleteCourseDialog } from '@/components/delete-course-dialog';
import { EditCourseForm } from '@/components/edit-course-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Course,Paginated, Program, User } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface CoursesIndexProps extends Record<string, unknown> {
    courses: Paginated<Course>;
    programs: Program[];
    faculty: User[];
    students: User[];
}

export default function CoursesIndex({  courses, programs, faculty, students }: PageProps<CoursesIndexProps>) {
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

    return (
        <AppLayout >
            <Head title="Manage Courses" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Academic Courses</span>
                                <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add New Course</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Course</DialogTitle>
                                        </DialogHeader>
                                        <AddCourseForm programs={programs} onSuccess={() => setIsAddCourseOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Books</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-mono">{course.code}</TableCell>
                                                <TableCell className="font-medium">{course.name}</TableCell>
                                                <TableCell>{course.program.name}</TableCell>
                                                <TableCell>{course.shelf_books_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <EditCourseForm course={course} programs={programs} faculty={faculty} students={students} />
                                                        <DeleteCourseDialog course={course} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No courses found.
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
