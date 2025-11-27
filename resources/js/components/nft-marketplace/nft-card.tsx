import { Card, CardContent } from '@/components/ui/card';
import { FiEye, FiShoppingCart } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';

export interface NFTCardProps {
    id: string;
    name: string;
    image: string;
    price: {
        eth: number;
        usd: number;
    };
    creator?: string;
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
    onView,
    onPurchase,
    className = ""
}: NFTCardProps) {
    const handleView = () => {
        onView?.(id);
    };

    const handlePurchase = () => {
        onPurchase?.(id);
    };

    return (
        <Card className={`group vercel-card relative overflow-hidden rounded-2xl border transition-all duration-200 p-0 ${className}`}>
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
                            <SiEthereum className="w-4 h-4 text-foreground" />
                            <span className="text-lg font-bold">
                                {price.eth}
                            </span>
                            <span className="text-xs text-muted-foreground">ETH</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            ${price.usd.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Vercel Style */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleView}
                        className="flex-1 py-2 px-3 bg-accent hover:bg-accent/80 text-foreground rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={handlePurchase}
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
