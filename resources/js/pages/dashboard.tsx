import DailyOrdersChart from '@/components/dashboard/daily-orders-chart';
import OrderChart from '@/components/dashboard/order-chart';
import OrderStatusChart from '@/components/dashboard/order-status-chart';
import StateCard from '@/components/dashboard/state-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    FaWallet,
    FaShoppingBag,
    FaClock,
    FaCheckCircle,
    FaPaperPlane,
} from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    // Mock data - Replace with actual data from backend
    const stats = {
        totalDeposit: 125000,
        totalOrder: 48,
        pendingOrder: 12,
        approvedOrder: 8,
        sentOrder: 28,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* State Cards Grid */}
                <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <StateCard
                        title="Total Deposit"
                        value={`$${stats.totalDeposit.toLocaleString()}`}
                        icon={FaWallet}
                        iconBgColor="bg-emerald-500/10"
                        iconColor="text-emerald-500"
                    />
                    <StateCard
                        title="Total Order"
                        value={stats.totalOrder}
                        icon={FaShoppingBag}
                        iconBgColor="bg-blue-500/10"
                        iconColor="text-blue-500"
                    />
                    <StateCard
                        title="Pending Order"
                        value={stats.pendingOrder}
                        icon={FaClock}
                        iconBgColor="bg-yellow-500/10"
                        iconColor="text-yellow-500"
                    />
                    <StateCard
                        title="Approved Order"
                        value={stats.approvedOrder}
                        icon={FaCheckCircle}
                        iconBgColor="bg-purple-500/10"
                        iconColor="text-purple-500"
                    />
                    <StateCard
                        title="Sent Order"
                        value={stats.sentOrder}
                        icon={FaPaperPlane}
                        iconBgColor="bg-cyan-500/10"
                        iconColor="text-cyan-500"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Order Statistics Chart */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Order Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderChart />
                        </CardContent>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Order Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderStatusChart />
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Orders Chart - Full Width */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Weekly Order Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DailyOrdersChart />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
