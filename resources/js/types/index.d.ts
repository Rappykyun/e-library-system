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
    [key: string]: unknown; // This allows for additional properties...
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

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string | null;
    isbn: string | null;
    cover_image_url: string;
    cover_image_public_id: string | null;
    ebook_url: string | null;
    ebook_public_id: string | null;
    category?: Category;
    publisher: string | null;
    published_year: string | null;
    pages: number | null;
    language: string | null;
    download_count: number;
    views_count: number;
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

