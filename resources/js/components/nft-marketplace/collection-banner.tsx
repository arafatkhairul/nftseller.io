import { useState } from 'react';
import { FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CollectionStats {
    floorPrice: { eth: number };
    items: number;
    totalVolume: { eth: number };
    listed: number; // percentage
}

interface Collection {
    id: string;
    title: string;
    creator: string;
    isVerified?: boolean;
    backgroundImage: string;
    stats: CollectionStats;
    featuredNFTs: Array<{
        id: string;
        image: string;
        name?: string;
    }>;
}

interface CollectionBannerProps {
    collections: Collection[];
    onCollectionChange?: (index: number) => void;
}

export default function CollectionBanner({
    collections,
    onCollectionChange
}: CollectionBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentCollection = collections[currentIndex];

    const handlePrevious = () => {
        const newIndex = currentIndex === 0 ? collections.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        onCollectionChange?.(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex === collections.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        onCollectionChange?.(newIndex);
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
        onCollectionChange?.(index);
    };

    if (!currentCollection) return null;

    return (
        <div className="relative w-full h-[500px] sm:h-[520px] md:h-[420px] lg:h-[450px] overflow-hidden rounded-xl sm:rounded-2xl vercel-card">
            {/* Background Image - Vercel Style */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${currentCollection.backgroundImage})` }}
            >
                {/* Vercel Clean Overlay - Stronger on mobile for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 md:from-black/80 md:via-black/40 md:to-black/20"></div>
            </div>

            {/* Vercel Navigation Arrows - Smaller and better positioned on mobile */}
            <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/70 hover:bg-black/90 rounded-lg sm:rounded-xl flex items-center justify-center text-white transition-all duration-200 z-20 border border-white/20"
                aria-label="Previous collection"
            >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/70 hover:bg-black/90 rounded-lg sm:rounded-xl flex items-center justify-center text-white transition-all duration-200 z-20 border border-white/20"
                aria-label="Next collection"
            >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Content Container - Optimized for mobile */}
            <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8">

                {/* Spacer for top */}
                <div className="flex-1"></div>

                {/* Collection Info - Optimized text sizes for mobile */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {currentCollection.title}
                        </h1>
                        {currentCollection.isVerified && (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium">
                        By {currentCollection.creator}
                    </p>
                </div>

                {/* Vercel Stats Container - Single column on mobile, 2 cols on small screens, 4 on desktop */}
                <div className="relative bg-black/70 md:bg-black/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/20">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                        {/* Floor Price */}
                        <div className="text-center xs:text-left">
                            <div className="text-[10px] sm:text-xs lg:text-sm text-white/70 font-semibold mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Floor Price
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.floorPrice.eth} ETH
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1">
                                ≈ ${(currentCollection.stats.floorPrice.eth * 2500).toLocaleString()}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="text-center xs:text-left">
                            <div className="text-[10px] sm:text-xs lg:text-sm text-white/70 font-semibold mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Items
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.items.toLocaleString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1">
                                Total Supply
                            </div>
                        </div>

                        {/* Total Volume */}
                        <div className="text-center xs:text-left">
                            <div className="text-[10px] sm:text-xs lg:text-sm text-white/70 font-semibold mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Total Volume
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.totalVolume.eth.toLocaleString()} ETH
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1">
                                All Time
                            </div>
                        </div>

                        {/* Listed */}
                        <div className="text-center xs:text-left">
                            <div className="text-[10px] sm:text-xs lg:text-sm text-white/70 font-semibold mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Listed
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.listed}%
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5 sm:mt-1">
                                {Math.floor(currentCollection.stats.items * currentCollection.stats.listed / 100)} Items
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vercel Pagination Dots - More prominent on mobile */}
            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-black/60 md:bg-black/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20">
                {collections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`transition-all duration-200 rounded-full ${index === currentIndex
                            ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white'
                            : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to collection ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
