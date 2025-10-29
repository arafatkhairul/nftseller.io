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
import { QRCodeCanvas } from 'qrcode.react';
import { SiEthereum, SiBitcoin, SiTether } from 'react-icons/si';
import { FaLink } from 'react-icons/fa';
import { FiHeart, FiEye, FiShoppingCart, FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { type NFTCardProps } from './nft-card';

export interface NFTDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nft?: Omit<NFTCardProps, 'onLike' | 'onView' | 'onPurchase' | 'className'> | null;
    onPurchase?: (id: string) => void;
}

export default function NFTDetailsModal({ open, onOpenChange, nft, onPurchase }: NFTDetailsModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [method, setMethod] = useState<'USDT-TRC20' | 'BTC' | 'USDT-ERC20'>('USDT-TRC20');
    const [trxId, setTrxId] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(15 * 60); // 15 minutes

    useEffect(() => {
        if (open) {
            setStep(1);
            setCopiedKey(null);
            setMethod('USDT-TRC20');
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

    // Always call hooks in the same order: compute price even if nft is not yet provided
    const priceHype = useMemo(() => {
        if (!nft) return '0';
        return (nft.price.eth * 1000).toFixed(0);
    }, [nft]);

    if (!nft) return null;

    const handleBuy = () => {
        setStep(2);
    };

    const traits = [
        { label: 'Background', value: 'Oceanic' },
        { label: 'Accessory', value: 'Goggles' },
        { label: 'Suit', value: 'Explorer' },
        { label: 'Mood', value: 'Chill' },
    ];

    const paymentOptions: Array<{
        key: 'USDT-TRC20' | 'BTC' | 'USDT-ERC20';
        label: string;
        sub?: string;
        icon: React.ReactNode;
        address: string; // demo
    }> = [
            {
                key: 'USDT-TRC20',
                label: 'USDT',
                sub: 'TRC20 (TRON)',
                icon: <FaLink className="w-4 h-4 text-red-500" />,
                address: 'TQ5YgC3P9Yp1xv8m7qF9a2VZQ2q9b1c9dZ',
            },
            {
                key: 'BTC',
                label: 'BTC',
                sub: 'Bitcoin',
                icon: <SiBitcoin className="w-4 h-4 text-orange-400" />,
                address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            },
            {
                key: 'USDT-ERC20',
                label: 'USDT',
                sub: 'ERC20 (Ethereum)',
                icon: <SiTether className="w-4 h-4 text-emerald-500" />,
                address: '0xB79b16d2Fd3C5E7C1e92b9cF1A7d0Aa6C9E0a000',
            },
        ];

    const selectedOption = paymentOptions.find((p) => p.key === method)!;

    const copyValue = async (value: string, key: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        } catch (e) {
            // ignore
        }
    };

    const formatTime = (total: number) => {
        const m = Math.floor(total / 60)
            .toString()
            .padStart(2, '0');
        const s = Math.floor(total % 60)
            .toString()
            .padStart(2, '0');
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

                {/* Stepper / Wizard */}
                <div className="px-6 py-3 border-b border-sidebar-border/70">
                    <div className="flex items-center gap-3">
                        {/* Step 1 */}
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${step === 1 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'text-muted-foreground border border-transparent'}`}>
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${step === 1 ? 'bg-blue-500 text-white' : 'bg-muted text-foreground/70'}`}>1</span>
                            <span>Details</span>
                        </div>
                        <div className="h-px flex-1 bg-sidebar-border/70" />
                        {/* Step 2 */}
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
                            {/* Left: Image */}
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex items-center justify-center">
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="rounded-xl object-cover w-full h-full max-h-full shadow-xl"
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
                            </div>

                            {/* Right: Details */}
                            <div className="p-6 space-y-5">
                                <DialogHeader className="space-y-1">
                                    <DialogTitle className="text-2xl font-semibold tracking-tight">
                                        {nft.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Minted by {nft.creator ?? 'Unknown'} • Secure marketplace trade
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Creator */}
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

                                {/* Price */}
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
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center justify-between"><span>Last sale</span><span className="text-foreground font-medium">{(nft.price.eth * 900).toFixed(0)} HYPE</span></div>
                                        <div className="flex items-center justify-between"><span>24h change</span><span className="text-emerald-500 font-medium">+{(Math.random() * 15 + 2).toFixed(1)}%</span></div>
                                    </div>
                                </div>

                                {/* Traits */}
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

                                {/* Description */}
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    Verified collection item. Ownership transfers immediately on purchase. Gas and platform fee are calculated at checkout. All sales are final.
                                </div>

                                {/* CTAs */}
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
                            {/* Payment methods */}
                            <div className="lg:col-span-2 border-r border-sidebar-border/70 p-6 space-y-3">
                                <div className="text-lg font-semibold">Select Payment Method</div>
                                <div className="space-y-2">
                                    {paymentOptions.map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setMethod(opt.key)}
                                            className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${method === opt.key
                                                ? 'border-blue-500/40 bg-blue-500/10'
                                                : 'border-sidebar-border/70 hover:bg-muted/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {opt.icon}
                                                    <div className="font-medium">{opt.label}</div>
                                                    {opt.sub && (
                                                        <div className="text-xs text-muted-foreground">{opt.sub}</div>
                                                    )}
                                                </div>
                                                {method === opt.key && <FiCheck className="w-4 h-4 text-blue-500" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <Button variant="ghost" className="gap-2" onClick={() => setStep(1)}>
                                        <FiArrowLeft className="w-4 h-4" /> Back to Details
                                    </Button>
                                </div>
                            </div>

                            {/* Payment summary */}
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

                                {/* Price recap */}
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

                                {/* Address, QR & amount */
                                }
                                <div className="rounded-xl border border-sidebar-border/70 p-4 space-y-4">
                                    <div className="text-sm font-medium">Send payment to this address</div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="rounded-md border border-sidebar-border/70 px-3 py-2 flex-1 truncate">
                                            {selectedOption.address}
                                        </div>
                                        <Button
                                            variant="secondary"
                                            className="gap-2"
                                            onClick={() => copyValue(selectedOption.address, 'addr')}
                                        >
                                            <FiCopy className="w-4 h-4" />
                                            {copiedKey === 'addr' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>

                                    {/* QR Code */}
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg border border-sidebar-border/70 p-3 bg-background">
                                            <QRCodeCanvas value={selectedOption.address} size={144} level="M" includeMargin className="rounded-md" />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Scan this QR with your wallet app to auto-fill the address. Double-check network matches the selected method to avoid loss of funds.
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground mb-1">Network</div>
                                            <div className="rounded-md border border-sidebar-border/70 px-3 py-2 inline-flex items-center gap-2">
                                                {selectedOption.icon}
                                                <span className="font-medium">{selectedOption.sub ?? selectedOption.label}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1">Amount (USD approx)</div>
                                            <div className="rounded-md border border-sidebar-border/70 px-3 py-2 font-medium">
                                                ${nft.price.usd.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* TRX ID input for manual confirmation */}
                                    {method === 'USDT-TRC20' && (
                                        <div className="grid gap-2">
                                            <div className="text-sm font-medium">TRX Transaction ID</div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={trxId}
                                                    onChange={(e) => setTrxId(e.target.value)}
                                                    placeholder="Enter your TRX transaction hash"
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
                                            <div className="text-xs text-muted-foreground">We will verify this ID to confirm your payment manually. Ensure you paste the exact transaction hash.</div>
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        Note: After sending the exact amount, your order will be confirmed automatically. Network fees apply.
                                    </div>
                                </div>

                                <DialogFooter className="gap-2 pt-1">
                                    <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                                    <Button className="gap-2" onClick={() => onPurchase?.(nft.id)} disabled={method === 'USDT-TRC20' && trxId.trim().length < 8}>
                                        Confirm Payment
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
