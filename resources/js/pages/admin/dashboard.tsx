import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FaChartBar, FaHome, FaShoppingBag, FaUsers } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ auth }: { auth: any }) {
    const stats = [
        {
            title: 'Total Users',
            value: '2,543',
            description: 'Active users in system',
            icon: FaUsers,
            color: 'bg-blue-500/10 text-blue-500',
        },
        {
            title: 'Total Orders',
            value: '1,234',
            description: 'All orders processed',
            icon: FaShoppingBag,
            color: 'bg-green-500/10 text-green-500',
        },
        {
            title: 'Revenue',
            value: '$45,231',
            description: 'Total revenue earned',
            icon: FaChartBar,
            color: 'bg-purple-500/10 text-purple-500',
        },
        {
            title: 'Dashboard',
            value: 'Admin',
            description: 'You are an administrator',
            icon: FaHome,
            color: 'bg-orange-500/10 text-orange-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="dash-view">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Welcome back, {auth.user.name}! Here's an overview of your platform.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="border-l-4 border-l-transparent hover:border-l-primary transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>Key metrics for your platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <span className="text-sm font-medium">Average Order Value</span>
                                <span className="text-2xl font-bold">$367.50</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b">
                                <span className="text-sm font-medium">Pending Orders</span>
                                <span className="text-2xl font-bold text-orange-500">45</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">User Growth (30d)</span>
                                <span className="text-2xl font-bold text-green-500">+12%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Admin Features Available</CardTitle>
                        <CardDescription>Navigate to manage platform data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <h3 className="font-semibold mb-1">👥 User Management</h3>
                                <p className="text-sm text-muted-foreground">View and manage all users in the system</p>
                            </div>
                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <h3 className="font-semibold mb-1">📦 Order Management</h3>
                                <p className="text-sm text-muted-foreground">Manage and track all orders</p>
                            </div>
                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <h3 className="font-semibold mb-1">📊 Analytics</h3>
                                <p className="text-sm text-muted-foreground">View detailed analytics and reports</p>
                            </div>
                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <h3 className="font-semibold mb-1">⚙️ Settings</h3>
                                <p className="text-sm text-muted-foreground">Configure platform settings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
