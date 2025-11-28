import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';
import { AppContent } from '@/components/app-content';
import { Head, Link } from '@inertiajs/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Order {
    id: number;
    order_number: string;
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
    order?: Order;
}

export default function OrderConfirmation({ order }: Props) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.location.href = '/dashboard';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Use actual order data or fallback to mock data
    const orderDetails = order ? {
        orderId: order.order_number,
        totalAmount: `${order.total_price} ETH`,
        paymentMethod: order.payment_method,
        date: order.created_at,
    } : {
        orderId: "#NFT-2024-7890",
        totalAmount: "1.25 ETH",
        paymentMethod: "crypto",
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    };

    return (
        <AppShell>
            <Head title="Order Confirmed" />
            <AppContent>
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        {/* Success Card */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
                                    <FaCheckCircle className="h-6 w-6 text-background" />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="text-center mb-6">
                                <h1 className="mb-2 text-xl font-bold text-foreground">
                                    Order Confirmed
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Your purchase is being processed
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6 space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Order ID</span>
                                    <span className="font-mono text-foreground">{orderDetails.orderId}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-semibold text-foreground">{orderDetails.totalAmount}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-muted-foreground">Payment</span>
                                    <span className="text-foreground capitalize">{orderDetails.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="text-foreground">{orderDetails.date}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid gap-2 sm:grid-cols-2 mb-4">
                                <Link href="/nft-marketplace">
                                    <Button
                                        variant="outline"
                                        className="w-full h-9 text-sm"
                                    >
                                        Continue Shopping
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button
                                        className="w-full h-9 text-sm"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                            </div>

                            {/* Countdown */}
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                    Redirecting in {countdown}s
                                </p>
                            </div>
                        </div>

                        {/* Support Link */}
                        <div className="mt-4 text-center">
                            <Link href="/support" className="text-xs text-muted-foreground hover:text-foreground">
                                Need help?
                            </Link>
                        </div>
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
