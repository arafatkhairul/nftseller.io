import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiArrowLeft, FiClock, FiEye, FiHeart, FiLayers, FiShare2 } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { SiEthereum } from 'react-icons/si';
import { type NFTCardProps } from './nft-card';

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
    onLike?: (id: string) => void;
}

export default function NFTDetailsModal({ open, onOpenChange, nft, onPurchase, onLike }: NFTDetailsModalProps) {
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

    const getCurrencySymbol = (name?: string) => {
        if (!name) return 'ETH';
        if (name.toLowerCase().includes('polygon')) return 'MATIC';
        if (name.toLowerCase().includes('binance')) return 'BNB';
        if (name.toLowerCase().includes('solana')) return 'SOL';
        return 'ETH';
    };

    if (!nft) return null;

    const currencySymbol = getCurrencySymbol(nft.blockchain_data?.name);

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



    const selectedPaymentMethod = paymentMethods.find((m) => m.name === method);

    const formatTime = (total: number) => {
        const m = Math.floor(total / 60).toString().padStart(2, '0');
        const s = Math.floor(total % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: nft.name,
                    text: `Check out ${nft.name} on our marketplace!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // You might want to add a toast notification here
        }
    };


    const formatNumber = (num: number) => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    const getRarityColor = (rarity: string | undefined) => {
        const r = (rarity || 'Common').toLowerCase();
        if (r === 'legendary') return 'text-yellow-500';
        if (r === 'epic') return 'text-purple-500';
        if (r === 'rare') return 'text-blue-500';
        if (r === 'uncommon') return 'text-green-500';
        return 'text-gray-500';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                fullScreen
                className="p-0 gap-0 overflow-hidden bg-background flex flex-col md:flex-row [&>button]:hidden"
            >
                {/* Left Side - Image Section (Enhanced) */}
                <div className="relative w-full md:w-[50%] lg:w-[60%] h-[200px] md:h-auto bg-zinc-950 flex items-center justify-center p-3 md:p-8 overflow-hidden group shrink-0">
                    {/* Ambient Background Effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <img src={nft.image} alt="" className="w-full h-full object-cover blur-sm scale-110" />
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-950/20 to-zinc-950/60" />

                    {/* Main Image */}
                    <div className="relative z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 max-h-full md:h-auto flex items-center">
                        {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" /> */}
                        <img
                            src={nft.image}
                            alt={nft.name}
                            className="relative max-h-[180px] w-auto md:w-full md:h-auto md:max-h-none md:max-w-[500px] aspect-square object-cover rounded-lg md:rounded-2xl ring-white/10"
                        />
                    </div>

                    {/* Floating Actions */}
                    <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20">
                        {nft.blockchain_data ? (
                            <Badge variant="secondary" className="bg-black/40 backdrop-blur-xl border-white/10 text-white px-3 py-1.5 text-sm font-medium hover:bg-black/60 transition-colors flex items-center gap-2">
                                {nft.blockchain_data.logo ? (
                                    <img src={nft.blockchain_data.logo} alt={nft.blockchain_data.name} className="w-4 h-4 object-contain" />
                                ) : (
                                    <SiEthereum className="w-3.5 h-3.5 text-blue-400" />
                                )}
                                {nft.blockchain_data.name} Network
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-black/40 backdrop-blur-xl border-white/10 text-white px-3 py-1.5 text-sm font-medium hover:bg-black/60 transition-colors">
                                <SiEthereum className="w-3.5 h-3.5 mr-2 text-blue-400" /> Ethereum Network
                            </Badge>
                        )}
                    </div>

                    <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 z-20 flex gap-3">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
                            onClick={handleShare}
                        >
                            <FiShare2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Right Side - Content Section */}
                <div className="flex-1 flex flex-col bg-background/95 backdrop-blur-3xl max-h-screen md:h-full overflow-hidden relative border-l border-border/50">
                    {/* Decorative gradient blob */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {/* Header */}
                    <div className="px-4 md:px-8 py-4 md:py-6 border-b flex items-center justify-between bg-background/80 backdrop-blur-md z-10 sticky top-0 shrink-0">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground text-base md:text-lg tracking-tight">
                                {step === 1 ? 'NFT Details' : 'Checkout'}
                            </span>
                            {step === 2 && (
                                <>
                                    <span className="text-muted-foreground/40 text-lg">/</span>
                                    <span className="flex items-center gap-2 text-sm bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-medium animate-pulse">
                                        <FiClock className="w-3.5 h-3.5" /> {formatTime(countdown)}
                                    </span>
                                </>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted transition-colors" onClick={() => onOpenChange(false)}>
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-8">
                            {step === 1 ? (
                                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    {/* Title Section */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <h2 className="text-xl md:text-4xl font-bold tracking-tight text-foreground">{nft.name}</h2>
                                                {nft.artist && (
                                                    <div className="flex items-center gap-2 text-sm md:text-base mb-2">
                                                        <span className="text-muted-foreground">Created by</span>
                                                        <span className="font-medium text-foreground flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer">
                                                            {nft.artist.avatar ? (
                                                                <img src={nft.artist.avatar} alt={nft.artist.name} className="w-5 h-5 rounded-full object-cover" />
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                    {nft.artist.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            {nft.artist.name}
                                                            {nft.artist.is_verified && (
                                                                <MdVerified className="w-4 h-4 text-blue-500" />
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Card */}
                                    <div className="p-4 md:p-6 rounded-2xl border bg-card/50 hover:bg-card/80 transition-colors space-y-4 md:space-y-5 shadow-sm">
                                        <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Price</div>
                                        <div className="flex items-baseline gap-3 md:gap-4">
                                            <div className="text-xl md:text-4xl font-bold font-mono tracking-tight">{nft.price.eth} {currencySymbol}</div>
                                            <div className="text-sm md:text-xl text-muted-foreground font-medium">
                                                ${nft.price.usd.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                size="lg"
                                                className="w-full font-bold text-sm md:text-lg h-11 md:h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleBuy}
                                                disabled={!nft.quantity || nft.quantity <= 0}
                                            >
                                                {(!nft.quantity || nft.quantity <= 0) ? 'Sold Out' : 'Buy Now'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2 md:space-y-3">
                                        <div className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                                            Description
                                        </div>
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {nft.description || `This unique digital collectible is part of the ${nft.creator} collection. Verified on the blockchain, this NFT grants you exclusive ownership rights and access to community perks.`}
                                        </p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                                        <div className="p-3 md:p-4 rounded-xl border bg-card/50 text-center space-y-1">
                                            <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</div>
                                            <div className="text-base md:text-xl font-bold flex items-center justify-center gap-2">
                                                <FiEye className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-500" />
                                                {formatNumber(nft.views || 0)}
                                            </div>
                                        </div>
                                        <div
                                            className={`p-3 md:p-4 rounded-xl border bg-card/50 text-center space-y-1 cursor-pointer transition-colors ${nft.isLiked ? 'border-red-500/50 bg-red-500/10' : 'hover:bg-card/80'}`}
                                            onClick={() => onLike?.(nft.id)}
                                        >
                                            <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Likes</div>
                                            <div className={`text-base md:text-xl font-bold flex items-center justify-center gap-2 ${nft.isLiked ? 'text-red-500' : ''}`}>
                                                <FiHeart className={`w-3.5 md:w-4 h-3.5 md:h-4 ${nft.isLiked ? 'fill-current' : ''}`} />
                                                {formatNumber(nft.likes || 0)}
                                            </div>
                                        </div>
                                        <div className="p-3 md:p-4 rounded-xl border bg-card/50 text-center space-y-1">
                                            <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</div>
                                            <div className="text-base md:text-xl font-bold flex items-center justify-center gap-2">
                                                <FiLayers className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500" />
                                                {formatNumber(nft.quantity ?? 1)}
                                            </div>
                                        </div>
                                        <div className="p-3 md:p-4 rounded-xl border bg-card/50 text-center space-y-1">
                                            <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Rarity</div>
                                            <div className={`text-base md:text-xl font-bold flex items-center justify-center gap-2 ${getRarityColor(nft.rarity)}`}>
                                                <FiActivity className="w-3.5 md:w-4 h-3.5 md:h-4" />
                                                {nft.rarity || 'Common'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Traits Grid */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
                                            <FiActivity className="w-4 h-4" /> Properties
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                            {nft.properties && nft.properties.length > 0 ? (
                                                nft.properties.map((prop, i) => (
                                                    <div key={i} className="p-3 md:p-4 rounded-xl border bg-muted/30 hover:bg-muted/60 transition-all cursor-default group">
                                                        <div className="text-[10px] md:text-xs text-blue-500 font-bold uppercase tracking-wider mb-1.5 group-hover:text-blue-400">{prop.trait_type}</div>
                                                        <div className="font-semibold text-sm md:text-base text-foreground">{prop.value}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center text-muted-foreground italic py-4">
                                                    No properties added for this NFT.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <Button variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground hover:text-foreground" onClick={() => setStep(1)}>
                                        <FiArrowLeft className="w-4 h-4" /> Back to details
                                    </Button>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base md:text-lg font-semibold tracking-tight">Select Payment Method</h3>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Step 1 of 2</span>
                                        </div>

                                        {loadingMethods ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3 max-h-[240px] overflow-y-auto pr-1">
                                                {paymentMethods.map((pm) => (
                                                    <div
                                                        key={pm.id}
                                                        onClick={() => setMethod(pm.name)}
                                                        className={`
                                                            group relative flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200
                                                            ${method === pm.name
                                                                ? 'border-zinc-500 ring-1 ring-zinc-500 bg-zinc-500/10'
                                                                : 'border-border hover:border-zinc-500/50 hover:bg-muted/20'
                                                            }
                                                        `}
                                                    >
                                                        {/* Radio Indicator */}
                                                        <div className={`
                                                            h-5 w-5 rounded-full border flex items-center justify-center transition-colors
                                                            ${method === pm.name
                                                                ? 'border-foreground bg-foreground text-background'
                                                                : 'border-muted-foreground/30 group-hover:border-muted-foreground/60'
                                                            }
                                                        `}>
                                                            {method === pm.name && <div className="h-2 w-2 rounded-full bg-background" />}
                                                        </div>

                                                        {/* Icon/Logo */}
                                                        <div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center border border-border/50">
                                                            {pm.logo_path ? (
                                                                <img src={`/storage/${pm.logo_path}`} alt={pm.name} className="h-6 w-6 object-contain" />
                                                            ) : (
                                                                <span className="text-sm font-bold">{pm.name[0]}</span>
                                                            )}
                                                        </div>

                                                        {/* Text */}
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm text-foreground">{pm.name}</div>
                                                            {pm.description && <div className="text-xs text-muted-foreground mt-0.5">{pm.description}</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {selectedPaymentMethod && (
                                        <div className="space-y-6 pt-6 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="bg-muted/30 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5 border">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground font-medium">Total Amount</span>
                                                    <span className="font-mono font-bold text-base md:text-lg">{nft.price.eth} {currencySymbol}</span>
                                                </div>

                                                {selectedPaymentMethod.qr_code && (
                                                    <div className="space-y-4 pt-2">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Scan to Pay</div>
                                                        <div className="bg-white p-3 rounded-xl w-fit mx-auto shadow-sm" dangerouslySetInnerHTML={{ __html: selectedPaymentMethod.qr_code }} />
                                                    </div>
                                                )}

                                                {selectedPaymentMethod.wallet_address && (
                                                    <div className="space-y-2">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wallet Address</div>
                                                        <div className="font-mono text-xs bg-background border rounded-lg p-3 break-all text-center select-all">
                                                            {selectedPaymentMethod.wallet_address}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium">Transaction Hash</label>
                                                <div className="flex gap-3">
                                                    <Input
                                                        placeholder="Enter transaction hash (0x...)"
                                                        value={trxId}
                                                        onChange={(e) => setTrxId(e.target.value)}
                                                        className="font-mono text-sm h-11 md:h-12"
                                                    />
                                                    <Button variant="outline" className="h-11 md:h-12 px-4 md:px-6" onClick={async () => {
                                                        try {
                                                            const text = await navigator.clipboard.readText();
                                                            setTrxId(text);
                                                        } catch (e) { }
                                                    }}>Paste</Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Please enter the transaction hash after completing the payment.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Confirm Payment Button - Always visible in step 2 */}
                                    <div className="pt-6 pb-20">
                                        <Button
                                            className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                            onClick={handleConfirmPayment}
                                            disabled={isProcessing || !selectedPaymentMethod || trxId.length < 5}
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-5 w-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                                                    Processing Payment...
                                                </div>
                                            ) : (
                                                'Confirm Payment'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </DialogContent>
        </Dialog>
    );
}
