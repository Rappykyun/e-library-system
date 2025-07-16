import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { usePermission } from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookCopy, BookMarked, BookUser, Bookmark, FileClock, GraduationCap, LayoutGrid, Library, Menu, Settings, Users } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

// 👑 Admin Navigation - Full System Control
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: 'view dashboard',
    },
    {
        title: 'Books',
        href: '/admin/books',
        icon: Library,
        permission: 'edit books',
    },
    {
        title: 'Programs',
        href: '/admin/programs',
        icon: GraduationCap,
        permission: 'edit books',
    },
    {
        title: 'Courses',
        href: '/admin/courses',
        icon: BookCopy,
        permission: 'edit books',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Bookmark,
        permission: 'create categories',
    },
    {
        title: 'Activity Logs',
        href: '/admin/activity-logs',
        icon: FileClock,
        permission: 'view users',
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        permission: 'view users',
    },
];

// 📚 Librarian Navigation - Book Management Only
const librarianNavItems: NavItem[] = [
    {
        title: 'Books',
        href: '/admin/books',
        icon: Library,
        permission: 'edit books',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Bookmark,
        permission: 'create categories',
    },
];

// 👨‍🏫 Faculty Navigation - Course Shelf Management
const facultyNavItems: NavItem[] = [
    {
        title: 'My Courses',
        href: '/faculty/courses',
        icon: BookUser,
        permission: 'manage course shelves',
    },
];

// 🎓 Student Navigation - Browse Only
const studentNavItems: NavItem[] = [
    {
        title: 'Browse Books',
        href: '/student/books',
        icon: Library,
        permission: 'browse books',
    },
    {
        title: 'My Courses',
        href: '/student/my-courses',
        icon: BookUser,
        permission: 'view enrolled courses',
    },
    {
        title: 'My Bookmarks',
        href: '/student/bookmarks',
        icon: BookMarked,
        permission: 'bookmark books',
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { hasPermission, hasRole } = usePermission();
    const getInitials = useInitials();

    // ✅ Get navigation items based on user role
    const getNavItemsForRole = () => {
        if (hasRole('admin')) {
            return adminNavItems.filter((item) => (item.permission ? hasPermission(item.permission) : true));
        } else if (hasRole('librarian')) {
            return librarianNavItems.filter((item) => (item.permission ? hasPermission(item.permission) : true));
        } else if (hasRole('faculty')) {
            return facultyNavItems.filter((item) => (item.permission ? hasPermission(item.permission) : true));
        } else if (hasRole('student')) {
            return studentNavItems.filter((item) => (item.permission ? hasPermission(item.permission) : true));
        }
        return [];
    };

    const navItems = getNavItemsForRole();

    return (
        <>
            <div className="fixed top-0 right-0 left-0 z-50 border-b border-sidebar-border/80 bg-white shadow-sm">
                <div className="hidden h-20 items-center space-x-6 bg-[#2A5298] lg:flex">
                    <div className="mx-auto flex w-full max-w-7xl items-center px-3">
                        <div className="mr-4">
                            <Link href="/dashboard" className="flex items-center">
                                <img src="/ched.png" alt="CHED Logo" className="h-12 w-auto" />{' '}
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold tracking-wide text-white">COMMISSION ON HIGHER EDUCATION - REGIONAL OFFICE XII</h1>{' '}
                            <h1 className="text-md tracking-wide text-white">E-Library</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto flex h-11 items-center bg-white px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {/* ✅ Mobile: Only show role-based navigation */}
                                            {navItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={item.href}
                                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* ✅ Desktop Navigation - FIXED: Only show role-based navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {navItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                (page.url === item.href || page.url.startsWith(item.href)) && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {(page.url === item.href || page.url.startsWith(item.href)) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* ✅ Right side avatar */}
                    <div className="ml-auto flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            {auth.user && (
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-medium text-gray-600">{auth.user.name}</span>

                                    <span className="text-xs font-medium text-gray-600 capitalize">{auth.roles[0]}</span>
                                </div>
                            )}
                        </div>
                        {auth.user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70 bg-white">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
