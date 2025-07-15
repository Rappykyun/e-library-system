
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Course } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface MyCoursesIndexProps extends Record<string, unknown> {
    courses: Course[];
}

export default function MyCoursesIndex({ courses }: PageProps<MyCoursesIndexProps>) {
    return (
        <AppLayout>
            <Head title="My Courses" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">My Courses</h1>
                        <p className="text-muted-foreground">Courses you are currently enrolled in.</p>
                    </div>

                    {courses.length > 0 ? (
                        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Link href={route('student.my-courses.show', { course: course.id })} key={course.id} className="block">
                                    <Card className="flex h-full flex-col transition-all border-2 hover:border-blue-500 hover:shadow-md pt-4">
                                        <CardHeader>
                                            <CardTitle>{course.name}</CardTitle>
                                            <CardDescription>{course.code}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground">{course.program.name}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <div className="text-sm text-muted-foreground">
                                                {course.faculty && course.faculty.length > 0 ? (
                                                    <p>Taught by {course.faculty.map((f) => f.name).join(', ')}</p>
                                                ) : (
                                                    <p>No faculty assigned.</p>
                                                )}
                                                <p>{course.shelf_books_count} books on shelf</p>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 text-center">
                            <p>You are not enrolled in any courses.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
