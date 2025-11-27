import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { SiEthereum } from 'react-icons/si';
import { FiHeart, FiEye, FiShoppingCart, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { type NFTCardProps } from './nft-card';
import { router } from '@inertiajs/react';

interface PaymentMethodOption {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    logo_path: string | null;
    wallet_address: string | null;
    qr_code: string | null;
    is_active: boolean;
    sort_order: number;
}

export interface NFTDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nft?: Omit<NFTCardProps, 'onLike' | 'onView' | 'onPurchase' | 'className'> | null;
    onPurchase?: (id: string) => void;
}

export default function NFTDetailsModal({ open, onOpenChange, nft, onPurchase }: NFTDetailsModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [method, setMethod] = useState<string>('');
    const [trxId, setTrxId] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(15 * 60);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
    const [loadingMethods, setLoadingMethods] = useState(false);

    // Load payment methods from backend
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            setLoadingMethods(true);
            try {
                const response = await fetch('/admin/payment-methods/active');
                if (response.ok) {
                    const data = await response.json();
                    setPaymentMethods(data);
                    if (data.length > 0) {
                        setMethod(data[0].name);
                    }
                }
            } catch (error) {
                console.error('Failed to load payment methods:', error);
            } finally {
                setLoadingMethods(false);
            }
        };

        if (open) {
            fetchPaymentMethods();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setStep(1);
            setTrxId("");
            setCountdown(15 * 60);
        }
    }, [open]);

    // Start countdown when entering step 2
    useEffect(() => {
        if (step !== 2) return;
        const id = setInterval(() => {
            setCountdown((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [step]);

    const priceHype = useMemo(() => {
        if (!nft) return '0';
        return (nft.price.eth * 1000).toFixed(0);
    }, [nft]);

    if (!nft) return null;

    const handleBuy = () => {
        setStep(2);
    };

    const handleConfirmPayment = () => {
        setIsProcessing(true);

        const orderData = {
            nft_id: parseInt(nft.id),
            total_price: nft.price.eth,
            quantity: 1,
            payment_method: method,
            transaction_id: trxId || null,
        };

        router.post('/orders', orderData, {
            onSuccess: () => {
                setIsProcessing(false);
                onOpenChange(false);
            },
            onError: (errors) => {
                console.error('Order submission error:', errors);
                setIsProcessing(false);
                alert('Error placing order. Please try again.');
            },
        });
    };

    const traits = [
        { label: 'Background', value: 'Oceanic' },
        { label: 'Accessory', value: 'Goggles' },
        { label: 'Suit', value: 'Explorer' },
        { label: 'Mood', value: 'Chill' },
    ];

    const selectedPaymentMethod = paymentMethods.find((m) => m.name === method);

    const formatTime = (total: number) => {
        const m = Math.floor(total / 60).toString().padStart(2, '0');
        const s = Math.floor(total % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent fullScreen className="overflow-hidden bg-card flex flex-col">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border/70 bg-gradient-to-b from-background/60 to-background/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">#{nft.id.padStart(4, '0')}</Badge>
                        <Badge>Rare</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><FiHeart className="w-4 h-4" /> {nft.likes ?? 0}</div>
                        <div className="flex items-center gap-1"><FiEye className="w-4 h-4" /> {nft.views ?? 0}</div>
                    </div>
                </div>

                {/* Stepper */}
                <div className="px-6 py-3 border-b border-sidebar-border/70">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${step === 1 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'text-muted-foreground border border-transparent'}`}>
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${step === 1 ? 'bg-blue-500 text-white' : 'bg-muted text-foreground/70'}`}>1</span>
                            <span>Details</span>
                        </div>
                        <div className="h-px flex-1 bg-sidebar-border/70" />
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${step === 2 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'text-muted-foreground border border-transparent'}`}>
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${step === 2 ? 'bg-blue-500 text-white' : 'bg-muted text-foreground/70'}`}>2</span>
                            <span>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {step === 1 ? (
                        // STEP 1: DETAILS
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex items-center justify-center">
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="rounded-xl object-cover w-full h-full max-h-full shadow-xl"
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
                            </div>

                            <div className="p-6 space-y-5">
                                <DialogHeader className="space-y-1">
                                    <DialogTitle className="text-2xl font-semibold tracking-tight">
                                        {nft.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Minted by {nft.creator ?? 'Unknown'} • Secure marketplace trade
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {(nft.creator ?? 'NA').slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <div className="font-medium">{nft.creator ?? 'Hypurr Collection'}</div>
                                        <div className="text-muted-foreground">Verified Collection</div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-sidebar-border/70 p-4">
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-end gap-3">
                                            <div>
                                                <div className="text-3xl font-bold leading-none">
                                                    {priceHype}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-semibold">HYPE</div>
                                            </div>
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-inner">
                                                <SiEthereum className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-sm text-emerald-500 font-medium">
                                            ≈ ${nft.price.usd.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-sm font-medium">Properties</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {traits.map((t) => (
                                            <div key={t.label} className="rounded-md border border-sidebar-border/70 p-3">
                                                <div className="text-xs text-muted-foreground">{t.label}</div>
                                                <div className="text-sm font-medium">{t.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    Verified collection item. Ownership transfers immediately on purchase. All sales are final.
                                </div>

                                <DialogFooter className="gap-2 pt-1">
                                    <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
                                    <Button onClick={handleBuy} className="gap-2">
                                        <FiShoppingCart className="w-4 h-4" /> Buy Now
                                    </Button>
                                </DialogFooter>
                            </div>
                        </div>
                    ) : (
                        // STEP 2: PAYMENT
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                            <div className="lg:col-span-2 border-r border-sidebar-border/70 p-6 space-y-3">
                                <div className="text-lg font-semibold">Select Payment Method</div>
                                {loadingMethods ? (
                                    <div className="text-sm text-muted-foreground">Loading payment methods...</div>
                                ) : paymentMethods.length > 0 ? (
                                    <div className="space-y-2">
                                        {paymentMethods.map((pm) => (
                                            <button
                                                key={pm.id}
                                                onClick={() => setMethod(pm.name)}
                                                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${method === pm.name
                                                    ? 'border-blue-500/40 bg-blue-500/10'
                                                    : 'border-sidebar-border/70 hover:bg-muted/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {pm.logo_path && (
                                                            <img
                                                                src={`/storage/${pm.logo_path}`}
                                                                alt={pm.name}
                                                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-medium">{pm.name}</div>
                                                            {pm.description && (
                                                                <div className="text-xs text-muted-foreground truncate">{pm.description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {method === pm.name && <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No payment methods available</div>
                                )}

                                <div className="pt-4">
                                    <Button variant="ghost" className="gap-2" onClick={() => setStep(1)}>
                                        <FiArrowLeft className="w-4 h-4" /> Back to Details
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-3 p-6 space-y-5 overflow-y-auto">
                                <DialogHeader className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-2xl font-semibold tracking-tight">
                                            Checkout
                                        </DialogTitle>
                                        <div className="rounded-full border border-sidebar-border/70 px-3 py-1 text-sm font-medium flex items-center gap-2">
                                            <span className="text-muted-foreground">Time left</span>
                                            <span className={`tabular-nums ${countdown <= 60 ? 'text-red-500' : 'text-foreground'}`}>{formatTime(countdown)}</span>
                                        </div>
                                    </div>
                                    <DialogDescription>
                                        You are purchasing <span className="font-medium text-foreground">{nft.name}</span>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="rounded-xl border border-sidebar-border/70 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-muted-foreground">Total</div>
                                            <div className="text-xl font-semibold">{priceHype} HYPE</div>
                                        </div>
                                        <div className="text-sm text-emerald-500 font-medium">
                                            ≈ ${nft.price.usd.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {selectedPaymentMethod ? (
                                    <div className="rounded-xl border border-sidebar-border/70 p-4 space-y-4">
                                        {/* Payment method header with logo */}
                                        <div className="flex items-center gap-3">
                                            {selectedPaymentMethod.logo_path && (
                                                <img
                                                    src={`/storage/${selectedPaymentMethod.logo_path}`}
                                                    alt={selectedPaymentMethod.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium">{selectedPaymentMethod.name}</div>
                                                {selectedPaymentMethod.description && (
                                                    <div className="text-xs text-muted-foreground">{selectedPaymentMethod.description}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <div className="text-muted-foreground mb-1">Amount (ETH)</div>
                                                <div className="rounded-md border border-sidebar-border/70 px-3 py-2 font-medium">
                                                    {nft.price.eth.toFixed(4)} ETH
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground mb-1">Amount (USD)</div>
                                                <div className="rounded-md border border-sidebar-border/70 px-3 py-2 font-medium">
                                                    ${nft.price.usd.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* QR Code and Wallet Address */}
                                        {selectedPaymentMethod.qr_code && selectedPaymentMethod.wallet_address && (
                                            <div className="space-y-3">
                                                <div className="text-sm font-medium">Send to this address</div>
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-lg border border-sidebar-border/70 p-2 bg-background flex-shrink-0">
                                                        <div dangerouslySetInnerHTML={{ __html: selectedPaymentMethod.qr_code }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-xs">
                                                        <div className="text-muted-foreground mb-2 font-medium">Wallet Address:</div>
                                                        <div className="break-all font-mono text-foreground bg-muted p-2 rounded">
                                                            {selectedPaymentMethod.wallet_address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction ID */}
                                        <div className="grid gap-2">
                                            <div className="text-sm font-medium">Transaction ID</div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={trxId}
                                                    onChange={(e) => setTrxId(e.target.value)}
                                                    placeholder="Enter your transaction hash"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    variant="secondary"
                                                    onClick={async () => {
                                                        try {
                                                            const txt = await navigator.clipboard.readText();
                                                            setTrxId(txt);
                                                        } catch { }
                                                    }}
                                                >
                                                    Paste
                                                </Button>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Enter your transaction hash for payment verification.</div>
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Your order will be confirmed after payment verification. Network fees may apply.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-sidebar-border/70 p-4 text-center text-muted-foreground">
                                        Please select a payment method
                                    </div>
                                )}

                                <DialogFooter className="gap-2 pt-1">
                                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
                                    <Button
                                        className="gap-2"
                                        onClick={handleConfirmPayment}
                                        disabled={isProcessing || !selectedPaymentMethod || trxId.trim().length < 8}
                                    >
                                        {isProcessing ? 'Processing...' : 'Confirm Payment'}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
