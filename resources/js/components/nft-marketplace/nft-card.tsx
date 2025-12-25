import { Card, CardContent } from '@/components/ui/card';
import { FiEye, FiShoppingCart } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';

export interface NFTCardProps {
    id: string;
    name: string;
    description?: string;
    image: string;
    price: {
        eth: number;
        usd: number;
    };
    creator?: string;
    artist?: {
        name: string;
        avatar?: string;
        is_verified: boolean;
    };
    blockchain_data?: {
        id: number;
        name: string;
        logo: string | null;
    };
    likes?: number;
    views?: number;
    rarity?: string;
    category?: string;
    quantity?: number;
    properties?: { trait_type: string; value: string }[];
    isLiked?: boolean;
    onView?: (id: string) => void;
    onPurchase?: (id: string) => void;
    className?: string;
}

export default function NFTCard({
    id,
    name,
    image,
    price,
    creator,
    blockchain_data,
    onView,
    onPurchase,
    className = ""
}: NFTCardProps) {
    const getCurrencySymbol = (name?: string) => {
        if (!name) return 'ETH';
        if (name.toLowerCase().includes('polygon')) return 'MATIC';
        if (name.toLowerCase().includes('binance')) return 'BNB';
        if (name.toLowerCase().includes('solana')) return 'SOL';
        return 'ETH';
    };

    const symbol = getCurrencySymbol(blockchain_data?.name);
    const handleView = () => {
        onView?.(id);
    };

    const handlePurchase = () => {
        onPurchase?.(id);
    };

    return (
        <Card
            onClick={handleView}
            className={`group vercel-card relative overflow-hidden rounded-2xl border transition-all duration-200 p-0 cursor-pointer ${className}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(`
                            <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#1e293b"/>
                                        <stop offset="100%" style="stop-color:#0f172a"/>
                                    </linearGradient>
                                </defs>
                                <rect width="300" height="300" fill="url(#bg)"/>
                                <text x="150" y="140" text-anchor="middle" dy=".3em" fill="#e2e8f0" font-family="Inter, Arial" font-size="16" font-weight="600">
                                    ${name}
                                </text>
                                <text x="150" y="165" text-anchor="middle" dy=".3em" fill="#64748b" font-family="Inter, Arial" font-size="12">
                                    Premium NFT Collection
                                </text>
                            </svg>
                        `)}`;
                    }}
                />

            </div>

            {/* Content - Vercel Style */}
            <CardContent className="p-4 space-y-3">
                {/* NFT Name */}
                <div>
                    <h3 className="font-semibold text-base truncate">
                        {name}
                    </h3>
                    {creator && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                            by {creator}
                        </p>
                    )}
                </div>

                {/* Price Section */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-1.5">
                            {blockchain_data?.logo ? (
                                <img src={blockchain_data.logo} alt={blockchain_data.name} className="w-4 h-4 object-contain" />
                            ) : (
                                <SiEthereum className="w-4 h-4 text-foreground" />
                            )}
                            <span className="text-lg font-bold">
                                {price.eth}
                            </span>
                            <span className="text-xs text-muted-foreground">{symbol}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ${price.usd.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Vercel Style */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView();
                        }}
                        className="flex-1 py-2 px-3 bg-accent hover:bg-accent/80 text-foreground rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView();
                        }}
                        className="flex-1 py-2 px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FiShoppingCart className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
