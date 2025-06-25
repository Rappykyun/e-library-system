import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Category } from '@/types';
import { X } from 'lucide-react';

interface BookFiltersProps {
    categories: Category[];
    filters: { search: string; category: string };
    onFilterChange: (name: string, value: string) => void;
 
}

export function BookFilters({ categories, filters, onFilterChange }: BookFiltersProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    {filters.search && (
                        <Button
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full h-2 w-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => onFilterChange('search', '')}
                            variant="ghost"
                        >
                            <X className="h-1/2 w-1/2 text-gray-500" />
                        </Button>
                    )}
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
