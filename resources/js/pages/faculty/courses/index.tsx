import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Course } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookMarked } from 'lucide-react';

interface FacultyCoursesIndexProps extends PageProps {
    courses: Course[];
}

export default function FacultyCoursesIndex({ courses }: FacultyCoursesIndexProps) {
    return (
        <AppLayout>
            <Head title="My Courses" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Courses</CardTitle>
                            <CardDescription>Select a course to manage its book shelf.</CardDescription>
                        </CardHeader>
                        <div className="p-6 pt-0">
                            {courses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {courses.map((course) => (
                                        <Link key={course.id} href={route('faculty.courses.show', course.id)}>
                                            <Card className="flex h-full flex-col transition-all hover:border-primary">
                                                <CardHeader>
                                                    <CardTitle>{course.name}</CardTitle>
                                                    <CardDescription>{course.code}</CardDescription>
                                                </CardHeader>
                                                <div className="flex-grow" />
                                                <div className="flex items-center justify-end p-4 text-sm text-muted-foreground">
                                                    <BookMarked className="mr-2 h-4 w-4" />
                                                    <span>{course.shelf_books_count} books on shelf</span>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                        <BookMarked className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h2 className="mt-6 text-xl font-semibold">No Courses Assigned</h2>
                                    <p className="mt-2 text-center text-sm text-muted-foreground">
                                        You have not been assigned to any courses yet. Please contact an administrator.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
