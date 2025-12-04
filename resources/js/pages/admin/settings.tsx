import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaBell, FaClock, FaCog, FaGlobe, FaLock } from 'react-icons/fa';

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

export default function AdminSettings({ settings }: { settings: Record<string, string> }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        p2p_payment_deadline_minutes: settings?.p2p_payment_deadline_minutes || '15',
        p2p_auto_release_minutes: settings?.p2p_auto_release_minutes || '5',
    });

    const submitP2pSettings = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
        });
    };

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
                                <FaClock className="w-5 h-5" />
                                P2P Transfer Settings
                            </CardTitle>
                            <CardDescription>Configure timers for P2P transfers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitP2pSettings} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_deadline">Payment Deadline (Minutes)</Label>
                                        <Input
                                            id="payment_deadline"
                                            type="number"
                                            value={data.p2p_payment_deadline_minutes}
                                            onChange={e => setData('p2p_payment_deadline_minutes', e.target.value)}
                                            min="1"
                                        />
                                        <p className="text-xs text-muted-foreground">Time allowed for buyer to complete payment.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="auto_release">Auto-Release Timer (Minutes)</Label>
                                        <Input
                                            id="auto_release"
                                            type="number"
                                            value={data.p2p_auto_release_minutes}
                                            onChange={e => setData('p2p_auto_release_minutes', e.target.value)}
                                            min="1"
                                        />
                                        <p className="text-xs text-muted-foreground">Time before asset is auto-released after payment confirmation.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600 animate-fade-in">Saved successfully!</p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

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
                                <FaGlobe className="w-5 h-5" />
                                Social Links Settings
                            </CardTitle>
                            <CardDescription>Manage social media links displayed in the footer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Footer Social Links</p>
                                    <p className="text-sm text-muted-foreground">Configure Facebook, Twitter, Instagram, etc.</p>
                                </div>
                                <Link href="/admin/settings/social-links" className="text-sm text-primary hover:underline">
                                    Manage Links
                                </Link>
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
