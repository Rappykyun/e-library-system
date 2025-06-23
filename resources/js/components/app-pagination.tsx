import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PaginatedResponse } from '@/types';
import { router } from '@inertiajs/react';

interface AppPaginationProps<T> {
    data: PaginatedResponse<T>;
}

export function AppPagination<T>({ data }: AppPaginationProps<T>) {
    const {  prev_page_url, next_page_url, links } = data;

    const pageLinks = links.slice(1, -1);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={prev_page_url || '#'}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(prev_page_url);
                        }}
                        className={!prev_page_url ? 'pointer-events-none text-muted-foreground' : ''}
                    />
                </PaginationItem>

                {pageLinks.map((link, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            href={link.url || '#'}
                            isActive={link.active}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(link.url);
                            }}
                        >
                            {link.label}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href={next_page_url || '#'}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(next_page_url);
                        }}
                        className={!next_page_url ? 'pointer-events-none text-muted-foreground' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
