import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';

interface UserAvatarGroupProps {
    users: User[];
    maxAvatars?: number;
}

export function UserAvatarGroup({ users, maxAvatars = 3 }: UserAvatarGroupProps) {
    const getInitials = useInitials();
    const visibleUsers = users.slice(0, maxAvatars);
    const hiddenUserCount = users.length - maxAvatars;

    if (users.length === 0) {
        return <span className="text-sm text-muted-foreground">None</span>;
    }

    const userNames = users.map((u) => u.name).join(', ');

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center -space-x-2">
                        {visibleUsers.map((user) => (
                            <Avatar key={user.id} className="size-8 border-2 border-white dark:border-neutral-800">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                        ))}
                        {hiddenUserCount > 0 && (
                            <Avatar className="size-8 border-2 border-white dark:border-neutral-800">
                                <AvatarFallback>+{hiddenUserCount}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{userNames}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
