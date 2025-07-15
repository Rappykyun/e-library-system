import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User | null;
    roles: string[];
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    permissions: Permission[];
    [key: string]: unknown;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    created_at: string;
    updated_at: string;
    books_count?: number;
}

export interface Program {
    id: number;
    name: string;
    description: string | null;
    courses_count?: number;
}

export interface Course {
    id: number;
    name: string;
    code: string;
    description: string | null;
    status: 'active' | 'archived';
    program_id: number;
    program: Program;
    books_count?: number;
    faculty?: User[];
    students?: User[];
    faculty_count?: number;
    students_count?: number;
    shelf_books?: Book[];
    shelf_books_count?: number;
    outdated_books_count?: number;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    isbn: string | null;
    cover_image_url: string;
    cover_image_public_id: string | null;
    ebook_url: string | null;
    ebook_public_id: string | null;
    category: Category;
    category_id: number;
    course: Course | null;
    course_id: number | null;
    publisher: string | null;
    published_year: string | null;
    pages: number | null;
    language: string | null;
    download_count: number;
    views_count: number;
    created_at: string;
    updated_at: string;
    bookmarks?: Bookmark[];
}

export interface Bookmark {
    id: number;
    user_id: number;
    book_id: number;
    created_at: string;
    updated_at: string;
}

export interface Rating {
    id: number;
    user_id: number;
    book_id: number;
    rating: number;
    review?: string | null;
    created_at: string;
    updated_at: string;
}

interface BookFormData {
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    published_year: string; // HTML inputs give you strings – parse to number in handleSubmit if you need it numeric.
    pages: string;
    language: string;
    category_id: string; // or number, then cast to string when binding to <Select>
    description: string;
    ebook: File | null;
}

export interface Paginated<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface Role {
    id: number;
    name: string;
}

export interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginatedLink[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface DownloadLog extends AppModel {
    id: number;
    user: User;
    book: Book;
    activity_type: 'download' | 'preview';
    created_at: string;
}
