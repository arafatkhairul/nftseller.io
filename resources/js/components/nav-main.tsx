import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                typeof item.href === 'string'
                                    ? item.href
                                    : item.href.url,
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch className="relative w-full">
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                {item.badge !== undefined && (
                                    <SidebarMenuBadge
                                        className={cn(
                                            item.badgeVariant === 'destructive' &&
                                            'bg-red-500/10 text-red-500',
                                            item.badgeVariant === 'secondary' &&
                                            'bg-neutral-500/10 text-neutral-500',
                                            !item.badgeVariant &&
                                            'bg-blue-500/10 text-blue-500'
                                        )}
                                    >
                                        {item.badge}
                                    </SidebarMenuBadge>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
