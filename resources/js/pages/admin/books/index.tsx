import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
export default function BooksIndex() {
    return (
        <AppLayout>
            <Head title="Manage Books" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <Button className=''>Add Books</Button>
                        <div className="p-6 text-gray-900">Here you can manage books.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
