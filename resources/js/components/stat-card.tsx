import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

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

export default function StatCard({ title, value, icon, description, trend, color }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden" style={color ? ({ '--card-accent-color': color } as React.CSSProperties) : undefined}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="rounded-full p-2 text-[var(--card-accent-color)]">{icon}</div>
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
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--card-accent-color)]" />
        </Card>
    );
}
