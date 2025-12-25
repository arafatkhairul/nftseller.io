import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FiArrowLeft, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
}

interface Transaction {
    id: number;
    order_number: string;
    nft_name: string;
    amount: string;
    payment_method: string;
    status: string;
    created_at: string;
    sender_address: string | null;
    transaction_id: string | null;
    partner_address: string | null;
    p2p_network: string | null;
}

interface Props {
    user: User;
    transactions: Transaction[];
}

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent' },
    pending_sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiClock, label: 'Sent (Pending)' },
};

export default function AdminUserDetails({ user, transactions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Details - ${user.name}`} />
            <div className="dash-view space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">User Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Role</span>
                                <span className="text-sm font-medium capitalize">{user.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Joined</span>
                                <span className="text-sm font-medium">{user.joinedAt}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Orders</span>
                                <span className="text-sm font-medium">{transactions.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-left text-sm font-medium text-muted-foreground">
                                        <th className="pb-3 px-2">Order #</th>
                                        <th className="pb-3 px-2">NFT</th>
                                        <th className="pb-3 px-2">Amount</th>
                                        <th className="pb-3 px-2">Payment</th>
                                        <th className="pb-3 px-2">Sent Details</th>
                                        <th className="pb-3 px-2">Status</th>
                                        <th className="pb-3 px-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((tx) => {
                                            const config = statusConfig[tx.status as keyof typeof statusConfig] || statusConfig.pending;
                                            const StatusIcon = config.icon;
                                            const isP2P = tx.p2p_network || tx.partner_address;
                                            const displayLabel = (tx.status === 'sent' && isP2P) ? 'P2P Sent' : config.label;

                                            return (
                                                <tr key={tx.id} className="border-b hover:bg-muted/50 transition-colors">
                                                    <td className="py-4 px-2 font-mono text-sm">{tx.order_number}</td>
                                                    <td className="py-4 px-2">{tx.nft_name}</td>
                                                    <td className="py-4 px-2 font-semibold text-emerald-500">{tx.amount} ETH</td>
                                                    <td className="py-4 px-2 capitalize text-sm">{tx.payment_method}</td>
                                                    <td className="py-4 px-2">
                                                        <div className="flex flex-col gap-1 text-xs max-w-[200px]">
                                                            {tx.sender_address && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">From (User)</span>
                                                                    <span className="font-mono truncate" title={tx.sender_address}>{tx.sender_address}</span>
                                                                </div>
                                                            )}
                                                            {tx.partner_address && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">To (Partner)</span>
                                                                    <span className="font-mono truncate" title={tx.partner_address}>{tx.partner_address}</span>
                                                                </div>
                                                            )}
                                                            {tx.transaction_id && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">Tx ID</span>
                                                                    <span className="font-mono truncate" title={tx.transaction_id}>{tx.transaction_id}</span>
                                                                </div>
                                                            )}
                                                            {!tx.sender_address && !tx.partner_address && !tx.transaction_id && (
                                                                <span className="text-muted-foreground italic">No details</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {displayLabel}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-2 text-sm text-muted-foreground">{tx.created_at}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
