
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
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    FaChartBar,
    FaCog,
    FaHeadset,
    FaHome,
    FaShoppingBag,
    FaStore,
    FaUsers,
    FaWallet
} from 'react-icons/fa';
import AppLogo from './app-logo';

// Navigation Items for Regular Users
const userMainNavItems: NavItem[] = [
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

const userOrdersNavItems: NavItem[] = [
    {
        title: 'My Portfolio',
        href: '/orders',
        icon: FaShoppingBag,
    },
];

const userAccountNavItems: NavItem[] = [
    {
        title: 'Support',
        href: '/support-tickets',
        icon: FaHeadset,
    },
];

// Navigation Items for Admin
const adminMainNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: FaHome,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: FaChartBar,
    },
];

const adminManagementNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
        icon: FaUsers,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: FaShoppingBag,
    },
    {
        title: 'NFTs',
        href: '/admin/nfts',
        icon: FaShoppingBag,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FaStore,
    },
    {
        title: 'Payment Methods',
        href: '/admin/payment-methods',
        icon: FaWallet,
    },
    {
        title: 'Support Tickets',
        href: '/admin/support-tickets',
        icon: FaHeadset,
    },
];

const adminSettingsNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: FaCog,
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

    // Helper function to check if route is active
    const checkIsActive = (href: string | { url: string }) => {
        const url = typeof href === 'string' ? href : href.url;
        const currentPath = page.url;

        // Exact match for root/dashboard
        if (url === '/' || url === '/dashboard') {
            return currentPath === '/' || currentPath === '/dashboard';
        }

        // For other routes, check if current path starts with the href
        return currentPath.startsWith(url) && currentPath !== '/dashboard' && currentPath !== '/';
    };

    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                    {items.map((item) => {
                        const isActive = checkIsActive(item.href);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                    className={cn(
                                        "rounded-xl transition-all duration-200 h-9",
                                        isActive && "bg-accent font-semibold shadow-sm"
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        prefetch
                                        className="relative w-full"
                                    >
                                        {item.icon && (
                                            <item.icon className="h-4 w-4 shrink-0" />
                                        )}
                                        <span className="truncate text-sm">
                                            {item.title}
                                        </span>
                                        {item.badge !== undefined && (
                                            <SidebarMenuBadge
                                                className={cn(
                                                    'rounded-full text-[10px] px-2 py-0.5 font-semibold',
                                                    item.badgeVariant === 'destructive' &&
                                                    'bg-red-500/10 text-red-600 dark:text-red-400',
                                                    item.badgeVariant === 'secondary' &&
                                                    'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400',
                                                    !item.badgeVariant &&
                                                    'bg-blue-500/10 text-blue-600 dark:text-blue-400'
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
    const page = usePage<{ auth: { user: User } }>();
    const user = page.props.auth.user;
    const isAdmin = user.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-border bg-card">
            <SidebarHeader className="border-b border-border p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-accent rounded-xl transition-all duration-200 h-12"
                        >
                            <Link href={isAdmin ? '/admin/dashboard' : dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-2">
                {isAdmin ? (
                    <>
                        <NavGroup label="Main" items={adminMainNavItems} />
                        <NavGroup label="Management" items={adminManagementNavItems} />
                        <NavGroup label="Settings" items={adminSettingsNavItems} />
                    </>
                ) : (
                    <>
                        <NavGroup label="Main" items={userMainNavItems} />
                        <NavGroup label="Orders" items={userOrdersNavItems} />
                        <NavGroup label="Account" items={userAccountNavItems} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-3">

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
