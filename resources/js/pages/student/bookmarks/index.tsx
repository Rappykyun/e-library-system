import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function BookmarksIndex() {
    return (
        <AppLayout>
            <Head title="My Bookmarks" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Here you can see your bookmarked books.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
