import { AppPagination } from '@/components/app-pagination';
import { Heading } from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { DownloadLog, Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Book, Download, Eye, User } from 'lucide-react';

export default function ActivityLogIndex({ logs }: PageProps<{ logs: Paginated<DownloadLog> }>) {
    return (
        <AppLayout>
            <Head title="Activity Logs" />
            <div className="space-y-4">
                <Heading title="Activity Logs" description="A log of all user download and preview activities." />

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.map((log: DownloadLog) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{log.user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Book className="h-4 w-4 text-muted-foreground" />
                                                <span>{log.book.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={log.activity_type === 'download' ? 'default' : 'secondary'} className="capitalize">
                                                {log.activity_type === 'download' ? (
                                                    <Download className="mr-2 h-4 w-4" />
                                                ) : (
                                                    <Eye className="mr-2 h-4 w-4" />
                                                )}
                                                {log.activity_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(log.created_at), 'PPP p')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <AppPagination data={logs} />
            </div>
        </AppLayout>
    );
}
