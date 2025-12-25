import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { FiCheckCircle, FiChevronDown, FiClock, FiX } from 'react-icons/fi';

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
    sender_address: string | null;
    status: string;
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    links: any[];
    total: number;
}

interface OrderStats {
    total: number;
    pending: number;
    completed: number;
    failed: number;
}

interface Props {
    orders: PaginatedOrders;
    filters?: { search?: string };
    totalRevenue: number | null;
    stats: OrderStats;
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
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent' },
};

export default function AdminOrders({ orders, filters, totalRevenue, stats }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredOrders = filterStatus === 'all'
        ? orders.data
        : orders.data.filter(order => order.status === filterStatus);

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            onSuccess: () => {
                setExpandedOrderId(null);
            }
        });
    };

    const getStatusOptions = (currentStatus: string) => {
        return ['pending', 'completed', 'cancelled', 'failed'].filter(s => s !== currentStatus);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/orders', { search }, { preserveState: true });
    };

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
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting action</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                            <p className="text-xs text-muted-foreground">Fulfilled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Number(totalRevenue ?? 0).toFixed(2)} ETH</div>
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
                        All ({stats.total})
                    </Button>
                    <Button
                        variant={filterStatus === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('pending')}
                        size="sm"
                    >
                        Pending ({stats.pending})
                    </Button>
                    <Button
                        variant={filterStatus === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('completed')}
                        size="sm"
                    >
                        Completed ({stats.completed})
                    </Button>

                    <Button
                        variant={filterStatus === 'failed' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('failed')}
                        size="sm"
                    >
                        Failed ({stats.failed})
                    </Button>
                </div>

                <div className="flex justify-end mb-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search Order ID, Name, Email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-72 bg-background"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
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
                                        <th className="pb-3 px-2">Sent Details</th>
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

                                            let statusLabel = config.label;
                                            if (order.status === 'sent' && order.payment_method === 'p2p') {
                                                statusLabel = 'Sent (P2P)';
                                            }

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
                                                        <div className="flex flex-col gap-1 text-xs max-w-[150px]">
                                                            {order.sender_address && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">From</span>
                                                                    <span className="font-mono truncate" title={order.sender_address}>{order.sender_address}</span>
                                                                </div>
                                                            )}
                                                            {order.transaction_id && (
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">Tx ID</span>
                                                                    <span className="font-mono truncate" title={order.transaction_id}>{order.transaction_id}</span>
                                                                </div>
                                                            )}
                                                            {!order.sender_address && !order.transaction_id && (
                                                                <span className="text-muted-foreground italic">No details</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {statusLabel}
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

                <Pagination links={orders.links} />
            </div>
        </AppLayout>
    );
}
