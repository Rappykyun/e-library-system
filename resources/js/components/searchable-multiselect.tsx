import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableMultiSelectProps {
    options: { value: string; label: string }[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
}

export default function SearchableMultiSelect({
    options,
    value,
    onValueChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search...',
}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false);

    const selectedOptions = options.filter((option) => value.includes(option.value));

    const handleSelect = (optionValue: string) => {
        const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
        onValueChange(newValue);
    };

    const handleRemove = (optionValue: string) => {
        onValueChange(value.filter((v) => v !== optionValue));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto min-h-10 w-full justify-between">
                    <div className="flex flex-1 flex-wrap gap-1">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedOptions.map((option) => (
                                <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                                    {option.label}
                                    <button
                                        type="button"
                                        className="ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        aria-label={`Remove ${option.label}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRemove(option.value);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleRemove(option.value)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command
                    filter={(itemValue, search) => {
                        const currentOption = options.find((option) => option.value === itemValue);
                        if (currentOption?.label.toLowerCase().includes(search.toLowerCase())) {
                            return 1;
                        }
                        return 0;
                    }}
                >
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                                    <Check className={cn('mr-2 h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
