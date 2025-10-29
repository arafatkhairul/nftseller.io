import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

interface StateCardProps {
    title: string;
    value: string | number;
    icon: IconType;
    iconBgColor?: string;
    iconColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export default function StateCard({
    title,
    value,
    icon: Icon,
    iconBgColor = 'bg-blue-500/10',
    iconColor = 'text-blue-500',
    trend,
    className,
}: StateCardProps) {
    const formattedValue =
        typeof value === 'number'
            ? value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            })
            : value;

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-sidebar-border dark:border-sidebar-border',
                className
            )}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-muted-foreground text-sm font-medium">
                        {title}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight">
                        {formattedValue}
                    </h3>
                    {trend && (
                        <p
                            className={cn(
                                'mt-2 text-xs font-medium',
                                trend.isPositive
                                    ? 'text-emerald-500'
                                    : 'text-red-500'
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                </div>
                <div
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110',
                        iconBgColor,
                        iconColor
                    )}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

