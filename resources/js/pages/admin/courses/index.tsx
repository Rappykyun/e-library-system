import { AddCourseForm } from '@/components/add-course-form';
import { AppPagination } from '@/components/app-pagination';
import { DeleteCourseDialog } from '@/components/delete-course-dialog';
import { EditCourseForm } from '@/components/edit-course-form';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserAvatarGroup } from '@/components/user-avatar-group';
import AppLayout from '@/layouts/app-layout';
import { Course, PaginatedResponse, Program, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CoursesIndexProps {
    courses: PaginatedResponse<Course>;
    programs: Program[];
    faculty: User[];
    students: User[];
    filters: {
        program?: string;
        status?: string;
    };
}

export default function CoursesIndex({ courses, programs, faculty, students, filters }: CoursesIndexProps) {
    const [programFilter, setProgramFilter] = useState(filters.program || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'active');
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

    useEffect(() => {
        const query = {
            program: programFilter,
            status: statusFilter,
        };

        router.get(route('admin.courses.index'), query, {
            preserveState: true,
            replace: true,
        });
    }, [programFilter, statusFilter]);

    return (
        <AppLayout>
            <Head title="Manage Courses" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading title="Courses" description="Manage all courses in the system." />
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
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>All Courses</CardTitle>
                                <div className="flex items-center gap-4">
                                    <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) => setProgramFilter(value === 'all' ? '' : value)}
                                        defaultValue={programFilter || 'all'}
                                    >
                                        <SelectTrigger className="w-[240px]">
                                            <SelectValue placeholder="Filter by program..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Programs</SelectItem>
                                            {programs.map((program: Program) => (
                                                <SelectItem key={program.id} value={program.id.toString()}>
                                                    {program.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead>Health</TableHead>
                                            <TableHead>Faculty</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead>Books</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses.data.map((course: Course) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-mono text-sm">{course.id}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{course.name}</div>
                                                    <div className="text-sm text-muted-foreground">{course.code}</div>
                                                </TableCell>
                                                <TableCell>{course.program.name}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        {(course.outdated_books_count || 0) > 0 ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>This course has {course.outdated_books_count} outdated books.</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>All books in this course are up to date.</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <UserAvatarGroup users={course.faculty || []} />
                                                </TableCell>
                                                <TableCell>{course.students_count}</TableCell>
                                                <TableCell>{course.shelf_books_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <EditCourseForm course={course} programs={programs} faculty={faculty} students={students} />
                                                        <DeleteCourseDialog course={course} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <AppPagination data={courses} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
