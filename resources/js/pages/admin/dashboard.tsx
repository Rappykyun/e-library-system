import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { Book, Category, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, BarChart3, BookCopy, Calendar, Download, Eye, GraduationCap, Library, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

function StatCard({ title, value, icon, description, trend, color = 'var(--primary)' }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden" style={{ '--stat-card-color': `hsl(${color})` } as React.CSSProperties}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="rounded-full bg-[var(--stat-card-color)] p-2">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
                {trend && (
                    <div className={`mt-2 flex items-center text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {trend.isPositive ? '+' : ''}
                        {trend.value}% from last month
                    </div>
                )}
            </CardContent>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--stat-card-color)]" />
        </Card>
    );
}

interface PopularBook extends Pick<Book, 'id' | 'title' | 'author' | 'download_count'> {
    category?: Pick<Category, 'name'>;
}

interface RecentBook extends Pick<Book, 'id' | 'title' | 'author' | 'created_at'> {
    category?: Pick<Category, 'name'>;
}

interface RecentUser extends Pick<User, 'id' | 'name' | 'email' | 'created_at'> {
    role: string;
}

interface AdminDashboardProps {
    stats: {
        totalBooks: number;
        totalUsers: number;
        totalPrograms: number;
        totalCategories: number;
        totalDownloads: number;
        totalViews: number;
        popularBooks: PopularBook[];
        mostViewedBooks: PopularBook[];
        recentBooks: RecentBook[];
        booksByMonth: { month: string; month_name: string; total: number }[];
        booksByCategory: { name: string; books_count: number }[];
        usersByMonth: { month: string; month_name: string; total: number }[];
        recentUsers: RecentUser[];
    };
}

const chartConfig = {
    total: {
        label: 'Total',
        color: 'hsl(var(--chart-1))',
    },
    books: {
        label: 'Books',
        color: 'hsl(var(--chart-2))',
    },
    users: {
        label: 'Users',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

const PIE_CHART_COLORS = [
    '#3b82f6', // Bright Blue
    '#60a5fa', // Light Blue
    '#93c5fd', // Sky Blue
    '#bfdbfe', // Pale Blue
    '#1d4ed8', // Dark Blue
    '#1e40af', // Deep Blue
    '#1e3a8a', // Navy Blue
];
export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const combinedMonthlyData = stats.booksByMonth.map((bookData) => {
        const userData = stats.usersByMonth.find((u) => u.month === bookData.month);
        return {
            month: bookData.month_name,
            books: bookData.total,
            users: userData?.total || 0,
        };
    });

    const categoryChartConfig = stats.booksByCategory.reduce((acc, category, index) => {
        acc[category.name] = {
            label: category.name,
            color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        };
        return acc;
    }, {} as ChartConfig);

    const categoryDataWithColors = stats.booksByCategory.map((category, index) => ({
        ...category,
        fill: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
    }));

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back! Here's what's happening with your e-library.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatCard
                        title="Total Books"
                        value={stats.totalBooks}
                        icon={<Library className="h-4 w-4" />}
                        description="Books in collection"
                        color="lightpink"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<Users className="h-4 w-4" />}
                        description="Registered users"
                        color="var(--chart-2)"
                    />
                    <StatCard
                        title="Programs"
                        value={stats.totalPrograms}
                        icon={<GraduationCap className="h-4 w-4" />}
                        description="Academic programs"
                        color="var(--chart-3)"
                    />
                    <StatCard
                        title="Categories"
                        value={stats.totalCategories}
                        icon={<BookCopy className="h-4 w-4" />}
                        description="Book categories"
                        color="var(--chart-4)"
                    />
                    <StatCard
                        title="Downloads"
                        value={stats.totalDownloads}
                        icon={<Download className="h-4 w-4" />}
                        description="Total downloads"
                        color="var(--chart-5)"
                    />
                    <StatCard
                        title="Views"
                        value={stats.totalViews}
                        icon={<Eye className="h-4 w-4" />}
                        description="Total book views"
                        color="var(--chart-1)"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Growth Chart */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Growth Trends
                            </CardTitle>
                            <CardDescription>Books and users added over the last 12 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px]">
                                <AreaChart data={combinedMonthlyData}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="books"
                                        stackId="1"
                                        stroke="hsl(var(--chart-1))"
                                        fill="hsl(var(--chart-1))"
                                        fillOpacity={0.6}
                                        name="Books Added"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stackId="2"
                                        stroke="hsl(var(--chart-2))"
                                        fill="hsl(var(--chart-2))"
                                        fillOpacity={0.6}
                                        name="Users Registered"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* category pie chart */}
                    <Card className="flex flex-col lg:col-span-3">
                        <CardHeader className="items-center pb-0">
                            <CardTitle className="flex items-center gap-2">
                                <Library className="h-5 w-5" />
                                Category Distribution
                            </CardTitle>
                            <CardDescription>Books by category</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[350px] min-h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                        data={categoryDataWithColors}
                                        dataKey="books_count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius="70%"
                                        innerRadius="0%"
                                    >
                                        {categoryDataWithColors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartLegend
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                            fontSize: '12px',
                                        }}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-foreground">{value}</span>}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 pt-2 text-sm">
                            <div className="text-center leading-none text-muted-foreground">Showing book distribution across all categories</div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Activity Tables */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Popular Books */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Most Popular Books
                            </CardTitle>
                            <CardDescription>Based on download count</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.popularBooks.map((book, index) => (
                                    <div key={book.id} className="flex items-center gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Link href={route('admin.books.show', book.id)} className="block truncate font-medium hover:underline">
                                                {book.title}
                                            </Link>
                                            <p className="truncate text-sm text-muted-foreground">
                                                by {book.author} • {book.category?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Download className="h-3 w-3" />
                                                {book.download_count}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        {/* Recent Books */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Recently Added Books
                                </CardTitle>
                                <CardDescription>Latest additions to the library</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.recentBooks.map((book) => (
                                        <div key={book.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={route('admin.books.show', book.id)}
                                                    className="block truncate font-medium hover:underline"
                                                >
                                                    {book.title}
                                                </Link>
                                                <p className="truncate text-sm text-muted-foreground">by {book.author}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground">{new Date(book.created_at!).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Users */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Recent Users
                                </CardTitle>
                                <CardDescription>Latest user registrations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium">{user.name}</p>
                                                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="capitalize">
                                                    {user.role}
                                                </Badge>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {new Date(user.created_at!).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
