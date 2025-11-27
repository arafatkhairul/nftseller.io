import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FaCog, FaBell, FaLock } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Settings',
        href: '/admin/settings',
    },
];

export default function AdminSettings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Settings" />
            <div className="dash-view">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Admin Settings</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Configure platform settings and preferences.
                    </p>
                </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaCog className="w-5 h-5" />
                            General Settings
                        </CardTitle>
                        <CardDescription>Configure basic platform settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Site Name</p>
                                <p className="text-sm text-muted-foreground">OpenSea NFT Marketplace</p>
                            </div>
                            <span className="text-sm text-primary cursor-pointer">Edit</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Support Email</p>
                                <p className="text-sm text-muted-foreground">support@opensea.com</p>
                            </div>
                            <span className="text-sm text-primary cursor-pointer">Edit</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaCog className="w-5 h-5" />
                            Feature Toggles
                        </CardTitle>
                        <CardDescription>Enable or disable platform features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">User Registration</p>
                                <p className="text-sm text-muted-foreground">Allow new users to register</p>
                            </div>
                            <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">NFT Marketplace</p>
                                <p className="text-sm text-muted-foreground">Enable NFT marketplace features</p>
                            </div>
                            <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaBell className="w-5 h-5" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>Manage notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                            </div>
                            <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Order Alerts</p>
                                <p className="text-sm text-muted-foreground">Notify on new orders</p>
                            </div>
                            <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaLock className="w-5 h-5" />
                            Security Settings
                        </CardTitle>
                        <CardDescription>Configure security and access control</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                            </div>
                            <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">API Rate Limiting</p>
                                <p className="text-sm text-muted-foreground">Limit API requests per user</p>
                            </div>
                            <div className="w-10 h-6 bg-neutral-300 rounded-full cursor-pointer relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </div>
        </AppLayout>
    );
}
