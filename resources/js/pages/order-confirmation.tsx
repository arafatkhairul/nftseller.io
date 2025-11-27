import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';
import { AppContent } from '@/components/app-content';
import { Head, Link } from '@inertiajs/react';
import { FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
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
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setShowRedirectMessage(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0 && showRedirectMessage) {
            const redirectTimer = setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000); // Wait 2 seconds after showing redirect message

            return () => clearTimeout(redirectTimer);
        }
    }, [countdown, showRedirectMessage]);

    // Use actual order data or fallback to mock data
    const orderDetails = order ? {
        orderId: order.order_number,
        nftName: order.nft_name,
        nftImage: order.nft_image,
        totalAmount: `${order.total_price} ETH`,
        itemsCount: parseInt(order.quantity),
        paymentMethod: order.payment_method,
        transactionId: order.transaction_id,
        estimatedTime: "5-10 minutes",
        date: order.created_at,
    } : {
        orderId: "#NFT-2024-7890",
        nftName: "Unknown NFT",
        nftImage: null,
        totalAmount: "1.25 ETH",
        itemsCount: 1,
        paymentMethod: "crypto",
        transactionId: null,
        estimatedTime: "5-10 minutes",
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    return (
        <AppShell>
            <Head title="Order Confirmed" />
            <AppContent>
                <div className="min-h-screen bg-black">

                    <div className="relative z-10 flex min-h-[80vh] items-center justify-center p-4">
                        <div className="w-full max-w-2xl">
                            {/* Success Card */}
                            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

                                <div className="relative p-8">
                                    {/* Success Icon */}
                                    <div className="flex justify-center mb-6">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500">
                                            <FaCheckCircle className="h-8 w-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
                                            <FaClock className="h-3 w-3" />
                                            Pending Verification
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="text-center mb-8">
                                        <h1 className="mb-4 text-2xl font-semibold text-white">
                                            Order Confirmed
                                        </h1>
                                        <p className="text-gray-400">
                                            Your NFT purchase is being processed.
                                        </p>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 p-5">
                                        <h3 className="mb-4 text-base font-medium text-white">
                                            Order Summary
                                        </h3>

                                        {/* NFT Details */}
                                        {orderDetails.nftImage && (
                                            <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-700/30 p-3">
                                                <img
                                                    src={orderDetails.nftImage}
                                                    alt={orderDetails.nftName}
                                                    className="h-16 w-16 rounded object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-400">NFT</p>
                                                    <p className="font-medium text-white">{orderDetails.nftName}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-gray-500">Order ID</span>
                                                <span className="font-mono text-white">{orderDetails.orderId}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-gray-500">Total Amount</span>
                                                <span className="font-medium text-violet-400">{orderDetails.totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-gray-500">Payment Method</span>
                                                <span className="text-white capitalize">{orderDetails.paymentMethod}</span>
                                            </div>
                                            {orderDetails.transactionId && (
                                                <div className="flex justify-between items-center py-1">
                                                    <span className="text-gray-500">Transaction ID</span>
                                                    <span className="font-mono text-xs text-white">{orderDetails.transactionId}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-gray-500">Date & Time</span>
                                                <span className="text-white">{orderDetails.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs text-white">
                                                    1
                                                </div>
                                                <span className="text-sm text-violet-400">Order Placed</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-xs text-gray-400">
                                                    2
                                                </div>
                                                <span className="text-sm text-gray-500">Verification</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-xs text-gray-400">
                                                    3
                                                </div>
                                                <span className="text-sm text-gray-500">Completed</span>
                                            </div>
                                        </div>
                                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500 w-1/3 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Estimated Time */}
                                    <div className="mb-6 text-center">
                                        <p className="text-gray-500 text-sm">
                                            Estimated time: <span className="text-violet-400">{orderDetails.estimatedTime}</span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Link href="/nft-marketplace">
                                            <Button
                                                variant="outline"
                                                className="w-full h-10 border-slate-600 bg-transparent hover:bg-slate-800 text-gray-300 hover:text-white transition-colors"
                                            >
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard">
                                            <Button
                                                className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                                            >
                                                <FaUser className="h-4 w-4 mr-2" />
                                                View Dashboard
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Auto-redirect Notice */}
                                    <div className="mt-4 text-center">
                                        {countdown > 0 ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin h-3 w-3 border border-violet-400 border-t-transparent rounded-full"></div>
                                                    <p className="text-sm text-violet-400 font-medium">
                                                        Wait {countdown}s...
                                                    </p>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-1">
                                                    <div
                                                        className="bg-violet-500 h-1 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ) : showRedirectMessage ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-pulse h-3 w-3 bg-violet-400 rounded-full"></div>
                                                <p className="text-sm text-violet-400 font-medium">
                                                    Redirecting to dashboard...
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Support Info */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Need help?{" "}
                                    <Link href="/support" className="text-violet-400 hover:text-violet-300 underline">
                                        Contact Support
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
