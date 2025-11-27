import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
    },
];

export default function AdminAnalytics() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="dash-view">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Detailed analytics and insights for your platform.
                    </p>
                </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">+12% from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.28%</div>
                        <p className="text-xs text-muted-foreground">+0.5% improvement</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Last 30 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">Chart visualization would go here</p>
                    </div>
                </CardContent>
            </Card>
            </div>
        </AppLayout>
    );
}
