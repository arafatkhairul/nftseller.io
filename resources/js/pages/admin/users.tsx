import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FaUser, FaLock } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
    status: string;
}

export default function AdminUsers({ users }: { users: User[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="dash-view">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage and view all users in the system.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Total of {users.length} users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr className="text-left text-sm font-medium text-muted-foreground">
                                    <th className="pb-3 px-2">Name</th>
                                    <th className="pb-3 px-2">Email</th>
                                    <th className="pb-3 px-2">Role</th>
                                    <th className="pb-3 px-2">Joined</th>
                                    <th className="pb-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <FaUser className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-muted-foreground">{user.email}</td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-500'
                                                    : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {user.role === 'admin' && <FaLock className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-muted-foreground">{user.joinedAt}</td>
                                        <td className="py-4 px-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            </div>
        </AppLayout>
    );
}
