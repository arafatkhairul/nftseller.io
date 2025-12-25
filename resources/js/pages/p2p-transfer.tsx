import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';

interface Transfer {
    id: number;
    transfer_code: string;
    order_number: string;
    nft_name: string;
    nft_image: string | null;
    partner_address: string;
    payment_method: string;
    payment_method_icon: string;
    amount: string;
    sender_address: string;
    network: string;
    status: string;
    remaining_time: number | null;
    created_at: string;
    payment_deadline_minutes: number;
    auto_release_minutes: number;
}

interface Props {
    transfer: Transfer;
}

export default function P2pTransfer({ transfer: initialTransfer }: Props) {
    const [transfer, setTransfer] = useState(initialTransfer);
    const [remainingTime, setRemainingTime] = useState(initialTransfer.remaining_time || 0);
    const [appealReason, setAppealReason] = useState('');
    const [showAppealModal, setShowAppealModal] = useState(false);

    // Poll for status updates
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/p2p-transfer/${transfer.id}/status`);
                const data = await response.json();

                if (data.status !== transfer.status) {
                    setTransfer(prev => ({ ...prev, status: data.status }));
                }

                if (data.remaining_time !== null) {
                    setRemainingTime(data.remaining_time);
                }

                // If released, redirect
                if (data.status === 'released') {
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error polling status:', error);
            }
        }, 1000); // Poll every second

        return () => clearInterval(interval);
    }, [transfer.id, transfer.status]);

    // Countdown timer
    useEffect(() => {
        if (remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePaymentCompleted = () => {
        router.post(`/p2p-transfer/${transfer.transfer_code}/payment-completed`, {}, {
            preserveScroll: true,
        });
    };

    const handleRelease = () => {
        router.post(`/p2p-transfer/${transfer.id}/release`, {}, {
            preserveScroll: true,
        });
    };

    const handleAppeal = () => {
        if (!appealReason.trim()) return;

        router.post(`/p2p-transfer/${transfer.id}/appeal`, {
            reason: appealReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAppealModal(false);
                setAppealReason('');
            },
        });
    };

    const getStatusConfig = () => {
        switch (transfer.status) {
            case 'pending':
                return {
                    variant: 'warning' as const,
                    icon: FiClock,
                    label: 'Waiting for Payment',
                    color: 'text-yellow-600',
                };
            case 'payment_completed':
                return {
                    variant: 'success' as const,
                    icon: FiCheckCircle,
                    label: 'Payment Completed',
                    color: 'text-green-600',
                };
            case 'released':
                return {
                    variant: 'success' as const,
                    icon: FiCheckCircle,
                    label: 'Released',
                    color: 'text-green-600',
                };
            case 'appealed':
                return {
                    variant: 'error' as const,
                    icon: FiAlertTriangle,
                    label: 'Under Appeal',
                    color: 'text-red-600',
                };
            case 'appeal_rejected':
                return {
                    variant: 'destructive' as const,
                    icon: FiX,
                    label: 'Appeal Rejected',
                    color: 'text-red-600',
                };
            case 'cancelled':
                return {
                    variant: 'secondary' as const,
                    icon: FiCheckCircle,
                    label: 'Appeal Approved',
                    color: 'text-blue-600',
                };
            default:
                return {
                    variant: 'default' as const,
                    icon: FiClock,
                    label: transfer.status,
                    color: 'text-foreground',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Head title={`P2P Transfer - ${transfer.order_number}`} />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-accent border-b border-border px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">P2P Transfer</h1>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Order #{transfer.order_number}
                                    </p>
                                </div>
                                <Badge variant={statusConfig.variant} className="flex items-center gap-2">
                                    <StatusIcon className="w-4 h-4" />
                                    <span>{statusConfig.label}</span>
                                </Badge>
                            </div>
                        </div>

                        {/* Timer */}
                        {remainingTime > 0 && (transfer.status === 'pending' || transfer.status === 'payment_completed') && (
                            <div className="bg-accent border-b border-border px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiClock className={`w-5 h-5 ${statusConfig.color}`} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {transfer.status === 'pending' ? 'Payment Deadline' : 'Auto-Release Timer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transfer.status === 'pending'
                                                    ? `Complete payment within ${transfer.payment_deadline_minutes} minutes`
                                                    : `Will auto-release in ${transfer.auto_release_minutes} minutes if no action taken`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-3xl font-bold font-mono ${statusConfig.color}`}>
                                        {formatTime(remainingTime)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NFT Info */}
                        <div className="px-6 py-6 border-b border-border">
                            <div className="flex items-center gap-4">
                                {transfer.nft_image && (
                                    <img
                                        src={transfer.nft_image}
                                        alt={transfer.nft_name}
                                        className="w-20 h-20 rounded-lg object-cover border border-border"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">{transfer.nft_name}</h3>
                                    <p className="text-sm text-muted-foreground">NFT Transfer via P2P</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="px-6 py-6 space-y-6">
                            <div>
                                <h3 className="text-base font-semibold text-foreground mb-4">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Amount</Label>
                                            <p className="text-sm font-semibold text-foreground">{transfer.amount} ETH</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Network</Label>
                                            <p className="text-sm font-medium text-foreground">{transfer.network}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Payment Method</Label>
                                            <p className="text-sm font-medium text-foreground">{transfer.payment_method}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Sending NFT to this address</Label>
                                            <p className="text-xs font-mono text-foreground break-all">{transfer.partner_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Sender Address</Label>
                                <p className="text-xs font-mono text-foreground break-all mt-1">{transfer.sender_address}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        {transfer.status === 'pending' && (
                            <div className="px-6 py-4 bg-accent border-t border-border">
                                <Button
                                    onClick={handlePaymentCompleted}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <FiCheckCircle className="w-5 h-5" />
                                    Payment Completed
                                </Button>
                            </div>
                        )}

                        {transfer.status === 'payment_completed' && (
                            <div className="px-6 py-8 bg-accent border-t border-border space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5 mb-4">
                                        <FiCheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">Payment Marked as Completed</h3>
                                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                                        Please wait while the seller verifies your payment. The asset will be released automatically once verified.
                                    </p>
                                </div>

                                <div className="bg-background border border-border rounded-lg p-4 max-w-sm mx-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                        <p className="text-xs font-medium text-foreground">Waiting for seller confirmation...</p>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAppealModal(true)}
                                        className="text-muted-foreground hover:text-red-500"
                                    >
                                        <FiAlertTriangle className="w-4 h-4 mr-2" />
                                        Report an Issue / Appeal
                                    </Button>
                                </div>
                            </div>
                        )}

                        {transfer.status === 'released' && (
                            <div className="px-6 py-4 bg-green-500/10 border-t border-green-500/20">
                                <div className="text-center">
                                    <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-green-600">Transfer Released Successfully!</p>
                                    <p className="text-xs text-muted-foreground mt-1">Redirecting to home...</p>
                                </div>
                            </div>
                        )}

                        {transfer.status === 'appealed' && (
                            <div className="px-6 py-4 bg-yellow-500/10 border-t border-yellow-500/20">
                                <div className="text-center">
                                    <FiAlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-yellow-600">Appeal Submitted</p>
                                    <p className="text-xs text-muted-foreground mt-1">Admin will review your case shortly.</p>
                                </div>
                            </div>
                        )}

                        {transfer.status === 'appeal_rejected' && (
                            <div className="px-6 py-4 bg-red-500/10 border-t border-red-500/20">
                                <div className="text-center">
                                    <FiX className="w-12 h-12 text-red-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-red-600">Appeal Rejected</p>
                                    <p className="text-xs text-muted-foreground mt-1">Your appeal has been rejected by the admin.</p>
                                </div>
                            </div>
                        )}

                        {transfer.status === 'cancelled' && (
                            <div className="px-6 py-4 bg-blue-500/10 border-t border-blue-500/20">
                                <div className="text-center">
                                    <FiCheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-blue-600">Appeal Approved</p>
                                    <p className="text-xs text-muted-foreground mt-1">You can now retry the transfer or place a new order.</p>
                                    <Button
                                        variant="link"
                                        className="mt-2 text-blue-600"
                                        onClick={() => window.location.href = '/orders'}
                                    >
                                        Go to Orders
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Support Notice */}
                    <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm">
                            <FiAlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                Need assistance? <a href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Login</a> or <a href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Register</a> to contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appeal Modal */}
            {
                showAppealModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full">
                            <div className="border-b border-border px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground">Submit Appeal</h2>
                                    <button
                                        onClick={() => setShowAppealModal(false)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-6 space-y-4">
                                <div>
                                    <Label htmlFor="appeal-reason">Reason for Appeal *</Label>
                                    <Textarea
                                        id="appeal-reason"
                                        placeholder="Explain why you're appealing this transfer..."
                                        value={appealReason}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAppealReason(e.target.value)}
                                        className="mt-2 min-h-[120px]"
                                    />
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                        <strong>Note:</strong> Once appealed, an admin will review your case. The transfer will be on hold until resolved.
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-border px-6 py-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAppealModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAppeal}
                                    disabled={!appealReason.trim()}
                                    className="flex-1"
                                >
                                    Submit Appeal
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
