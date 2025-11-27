import DailyOrdersChart from '@/components/dashboard/daily-orders-chart';
import OrderChart from '@/components/dashboard/order-chart';
import OrderStatusChart from '@/components/dashboard/order-status-chart';
import StateCard from '@/components/dashboard/state-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    FaWallet,
    FaShoppingBag,
    FaClock,
    FaCheckCircle,
    FaPaperPlane,
    FaArrowRight,
} from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiClock, FiCheckCircle, FiX } from 'react-icons/fi';

interface Order {
    id: number;
    order_number: string;
    nft_id: number;
    nft_name: string;
    nft_image: string | null;
    total_price: string;
    quantity: string;
    payment_method: string;
    transaction_id: string | null;
    status: string;
    created_at: string;
    created_at_diff: string;
}

interface Props {
    orders?: Order[];
    completedOrdersTotal?: number | string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
};

export default function Dashboard({ orders = [], completedOrdersTotal = 0 }: Props) {
    const completedTotal = typeof completedOrdersTotal === 'string'
        ? parseFloat(completedOrdersTotal)
        : completedOrdersTotal;

    // Mock data - Replace with actual data from backend
    const stats = {
        totalDeposit: completedTotal,
        totalOrder: orders.length || 48,
        pendingOrder: orders.filter(o => o.status === 'pending').length || 12,
        approvedOrder: orders.filter(o => o.status === 'completed').length || 8,
        sentOrder: orders.length - (orders.filter(o => o.status === 'pending').length || 0) - (orders.filter(o => o.status === 'completed').length || 0) || 28,
    };

    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back! Here's your NFT marketplace overview.</p>
                    </div>
                </div>

                {/* State Cards Grid - Vercel Style */}
                <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <StateCard
                        title="Total Completed Orders"
                        value={`${stats.totalDeposit.toFixed(2)} ETH`}
                        icon={FaWallet}
                        iconBgColor="bg-blue-500/10 dark:bg-blue-500/20"
                        iconColor="text-blue-600 dark:text-blue-400"
                    />
                    <StateCard
                        title="Total Order"
                        value={stats.totalOrder}
                        icon={FaShoppingBag}
                        iconBgColor="bg-purple-500/10 dark:bg-purple-500/20"
                        iconColor="text-purple-600 dark:text-purple-400"
                    />
                    <StateCard
                        title="Pending Order"
                        value={stats.pendingOrder}
                        icon={FaClock}
                        iconBgColor="bg-amber-500/10 dark:bg-amber-500/20"
                        iconColor="text-amber-600 dark:text-amber-400"
                    />
                    <StateCard
                        title="Approved Order"
                        value={stats.approvedOrder}
                        icon={FaCheckCircle}
                        iconBgColor="bg-emerald-500/10 dark:bg-emerald-500/20"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                    />
                    <StateCard
                        title="Sent Order"
                        value={stats.sentOrder}
                        icon={FaPaperPlane}
                        iconBgColor="bg-cyan-500/10 dark:bg-cyan-500/20"
                        iconColor="text-cyan-600 dark:text-cyan-400"
                    />
                </div>

                {/* Charts Section - Vercel Style */}
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Order Statistics Chart */}
                    <Card className="vercel-card border transition-all duration-200 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-sm font-semibold">
                                Order Statistics
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Monthly performance overview</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <OrderChart />
                        </CardContent>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card className="vercel-card border transition-all duration-200 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-sm font-semibold">
                                Order Status Distribution
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Current order breakdown</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <OrderStatusChart />
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Orders Chart - Full Width */}
                <Card className="vercel-card border transition-all duration-200 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 border-b">
                        <CardTitle className="text-sm font-semibold">
                            Weekly Order Overview
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Last 7 days activity</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <DailyOrdersChart />
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="vercel-card border transition-all duration-200 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                        <div>
                            <CardTitle className="text-sm font-semibold">
                                Recent Orders
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Latest transactions</p>
                        </div>
                        <Link href="/orders">
                            <Button variant="outline" size="sm" className="gap-2 rounded-xl border text-xs h-8 px-3">
                                View All
                                <FaArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {recentOrders.length > 0 ? (
                            <div className="space-y-2">
                                {recentOrders.map((order) => {
                                    const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                    const StatusIcon = config.icon;

                                    return (
                                        <Link key={order.id} href={`/orders/${order.id}`}>
                                            <div className="group border rounded-xl p-4 hover:bg-accent/50 hover:border-foreground/20 transition-all duration-200 cursor-pointer">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {/* NFT Image */}
                                                        {order.nft_image && (
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border">
                                                                <img
                                                                    src={order.nft_image}
                                                                    alt={order.nft_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Order Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-foreground truncate">
                                                                {order.nft_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                #{order.order_number}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Amount and Status */}
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-foreground">
                                                                {order.total_price} ETH
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {order.created_at_diff}
                                                            </p>
                                                        </div>
                                                        <Badge className={`flex items-center gap-1.5 whitespace-nowrap ${config.color} border text-xs px-2.5 py-1 rounded-full`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 rounded-2xl border border-dashed bg-muted/20">
                                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                                    <FaShoppingBag className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-semibold text-foreground mb-1">No orders yet</p>
                                <p className="text-xs text-muted-foreground mb-5">Start by browsing our NFT marketplace</p>
                                <Link href="/nft-marketplace">
                                    <Button size="sm" className="rounded-xl h-9 px-4">Browse NFTs</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
