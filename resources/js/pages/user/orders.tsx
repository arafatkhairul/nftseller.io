import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiPackage, FiClock, FiCheckCircle, FiX, FiSend, FiArrowRight, FiCheck, FiCopy, FiArrowLeft } from 'react-icons/fi';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import axios from 'axios';

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

interface PaymentMethod {
    id: number;
    name: string;
    icon: string;
    wallet_address: string;
}

interface Props {
    orders: Order[];
    paymentMethods: PaymentMethod[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Portfolio', href: '/orders' },
];

const statusConfig = {
    pending: { color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending' },
    completed: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: FiCheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Cancelled' },
    failed: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: FiX, label: 'Failed' },
    sent: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Sent (P2P)' },
};

const networks = ['TRC20', 'ERC20', 'BEP20', 'Polygon', 'Solana', 'Bitcoin'];

export default function UserOrders({ orders, paymentMethods }: Props) {
    const [p2pModalOpen, setP2pModalOpen] = useState(false);
    const [selectedOrderForP2p, setSelectedOrderForP2p] = useState<Order | null>(null);
    const [p2pStep, setP2pStep] = useState(1); // 1: Partner Details, 2: Your Details, 3: Link Generated

    // Step 1: Partner's payment details
    const [partnerAddress, setPartnerAddress] = useState('');
    const [partnerPaymentMethod, setPartnerPaymentMethod] = useState('');

    // Step 2: Your payment details
    const [yourAmount, setYourAmount] = useState('');
    const [yourAddress, setYourAddress] = useState('');
    const [yourNetwork, setYourNetwork] = useState('');

    // Step 3: Generated link
    const [generatedLink, setGeneratedLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

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
        setP2pStep(1);
        // Reset form
        setPartnerAddress('');
        setPartnerPaymentMethod('');
        setYourAmount(order.total_price);
        setYourAddress('');
        setYourNetwork('');
        setGeneratedLink('');
        setLinkCopied(false);
    };

    const closeP2pModal = () => {
        setP2pModalOpen(false);
        setSelectedOrderForP2p(null);
        setP2pStep(1);
    };

    const handleNextStep = async () => {
        if (p2pStep === 1 && partnerAddress && partnerPaymentMethod) {
            setP2pStep(2);
        } else if (p2pStep === 2 && yourAmount && yourAddress && yourNetwork && selectedOrderForP2p) {
            // Save to database and generate link using axios
            try {
                const response = await axios.post('/api/p2p-transfer/create', {
                    order_id: selectedOrderForP2p.id,
                    partner_address: partnerAddress,
                    partner_payment_method_id: partnerPaymentMethod,
                    amount: yourAmount,
                    sender_address: yourAddress,
                    network: yourNetwork,
                });

                if (response.data.success) {
                    setGeneratedLink(response.data.link);
                    setP2pStep(3);
                }
            } catch (error) {
                console.error('Error creating P2P transfer:', error);
            }
        }
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
                                <div key={order.id} className="group border border-border bg-card rounded-xl overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-200">
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

                                    {/* Action Buttons - Only for Completed Orders */}
                                    {order.status === 'completed' && (
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

                {/* P2P Send Modal - Multi-Step */}
                {p2pModalOpen && selectedOrderForP2p && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="border-b border-border px-6 py-4 sticky top-0 bg-card z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">P2P Send NFT</h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Step {p2pStep} of 3
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeP2pModal}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 flex gap-2">
                                    <div className={`h-1 flex-1 rounded-full ${p2pStep >= 1 ? 'bg-foreground' : 'bg-muted'}`} />
                                    <div className={`h-1 flex-1 rounded-full ${p2pStep >= 2 ? 'bg-foreground' : 'bg-muted'}`} />
                                    <div className={`h-1 flex-1 rounded-full ${p2pStep >= 3 ? 'bg-foreground' : 'bg-muted'}`} />
                                </div>
                            </div>

                            {/* NFT Info */}
                            <div className="px-6 pt-4">
                                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg border border-border">
                                    {selectedOrderForP2p.nft_image && (
                                        <img
                                            src={selectedOrderForP2p.nft_image}
                                            alt={selectedOrderForP2p.nft_name}
                                            className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {selectedOrderForP2p.nft_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedOrderForP2p.total_price} ETH
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content - Step 1: Partner's Payment Details */}
                            {p2pStep === 1 && (
                                <div className="px-6 py-6 space-y-5">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground mb-2">Partner's Payment Details</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Enter your P2P partner's payment information
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="partner-address" className="text-sm font-medium">
                                                Payment Address *
                                            </Label>
                                            <Input
                                                id="partner-address"
                                                placeholder="Enter wallet address"
                                                value={partnerAddress}
                                                onChange={(e) => setPartnerAddress(e.target.value)}
                                                className="mt-1.5"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="partner-method" className="text-sm font-medium">
                                                Payment Method *
                                            </Label>
                                            <select
                                                id="partner-method"
                                                value={partnerPaymentMethod}
                                                onChange={(e) => setPartnerPaymentMethod(e.target.value)}
                                                className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                            >
                                                <option value="">Select payment method</option>
                                                {paymentMethods.map((method) => (
                                                    <option key={method.id} value={method.id}>
                                                        {method.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content - Step 2: Your Payment Details */}
                            {p2pStep === 2 && (
                                <div className="px-6 py-6 space-y-5">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground mb-2">Your Payment Details</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Provide your payment information for the transfer
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="your-amount" className="text-sm font-medium">
                                                Amount *
                                            </Label>
                                            <Input
                                                id="your-amount"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={yourAmount}
                                                onChange={(e) => setYourAmount(e.target.value)}
                                                className="mt-1.5"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="your-address" className="text-sm font-medium">
                                                Your Payment Address *
                                            </Label>
                                            <Input
                                                id="your-address"
                                                placeholder="Enter your wallet address"
                                                value={yourAddress}
                                                onChange={(e) => setYourAddress(e.target.value)}
                                                className="mt-1.5"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="your-network" className="text-sm font-medium">
                                                Network *
                                            </Label>
                                            <select
                                                id="your-network"
                                                value={yourNetwork}
                                                onChange={(e) => setYourNetwork(e.target.value)}
                                                className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                            >
                                                <option value="">Select network</option>
                                                {networks.map((network) => (
                                                    <option key={network} value={network}>
                                                        {network}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content - Step 3: Generated Link */}
                            {p2pStep === 3 && (
                                <div className="px-6 py-6 space-y-5">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiCheck className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">Link Generated!</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Share this link with your P2P partner
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-4 bg-accent rounded-lg border border-border">
                                            <p className="text-xs text-muted-foreground mb-2">Transfer Link</p>
                                            <p className="text-xs font-mono text-foreground break-all">
                                                {generatedLink}
                                            </p>
                                        </div>

                                        <Button
                                            onClick={copyLink}
                                            variant="outline"
                                            className="w-full gap-2"
                                        >
                                            <FiCopy className="w-4 h-4" />
                                            {linkCopied ? 'Copied!' : 'Copy Link'}
                                        </Button>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                        <p className="text-xs text-blue-700 dark:text-blue-400">
                                            <strong>Note:</strong> Your partner can use this link to complete the P2P transfer. Make sure to verify all details before proceeding.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="border-t border-border px-6 py-4 flex gap-3 sticky bottom-0 bg-card">
                                {p2pStep > 1 && p2pStep < 3 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setP2pStep(p2pStep - 1)}
                                        className="gap-2"
                                    >
                                        <FiArrowLeft className="w-4 h-4" />
                                        Back
                                    </Button>
                                )}

                                {p2pStep < 3 ? (
                                    <Button
                                        onClick={handleNextStep}
                                        disabled={
                                            (p2pStep === 1 && (!partnerAddress || !partnerPaymentMethod)) ||
                                            (p2pStep === 2 && (!yourAmount || !yourAddress || !yourNetwork))
                                        }
                                        className="flex-1 gap-2"
                                    >
                                        Next
                                        <FiArrowRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleMarkAsSent(selectedOrderForP2p.id)}
                                        className="flex-1 gap-2"
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        Mark as Sent
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout >
    );
}
