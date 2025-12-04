import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiArrowLeft, FiArrowRight, FiCheck, FiCheckCircle, FiClock, FiCopy, FiPackage, FiSend, FiX } from 'react-icons/fi';

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
    active_p2p_transfer: {
        id: number;
        transfer_code: string;
        partner_address: string;
        partner_payment_method_id: number;
        amount: string;
        network: string;
        status: string;
        link: string;
    } | null;
}

interface PaymentMethod {
    id: number;
    name: string;
    icon: string;
    wallet_address: string;
}

interface Network {
    id: number;
    name: string;
    currency_symbol: string;
}

interface Props {
    orders: Order[];
    paymentMethods: PaymentMethod[];
    networks: Network[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Portfolio', href: '/orders' },
];

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent' },
    appealed: { color: 'bg-orange-500/10 text-orange-700 border-orange-200', icon: FiAlertTriangle, label: 'Appealed' },
    appeal_approved: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Approved' },
    appeal_rejected: { color: 'bg-red-900/10 text-red-900 border-red-500/50', icon: FiX, label: 'Restricted' },
    pending_sent: { color: 'bg-purple-500/10 text-purple-700 border-purple-200', icon: FiClock, label: 'Pending Verification' },
    sent_rejected: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Sent Rejected' },
};

export default function UserOrders({ orders, paymentMethods, networks }: Props) {
    // P2P Modal State
    const [p2pModalOpen, setP2pModalOpen] = useState(false);
    const [selectedOrderForP2p, setSelectedOrderForP2p] = useState<Order | null>(null);
    const [p2pStep, setP2pStep] = useState(1);
    const [partnerAddress, setPartnerAddress] = useState('');
    const [partnerPaymentMethod, setPartnerPaymentMethod] = useState('');
    const [yourAmount, setYourAmount] = useState('');
    const [yourAddress, setYourAddress] = useState('');
    const [yourNetwork, setYourNetwork] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [transferId, setTransferId] = useState<number | null>(null);
    const [transferStatus, setTransferStatus] = useState('pending');
    const [showAppealInput, setShowAppealInput] = useState(false);
    const [appealReason, setAppealReason] = useState('');

    // Manual Sent Modal State
    const [manualSentModalOpen, setManualSentModalOpen] = useState(false);
    const [selectedOrderForManual, setSelectedOrderForManual] = useState<Order | null>(null);
    const [manualSentAddress, setManualSentAddress] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const selectedNetworkObj = networks.find(n => n.name === yourNetwork);
    const currencySymbol = selectedNetworkObj ? selectedNetworkObj.currency_symbol : 'ETH';

    // Polling for status updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (p2pModalOpen && transferId && p2pStep === 3) {
            interval = setInterval(async () => {
                try {
                    const response = await axios.get(`/api/p2p-transfer/${transferId}/status`);
                    if (response.data.status !== transferStatus) {
                        setTransferStatus(response.data.status);
                    }
                } catch (error) {
                    console.error('Error polling status:', error);
                }
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [p2pModalOpen, transferId, p2pStep, transferStatus]);

    const handleMarkAsSent = (orderId: number) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: 'sent' }, {
            onSuccess: () => {
                closeP2pModal();
            }
        });
    };

    const openP2pModal = (order: Order) => {
        setSelectedOrderForP2p(order);
        setP2pModalOpen(true);

        if (order.active_p2p_transfer) {
            // Resume active transfer
            const transfer = order.active_p2p_transfer;
            setP2pStep(3);
            setPartnerAddress(transfer.partner_address);
            setPartnerPaymentMethod(transfer.partner_payment_method_id.toString());
            setYourAmount(transfer.amount);
            setYourNetwork(transfer.network);
            setGeneratedLink(transfer.link);
            setTransferId(transfer.id);
            setTransferStatus(transfer.status);
            setLinkCopied(false);
            setShowAppealInput(false);
            setAppealReason('');
        } else {
            // Start new
            setP2pStep(1);
            setPartnerAddress('');
            setPartnerPaymentMethod('');
            setYourAmount(order.total_price);
            setYourAddress('');
            setYourNetwork('');
            setGeneratedLink('');
            setLinkCopied(false);
            setTransferId(null);
            setTransferStatus('pending');
            setShowAppealInput(false);
            setAppealReason('');
        }
    };

    const closeP2pModal = () => {
        setP2pModalOpen(false);
        setSelectedOrderForP2p(null);
        setP2pStep(1);
    };

    // Manual Sent Functions
    const openManualSentModal = (order: Order) => {
        setSelectedOrderForManual(order);
        setManualSentAddress('');
        setIsVerifying(false);
        setManualSentModalOpen(true);
    };

    const closeManualSentModal = () => {
        setManualSentModalOpen(false);
        setSelectedOrderForManual(null);
        setManualSentAddress('');
        setIsVerifying(false);
    };

    const submitManualSent = () => {
        if (!selectedOrderForManual || !manualSentAddress) return;

        setIsVerifying(true);

        // Simulate verification delay
        setTimeout(() => {
            router.post(route('orders.sent-request', selectedOrderForManual.id), {
                sender_address: manualSentAddress
            }, {
                onSuccess: () => {
                    closeManualSentModal();
                },
                onError: () => {
                    setIsVerifying(false);
                }
            });
        }, 3000); // 3 seconds delay for animation
    };

    const handleNextStep = async () => {
        if (p2pStep === 1 && partnerAddress && partnerPaymentMethod) {
            setP2pStep(2);
        } else if (p2pStep === 2 && yourAmount && yourNetwork && selectedOrderForP2p) {
            // Save to database and generate link using axios
            try {
                const response = await axios.post('/api/p2p-transfer/create', {
                    order_id: selectedOrderForP2p.id,
                    partner_address: partnerAddress,
                    partner_payment_method_id: partnerPaymentMethod,
                    amount: yourAmount,
                    sender_address: '', // Removed from UI
                    network: yourNetwork,
                });

                if (response.data.success) {
                    setGeneratedLink(response.data.link);
                    setTransferId(response.data.transfer_id);
                    setTransferStatus('pending');
                    setP2pStep(3);
                }
            } catch (error) {
                console.error('Error creating P2P transfer:', error);
            }
        }
    };

    const handleReleaseTransfer = () => {
        if (!transferId) return;

        router.post(`/p2p-transfer/${transferId}/release`, {}, {
            onSuccess: () => {
                setTransferStatus('released');
                // Optionally close modal or show success state
            }
        });
    };

    const handleAppealTransfer = () => {
        if (!transferId || !appealReason) return;

        router.post(`/p2p-transfer/${transferId}/appeal`, {
            reason: appealReason
        }, {
            onSuccess: () => {
                setTransferStatus('appealed');
                setShowAppealInput(false);
            }
        });
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
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

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-2">
                        {orders.map((order) => {
                            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                            const StatusIcon = config.icon;

                            return (
                                <div key={order.id} className={`group border border-border bg-card rounded-xl overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-200 ${order.status === 'appeal_rejected' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                    <Link href={`/orders/${order.id}`}>
                                        <div className="cursor-pointer">
                                            <div className="p-4">
                                                <div className="flex items-start gap-4">
                                                    {/* NFT Image */}
                                                    {order.nft_image && (
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                src={order.nft_image}
                                                                alt={order.nft_name}
                                                                className="w-20 h-20 rounded-lg object-cover border border-border"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 space-y-3">
                                                        {/* Header Row */}
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="text-base font-semibold text-foreground truncate mb-1">
                                                                    {order.nft_name}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground font-mono">
                                                                    {order.order_number}
                                                                </p>
                                                            </div>
                                                            <Badge className={`${config.color} flex items-center gap-1.5 whitespace-nowrap`}>
                                                                <StatusIcon className="w-3.5 h-3.5" />
                                                                <span className="text-xs font-medium">{config.label}</span>
                                                            </Badge>
                                                        </div>

                                                        {/* Details Grid */}
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                                                <p className="font-semibold text-foreground">{order.total_price} ETH</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Payment</p>
                                                                <p className="font-medium text-foreground capitalize">{order.payment_method}</p>
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            <span>{order.created_at_diff}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Action Buttons - For Completed or Appeal Approved Orders */}
                                    {(order.status === 'completed' || order.status === 'appeal_approved') && (
                                        <div className="px-4 pb-4 flex gap-2 justify-end border-t border-border pt-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs gap-1.5 px-3"
                                                onClick={() => openP2pModal(order)}
                                            >
                                                <FiSend className="w-3 h-3" />
                                                P2P Sent
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 text-xs gap-1.5 px-3"
                                                onClick={() => openManualSentModal(order)}
                                            >
                                                <FiCheck className="w-3 h-3" />
                                                Sent
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="border-b border-border px-6 py-5 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground tracking-tight">P2P Send NFT</h2>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                                            Step {p2pStep} of 3
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeP2pModal}
                                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-5 flex gap-2">
                                    {[1, 2, 3].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step <= p2pStep ? 'bg-primary' : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* NFT Info */}
                                <div className="px-6 pt-6">
                                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                                        {selectedOrderForP2p.nft_image && (
                                            <img
                                                src={selectedOrderForP2p.nft_image}
                                                alt={selectedOrderForP2p.nft_name}
                                                className="w-16 h-16 rounded-xl object-cover border border-border/50 shadow-sm flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-foreground truncate">
                                                {selectedOrderForP2p.nft_name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs font-normal bg-background border-border/50">
                                                    {selectedOrderForP2p.total_price} ETH
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">#{selectedOrderForP2p.order_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content - Step 1: Partner's Payment Details */}
                                {p2pStep === 1 && (
                                    <div className="px-6 py-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">Partner's Payment Details</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Enter the destination details for this transfer.
                                            </p>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="partner-address" className="text-sm font-medium">
                                                    NFT Payment Address <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="partner-address"
                                                    placeholder="0x..."
                                                    value={partnerAddress}
                                                    onChange={(e) => setPartnerAddress(e.target.value)}
                                                    className="h-11 font-mono text-sm"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="partner-method" className="text-sm font-medium">
                                                    Payment Method <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <select
                                                        id="partner-method"
                                                        value={partnerPaymentMethod}
                                                        onChange={(e) => setPartnerPaymentMethod(e.target.value)}
                                                        className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    >
                                                        <option value="">Select payment method</option>
                                                        {paymentMethods.map((method) => (
                                                            <option key={method.id} value={method.id}>
                                                                {method.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Content - Step 2: Your Payment Details */}
                                {p2pStep === 2 && (
                                    <div className="px-6 py-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">Transfer Details</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Confirm the amount and network for this transaction.
                                            </p>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="your-network" className="text-sm font-medium">
                                                    Network <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <select
                                                        id="your-network"
                                                        value={yourNetwork}
                                                        onChange={(e) => setYourNetwork(e.target.value)}
                                                        className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    >
                                                        <option value="">Select network</option>
                                                        {networks.map((network) => (
                                                            <option key={network.id} value={network.name}>
                                                                {network.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="your-amount" className="text-sm font-medium">
                                                    Amount ({currencySymbol}) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="your-amount"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={yourAmount}
                                                    onChange={(e) => setYourAmount(e.target.value)}
                                                    className="h-11 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Content - Step 3: Generated Link & Status Polling */}
                                {p2pStep === 3 && (
                                    <div className="px-6 py-8 space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        {/* Status: Pending (Link Generated) */}
                                        {transferStatus === 'pending' && (
                                            <>
                                                <div className="text-center space-y-3">
                                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                                                        <FiCheck className="w-10 h-10 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-foreground">Link Generated!</h3>
                                                        <p className="text-muted-foreground mt-1">
                                                            Waiting for partner to complete payment...
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="p-5 bg-muted/30 rounded-xl border border-border/50 group relative">
                                                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Transfer Link</p>
                                                        <p className="text-sm font-mono text-foreground break-all pr-8">
                                                            {generatedLink}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        onClick={copyLink}
                                                        variant={linkCopied ? "default" : "outline"}
                                                        className="w-full h-12 gap-2 transition-all duration-300"
                                                    >
                                                        {linkCopied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                                                        {linkCopied ? 'Copied to Clipboard' : 'Copy Secure Link'}
                                                    </Button>
                                                </div>

                                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3 items-start">
                                                    <div className="mt-0.5 text-blue-600">
                                                        <div className="animate-pulse w-2 h-2 rounded-full bg-blue-600"></div>
                                                    </div>
                                                    <p className="text-sm text-blue-600/90 leading-relaxed">
                                                        Share this link with your partner. This window will update automatically when they complete the payment.
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {/* Status: Payment Completed (Action Required) */}
                                        {transferStatus === 'payment_completed' && (
                                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                                <div className="text-center space-y-3">
                                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                                                        <FiCheckCircle className="w-10 h-10 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-foreground">Payment Received!</h3>
                                                        <p className="text-muted-foreground mt-1">
                                                            Partner has marked the payment as completed.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Amount</span>
                                                        <span className="font-medium">{selectedOrderForP2p.total_price} ETH</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Status</span>
                                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                                            <FiCheckCircle className="w-3 h-3" /> Completed
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button
                                                        onClick={handleReleaseTransfer}
                                                        className="h-12 gap-2"
                                                        variant="default"
                                                    >
                                                        <FiCheck className="w-5 h-5" />
                                                        Release Now
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setShowAppealInput(true);
                                                        }}
                                                        variant="outline"
                                                        className="h-12 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <FiAlertTriangle className="w-5 h-5" />
                                                        Appeal
                                                    </Button>
                                                </div>

                                                {showAppealInput && (
                                                    <div className="mt-4 p-5 border border-border rounded-xl bg-card shadow-sm animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-start gap-3 mb-4">
                                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                                                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-foreground">Submit an Appeal</h4>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Please provide details about the issue. Our support team will review your case and mediate the dispute.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="appeal-reason" className="text-sm font-medium">
                                                                    Reason for Appeal <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Textarea
                                                                    id="appeal-reason"
                                                                    autoFocus
                                                                    value={appealReason}
                                                                    onChange={(e) => setAppealReason(e.target.value)}
                                                                    placeholder="Describe the issue in detail (e.g., payment not received, wrong amount, etc.)..."
                                                                    className="min-h-[120px] resize-none focus-visible:ring-red-500/20"
                                                                />
                                                            </div>

                                                            <div className="flex items-center justify-end gap-3 pt-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    onClick={() => setShowAppealInput(false)}
                                                                    className="hover:bg-muted"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    onClick={handleAppealTransfer}
                                                                    disabled={!appealReason.trim()}
                                                                    className="gap-2 shadow-sm"
                                                                >
                                                                    Submit Appeal
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Status: Released */}
                                        {transferStatus === 'released' && (
                                            <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
                                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                                                    <FiCheckCircle className="w-10 h-10 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-foreground">Transfer Complete!</h3>
                                                    <p className="text-muted-foreground mt-1">
                                                        Asset has been released to the partner.
                                                    </p>
                                                </div>
                                                <Button onClick={closeP2pModal} className="w-full">
                                                    Close
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {p2pStep < 3 && (
                                <div className="border-t border-border px-6 py-5 bg-muted/30 flex gap-3 sticky bottom-0">
                                    {p2pStep > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setP2pStep(p2pStep - 1)}
                                            className="h-11 px-6 gap-2 hover:bg-background"
                                        >
                                            <FiArrowLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleNextStep}
                                        disabled={
                                            (p2pStep === 1 && (!partnerAddress || !partnerPaymentMethod)) ||
                                            (p2pStep === 2 && (!yourAmount || !yourNetwork))
                                        }
                                        className="flex-1 h-11 gap-2 text-base font-medium shadow-lg shadow-primary/20"
                                    >
                                        Next Step
                                        <FiArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Manual Sent Modal */}
                {manualSentModalOpen && selectedOrderForManual && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="border-b border-border px-6 py-5 bg-muted/30 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-foreground tracking-tight">Send NFT</h2>
                                <button
                                    onClick={closeManualSentModal}
                                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                {isVerifying ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in duration-500">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-spin border-t-primary"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FiPackage className="w-8 h-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-semibold">Verifying Blockchain Network...</h3>
                                            <p className="text-sm text-muted-foreground">Please wait while we verify your transaction details.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="manual-address">Your NFT Address</Label>
                                            <Input
                                                id="manual-address"
                                                placeholder="Enter your wallet address"
                                                value={manualSentAddress}
                                                onChange={(e) => setManualSentAddress(e.target.value)}
                                                className="h-11 font-mono"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                onClick={closeManualSentModal}
                                                className="flex-1 h-11"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={submitManualSent}
                                                disabled={!manualSentAddress}
                                                className="flex-1 h-11"
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout >
    );
}
