import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
    FaHome,
    FaStore,
    FaShoppingBag,
    FaWallet,
    FaClock,
    FaCheckCircle,
    FaPaperPlane,
    FaCog,
    FaHistory,
    FaQuestionCircle,
} from 'react-icons/fa';
import AppLogo from './app-logo';

// Main Navigation Items
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: FaHome,
    },
    {
        title: 'NFT Marketplace',
        href: '/nft-marketplace',
        icon: FaStore,
        badge: 'New',
        badgeVariant: 'default',
    },
];

// Orders Navigation Items
const ordersNavItems: NavItem[] = [
    {
        title: 'My Orders',
        href: dashboard(),
        icon: FaShoppingBag,
    },
    {
        title: 'Pending Orders',
        href: dashboard(),
        icon: FaClock,
        badge: 12,
        badgeVariant: 'destructive',
    },
    {
        title: 'Approved Orders',
        href: dashboard(),
        icon: FaCheckCircle,
        badge: 8,
    },
    {
        title: 'Sent Orders',
        href: dashboard(),
        icon: FaPaperPlane,
        badge: 28,
    },
];

// Wallet & Settings Items
const accountNavItems: NavItem[] = [
    {
        title: 'Wallet',
        href: dashboard(),
        icon: FaWallet,
    },
    {
        title: 'Order History',
        href: dashboard(),
        icon: FaHistory,
    },
    {
        title: 'Settings',
        href: dashboard(),
        icon: FaCog,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Help Center',
        href: '#',
        icon: FaQuestionCircle,
    },
];

// Render Navigation Group Component
function NavGroup({
    label,
    items,
}: {
    label: string;
    items: NavItem[];
}) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = page.url.startsWith(
                            typeof item.href === 'string'
                                ? item.href
                                : item.href.url
                        );
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link
                                        href={item.href}
                                        prefetch
                                        className="relative w-full"
                                    >
                                        {item.icon && (
                                            <item.icon className="h-4 w-4 shrink-0" />
                                        )}
                                        <span className="font-medium truncate">
                                            {item.title}
                                        </span>
                                        {item.badge !== undefined && (
                                            <SidebarMenuBadge
                                                className={cn(
                                                    'border',
                                                    item.badgeVariant === 'destructive' &&
                                                    'bg-red-500/10 text-red-500 border-red-500/20',
                                                    item.badgeVariant === 'secondary' &&
                                                    'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
                                                    !item.badgeVariant &&
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                )}
                                            >
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border/70">
            <SidebarHeader className="border-b border-sidebar-border/70">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-2">
                <NavGroup label="Main" items={mainNavItems} />
                <NavGroup label="Orders" items={ordersNavItems} />
                <NavGroup label="Account" items={accountNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/70">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
