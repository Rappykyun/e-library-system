import { AddCategoryForm } from '@/components/add-category-form';
import { DeleteCategoryDialog } from '@/components/delete-category-dialog';
import { EditCategoryForm } from '@/components/edit-category-form';
import { Heading } from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Category, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';

interface CategoriesIndexProps {
    categories: Paginated<Category>;
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <AppLayout>
            <Head title="Manage Categories" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading title="Manage Categories" description="Manage all book categories in the system." />
                        <AddCategoryForm />
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>{category.description || 'No description'}</TableCell>
                                            <TableCell className="flex justify-end space-x-2">
                                                <EditCategoryForm category={category} />
                                                <DeleteCategoryDialog category={category} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
