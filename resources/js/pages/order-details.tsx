import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FiCheckCircle, FiClock, FiX } from 'react-icons/fi';

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
    user_name: string;
    user_email: string;
    created_at: string;
    p2p_transfer?: {
        id: number;
        transfer_code: string;
        partner_address: string;
        amount: string;
        network: string;
        status: string;
        appeal_reason?: string;
        appealed_at?: string;
    } | null;
}

interface Props {
    order: Order;
}

const statusConfig = {
    pending: { variant: 'warning' as const, icon: FiClock, label: 'Pending', description: 'Your order is being processed' },
    processing: { variant: 'warning' as const, icon: FiClock, label: 'Processing', description: 'Your order is being processed' },
    completed: { variant: 'success' as const, icon: FiCheckCircle, label: 'Completed', description: 'Order completed successfully' },
    cancelled: { variant: 'error' as const, icon: FiX, label: 'Cancelled', description: 'Order has been cancelled' },
    failed: { variant: 'error' as const, icon: FiX, label: 'Failed', description: 'Order failed to process' },
    sent: { variant: 'success' as const, icon: FiCheckCircle, label: 'Sent (P2P)', description: 'NFT has been sent via P2P transfer' },
    appealed: { variant: 'warning' as const, icon: FiAlertTriangle, label: 'Appealed', description: 'This order is currently under appeal' },
    appeal_approved: { variant: 'success' as const, icon: FiCheckCircle, label: 'Approved', description: 'Appeal approved. You can now retry the transfer.' },
    appeal_rejected: { variant: 'error' as const, icon: FiX, label: 'Restricted', description: 'Appeal rejected. This NFT is restricted.' },
};

import { FiAlertTriangle } from 'react-icons/fi';

export default function OrderDetails({ order }: Props) {
    const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = config.icon;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Orders',
            href: '/orders',
        },
        {
            title: `Order ${order.order_number}`,
            href: `/orders/${order.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
                        <p className="text-muted-foreground mt-1">Order #{order.order_number}</p>
                    </div>
                    <Badge variant={config.variant} className="flex items-center gap-2 py-2 px-4">
                        <StatusIcon className="w-4 h-4" />
                        <span>{config.label}</span>
                    </Badge>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Status Description */}
                    <Card className="border-sidebar-border/70">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Badge variant={config.variant} className="p-3">
                                    <StatusIcon className="w-6 h-6" />
                                </Badge>
                                <div>
                                    <h3 className="font-semibold text-foreground">{config.label}</h3>
                                    <p className="text-sm text-muted-foreground">{config.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appeal Details */}
                    {order.status === 'appealed' && order.p2p_transfer && (
                        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-900/30">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                    <FiAlertTriangle className="w-5 h-5" />
                                    Appeal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Reason for Appeal</p>
                                    <p className="mt-1 text-orange-900 dark:text-orange-200">{order.p2p_transfer.appeal_reason}</p>
                                </div>
                                <div className="text-sm text-orange-700 dark:text-orange-400">
                                    Submitted on: {order.p2p_transfer.appealed_at}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* P2P Transfer Details */}
                    {order.p2p_transfer && (
                        <Card className="border-sidebar-border/70">
                            <CardHeader>
                                <CardTitle className="text-lg">P2P Transfer Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Partner Address</p>
                                        <p className="font-mono text-sm break-all bg-muted p-2 rounded mt-1">{order.p2p_transfer.partner_address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transfer Amount</p>
                                        <p className="font-medium mt-1">{order.p2p_transfer.amount} {order.p2p_transfer.network}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transfer Status</p>
                                        <Badge variant="outline" className="mt-1 capitalize">{order.p2p_transfer.status.replace('_', ' ')}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transfer Code</p>
                                        <p className="font-mono text-xs text-muted-foreground mt-1">{order.p2p_transfer.transfer_code}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* NFT Details */}
                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle className="text-lg">NFT Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-6">
                                {order.nft_image && (
                                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <img
                                            src={order.nft_image}
                                            alt={order.nft_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">NFT Name</p>
                                        <p className="text-lg font-semibold text-foreground">{order.nft_name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Quantity</p>
                                            <p className="font-semibold text-foreground">{order.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Unit Price</p>
                                            <p className="font-semibold text-foreground">{order.total_price} ETH</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-sidebar-border/50">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono font-semibold text-foreground">{order.order_number}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-sidebar-border/50">
                                <span className="text-muted-foreground">Total Amount</span>
                                <span className="text-lg font-semibold text-emerald-500">{order.total_price} ETH</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-sidebar-border/50">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-semibold text-foreground capitalize">{order.payment_method}</span>
                            </div>
                            {order.transaction_id && (
                                <div className="flex justify-between items-center py-3 border-b border-sidebar-border/50">
                                    <span className="text-muted-foreground">Transaction ID</span>
                                    <span className="font-mono text-sm text-foreground break-all">{order.transaction_id}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-3">
                                <span className="text-muted-foreground">Order Date</span>
                                <span className="font-semibold text-foreground">{order.created_at}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                        <Link href="/orders" className="flex-1 min-w-[200px]">
                            <Button variant="outline" className="w-full">
                                Back to Orders
                            </Button>
                        </Link>
                        <Link href="/nft-marketplace" className="flex-1 min-w-[200px]">
                            <Button className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
