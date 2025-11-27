import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FaUser } from 'react-icons/fa';
import { FiCheckCircle, FiClock, FiX, FiChevronDown } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Order {
    id: number;
    order_number: string;
    user_id: number;
    user_name: string;
    user_email: string;
    nft_name: string;
    nft_image: string | null;
    total_price: string;
    quantity: string;
    payment_method: string;
    transaction_id: string | null;
    status: string;
    created_at: string;
}

interface Props {
    orders: Order[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent (P2P)' },
};

export default function AdminOrders({ orders }: Props) {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            onSuccess: () => {
                setExpandedOrderId(null);
            }
        });
    };

    const getStatusOptions = (currentStatus: string) => {
        return ['pending', 'completed', 'cancelled', 'failed', 'sent'].filter(s => s !== currentStatus);
    };

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order Management" />
            <div className="dash-view">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Order Management</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Manage and track all orders in the system.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{orders.length}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{orders.filter(o => o.status === 'pending').length}</div>
                            <p className="text-xs text-muted-foreground">Awaiting action</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{orders.filter(o => o.status === 'completed').length}</div>
                            <p className="text-xs text-muted-foreground">Fulfilled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} ETH</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('all')}
                        size="sm"
                    >
                        All ({orders.length})
                    </Button>
                    <Button
                        variant={filterStatus === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('pending')}
                        size="sm"
                    >
                        Pending ({orders.filter(o => o.status === 'pending').length})
                    </Button>
                    <Button
                        variant={filterStatus === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('completed')}
                        size="sm"
                    >
                        Completed ({orders.filter(o => o.status === 'completed').length})
                    </Button>
                    <Button
                        variant={filterStatus === 'sent' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('sent')}
                        size="sm"
                    >
                        P2P Sent ({orders.filter(o => o.status === 'sent').length})
                    </Button>
                    <Button
                        variant={filterStatus === 'failed' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('failed')}
                        size="sm"
                    >
                        Failed ({orders.filter(o => o.status === 'failed').length})
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>Manage customer orders and payment status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-left text-sm font-medium text-muted-foreground">
                                        <th className="pb-3 px-2">Order ID</th>
                                        <th className="pb-3 px-2">Customer</th>
                                        <th className="pb-3 px-2">NFT</th>
                                        <th className="pb-3 px-2">Amount</th>
                                        <th className="pb-3 px-2">Payment</th>
                                        <th className="pb-3 px-2">Status</th>
                                        <th className="pb-3 px-2">Date</th>
                                        <th className="pb-3 px-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => {
                                            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                            const StatusIcon = config.icon;
                                            const isExpanded = expandedOrderId === order.id;

                                            return (
                                                <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                                                    <td className="py-4 px-2">
                                                        <span className="font-mono text-sm font-medium">{order.order_number}</span>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <FaUser className="w-3 h-3 text-primary" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-medium">{order.user_name}</span>
                                                                <p className="text-xs text-muted-foreground">{order.user_email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center gap-2">
                                                            {order.nft_image && (
                                                                <img
                                                                    src={order.nft_image}
                                                                    alt={order.nft_name}
                                                                    className="w-6 h-6 rounded object-cover"
                                                                />
                                                            )}
                                                            <span className="text-sm truncate max-w-32">{order.nft_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <span className="font-semibold text-emerald-500">{order.total_price} ETH</span>
                                                    </td>
                                                    <td className="py-4 px-2 text-sm capitalize">{order.payment_method}</td>
                                                    <td className="py-4 px-2">
                                                        <Badge className={`${config.color} border flex items-center gap-1 w-fit`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {config.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-2 text-sm text-muted-foreground">{order.created_at}</td>
                                                    <td className="py-4 px-2">
                                                        <div className="relative">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="gap-1 h-7"
                                                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                            >
                                                                Change
                                                                <FiChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                            </Button>
                                                            {isExpanded && (
                                                                <div className="absolute right-0 top-full mt-1 bg-background border border-sidebar-border/70 rounded-lg shadow-lg z-10">
                                                                    {getStatusOptions(order.status).map((status) => (
                                                                        <button
                                                                            key={status}
                                                                            onClick={() => handleStatusChange(order.id, status)}
                                                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-muted capitalize first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                                                                        >
                                                                            {status}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                                No orders found
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
