import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function StudentDashboard() {
    return (
        <AppLayout>
            <Head title="Student Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">This is the student dashboard.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
