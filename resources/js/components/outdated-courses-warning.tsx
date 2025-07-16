import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Book, ChevronRight } from 'lucide-react';

interface OutdatedCourse {
    id: number;
    name: string;
}

interface OutdatedCoursesWarningProps {
    courses: OutdatedCourse[];
}

export function OutdatedCoursesWarning({ courses }: OutdatedCoursesWarningProps) {
    if (courses.length === 0) {
        return null;
    }

    return (
        <Card className="border-amber-500/50 bg-amber-50/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <CardTitle className="text-amber-900">Course Health Check</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-amber-800">
                    The following active courses may have outdated materials. Consider reviewing their book lists or archiving them.
                </p>
                <div className="space-y-2">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={route('admin.courses.edit', { course: course.id })}
                            className="flex items-center justify-between rounded-lg bg-white/60 p-3 "
                        >
                            <div className="flex items-center gap-3">
                                <Book className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{course.name}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
