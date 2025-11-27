import { Button } from '@/components/ui/button';
import NFTCard, { type NFTCardProps } from './nft-card';
import NFTCardSkeleton from './nft-card-skeleton';

interface NFTGridProps {
    title?: string;
    nfts: Omit<NFTCardProps, 'onLike' | 'onView' | 'onPurchase'>[];
    showSeeAll?: boolean;
    onSeeAll?: () => void;
    onNFTLike?: (id: string) => void;
    onNFTView?: (id: string) => void;
    onNFTPurchase?: (id: string) => void;
    className?: string;
    gridCols?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    isLoading?: boolean;
}

export default function NFTGrid({
    title = "NFTS",
    nfts,
    showSeeAll = true,
    onSeeAll,
    onNFTLike,
    onNFTView,
    onNFTPurchase,
    className = "",
    gridCols = { sm: 1, md: 2, lg: 4, xl: 4 },
    isLoading = false
}: NFTGridProps) {
    // Fixed grid classes for 5 columns on desktop with minimal spacing
    const gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2";

    // Generate skeleton loaders (10 items by default)
    const skeletonCount = 10;

    return (
        <section className={`py-3 max-w-full ${className}`}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {title}
                </h2>
                {showSeeAll && !isLoading && (
                    <Button
                        variant="ghost"
                        onClick={onSeeAll}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted text-sm"
                    >
                        See all
                    </Button>
                )}
            </div>

            {/* NFT Grid */}
            {isLoading ? (
                <div className={`${gridClasses} w-full max-w-full`}>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <NFTCardSkeleton key={`skeleton-${index}`} />
                    ))}
                </div>
            ) : nfts.length > 0 ? (
                <div className={`${gridClasses} w-full max-w-full`}>
                    {nfts.map((nft) => (
                        <NFTCard
                            key={nft.id}
                            {...nft}
                            onLike={onNFTLike}
                            onView={onNFTView}
                            onPurchase={onNFTPurchase}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        No NFTs found
                    </div>
                    <p className="text-gray-400 text-sm">
                        Check back later for new collections
                    </p>
                </div>
            )}

            {/* Load More Button - Optional */}
            {nfts.length > 0 && nfts.length >= 8 && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="outline"
                        onClick={onSeeAll}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                    >
                        Load More NFTs
                    </Button>
                </div>
            )}
        </section>
    );
}
