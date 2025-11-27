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
                'group vercel-card relative overflow-hidden rounded-2xl border p-6 transition-all duration-200',
                className
            )}
        >
            <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
                                iconBgColor,
                                iconColor
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">
                            {title}
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight vercel-count-up">
                            {formattedValue}
                        </h3>
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1.5 pt-1">
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                                    trend.isPositive
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                        : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                )}
                            >
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


