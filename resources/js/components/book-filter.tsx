import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Category } from '@/types';
import { Loader2, X } from 'lucide-react';

interface BookFiltersProps {
    categories: Category[];
    filters: { search: string; category: string };
    onFilterChange: (name: string, value: string) => void;
    isSearching?: boolean;
}

export function BookFilters({ categories, filters, onFilterChange, isSearching = false }: BookFiltersProps) {
    return (
        <div className="mr-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <Input
                        id="search"
                        placeholder="Search by title or author..."
                        className="w-full pr-10"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                    <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                        {isSearching && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                        {filters.search && (
                            <Button
                                className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-gray-200"
                                onClick={() => onFilterChange('search', '')}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="h-3 w-3 text-gray-500" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
