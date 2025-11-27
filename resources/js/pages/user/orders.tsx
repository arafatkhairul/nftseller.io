import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiPackage, FiClock, FiCheckCircle, FiX, FiSend, FiArrowRight, FiCheck } from 'react-icons/fi';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

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
    orders: Order[];
}

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent (P2P)' },
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Portfolio', href: '/orders' },
];

export default function UserOrders({ orders }: Props) {
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [p2pModalOpen, setP2pModalOpen] = useState(false);
    const [selectedOrderForP2p, setSelectedOrderForP2p] = useState<Order | null>(null);

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const completedOrders = orders.filter(order => order.status === 'completed');
    const sentOrders = orders.filter(order => order.status === 'sent');

    const handleMarkAsSent = (orderId: number) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: 'sent' }, {
            onSuccess: () => {
                setP2pModalOpen(false);
                setSelectedOrderForP2p(null);
            }
        });
    };

    const openP2pModal = (order: Order) => {
        setSelectedOrderForP2p(order);
        setP2pModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Portfolio" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
                        {orders.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">{orders.length} NFT{orders.length !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                    <Link href="/nft-marketplace">
                        <Button size="sm" variant="outline">
                            Browse NFTs
                        </Button>
                    </Link>
                </div>

                {/* Status Filters */}
                {orders.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('all')}
                                size="sm"
                                className="h-8"
                            >
                                All ({orders.length})
                            </Button>
                            <Button
                                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('completed')}
                                size="sm"
                                className="h-8"
                            >
                                Completed ({completedOrders.length})
                            </Button>
                            <Button
                                variant={filterStatus === 'sent' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('sent')}
                                size="sm"
                                className="h-8 gap-1"
                            >
                                <FiSend className="w-3 h-3" />
                                P2P Sent ({sentOrders.length})
                            </Button>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-2">
                        {filteredOrders.length > 0 ? (
                        <>
                        {filteredOrders.map((order) => {
                            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                            const StatusIcon = config.icon;

                            return (
                                <div key={order.id} className="border border-sidebar-border/50 rounded-lg p-3 hover:border-blue-500/50 hover:bg-muted/40 transition-all">
                                    <Link href={`/orders/${order.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="flex items-center justify-between gap-3">
                                                {/* NFT */}
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {order.nft_image && (
                                                        <img
                                                            src={order.nft_image}
                                                            alt={order.nft_name}
                                                            className="w-10 h-10 rounded bg-muted flex-shrink-0 object-cover"
                                                        />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-foreground truncate">
                                                            {order.nft_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {order.order_number}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Info (Hidden on mobile) */}
                                                <div className="hidden sm:flex items-center gap-8 text-xs">
                                                    <div className="text-right">
                                                        <p className="text-muted-foreground">Amount</p>
                                                        <p className="font-semibold text-emerald-500">{order.total_price} ETH</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-muted-foreground">Payment</p>
                                                        <p className="font-medium text-foreground capitalize">{order.payment_method}</p>
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="flex-shrink-0">
                                                    <Badge className={`${config.color} border flex items-center gap-1 whitespace-nowrap`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        <span className="text-xs">{config.label}</span>
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Mobile Details */}
                                            <div className="sm:hidden mt-2 pt-2 border-t border-sidebar-border/30 flex justify-between gap-2 text-xs">
                                                <div>
                                                    <p className="text-muted-foreground">Amount</p>
                                                    <p className="font-semibold text-emerald-500">{order.total_price} ETH</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Payment</p>
                                                    <p className="font-medium text-foreground capitalize">{order.payment_method}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Action Buttons - Only for Completed Orders */}
                                    {order.status === 'completed' && (
                                        <div className="mt-3 pt-3 border-t border-sidebar-border/30 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-8 text-xs gap-1"
                                                onClick={() => openP2pModal(order)}
                                            >
                                                <FiSend className="w-3 h-3" />
                                                P2P Sent
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 text-xs gap-1"
                                                onClick={() => handleMarkAsSent(order.id)}
                                            >
                                                <FiCheck className="w-3 h-3" />
                                                Sent
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FiPackage className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No {filterStatus !== 'all' ? filterStatus : ''} orders</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FiPackage className="w-10 h-10 text-muted-foreground mb-3" />
                        <h3 className="font-medium text-foreground mb-1">No orders yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">Start exploring to buy your first NFT</p>
                        <Link href="/nft-marketplace">
                            <Button size="sm">Browse NFTs</Button>
                        </Link>
                    </div>
                )}

                {/* P2P Send Modal */}
                {p2pModalOpen && selectedOrderForP2p && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-background border border-sidebar-border/70 rounded-lg shadow-lg max-w-sm w-full">
                            {/* Header */}
                            <div className="border-b border-sidebar-border/70 px-6 py-4">
                                <h2 className="text-lg font-semibold text-foreground">P2P Send NFT</h2>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    {selectedOrderForP2p.nft_image && (
                                        <img
                                            src={selectedOrderForP2p.nft_image}
                                            alt={selectedOrderForP2p.nft_name}
                                            className="w-12 h-12 rounded bg-muted object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {selectedOrderForP2p.nft_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedOrderForP2p.total_price} ETH
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        You can now send this NFT to another wallet address using P2P transfer. After sending, mark the order as "Sent" to complete the transaction.
                                    </p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-200/50 rounded-lg p-3">
                                    <p className="text-xs text-blue-700 font-medium">
                                        Tip: Keep the transaction hash ready to update your order status.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-sidebar-border/70 px-6 py-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setP2pModalOpen(false);
                                        setSelectedOrderForP2p(null);
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="flex-1 gap-1"
                                    onClick={() => handleMarkAsSent(selectedOrderForP2p.id)}
                                >
                                    <FiCheck className="w-4 h-4" />
                                    Mark as Sent
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
