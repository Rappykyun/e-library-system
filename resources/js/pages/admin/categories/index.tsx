import { AddCategoryForm } from '@/components/add-category-form';
import { DeleteCategoryDialog } from '@/components/delete-category-dialog';
import { EditCategoryForm } from '@/components/edit-category-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Manage Categories</CardTitle>
                                <AddCategoryForm />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Books</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((category: Category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>{category.description}</TableCell>
                                            <TableCell>{category.books_count}</TableCell>
                                            <TableCell className="text-right">
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
