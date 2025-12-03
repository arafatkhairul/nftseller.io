import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

interface Order {
    id: number;
    order_number: string;
    user_name: string;
    user_email: string;
    nft_name: string;
    nft_image: string | null;
    total_price: string;
    sender_address: string;
    created_at: string;
}

interface Props {
    orders: Order[];
}

export default function AdminPendingSent({ orders }: Props) {
    const handleApprove = (id: number) => {
        if (confirm('Are you sure you want to approve this sent request?')) {
            router.post(route('admin.orders.approve-sent', id));
        }
    };

    const handleReject = (id: number) => {
        if (confirm('Are you sure you want to reject this sent request?')) {
            router.post(route('admin.orders.reject-sent', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Pending Sent', href: '/admin/orders/pending-sent' }
        ]}>
            <Head title="Pending Sent Requests" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pending Sent Requests</h1>
                        <p className="text-muted-foreground mt-1">Review and verify manual NFT sent requests.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {order.nft_image && (
                                                <img
                                                    src={order.nft_image}
                                                    alt={order.nft_name}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">Order #{order.order_number}</span>
                                                    <Badge variant="outline" className="flex items-center gap-1 text-purple-600 border-purple-200 bg-purple-50">
                                                        <FaClock className="w-3 h-3" />
                                                        Pending Verification
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    User: <span className="font-medium text-foreground">{order.user_name}</span> ({order.user_email})
                                                </div>
                                                <div className="text-sm mt-1">
                                                    Sender Address: <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{order.sender_address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                                                onClick={() => handleApprove(order.id)}
                                            >
                                                <FaCheck className="w-4 h-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                onClick={() => handleReject(order.id)}
                                            >
                                                <FaTimes className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaClock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No pending requests</h3>
                                <p className="text-muted-foreground">There are no manual sent requests pending verification.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
