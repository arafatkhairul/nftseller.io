import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';

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
        <div className="relative w-full h-[380px] lg:h-[450px] overflow-hidden rounded-2xl vercel-card">
            {/* Background Image - Vercel Style */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${currentCollection.backgroundImage})` }}
            >
                {/* Vercel Clean Overlay - No blur */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>

            {/* Vercel Navigation Arrows */}
            <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-xl flex items-center justify-center text-white transition-all duration-200 z-20 border border-white/10"
                aria-label="Previous collection"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-xl flex items-center justify-center text-white transition-all duration-200 z-20 border border-white/10"
                aria-label="Next collection"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>

            {/* Content Container - Vercel Style */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8">

                {/* Featured NFTs - Top Right - Vercel Style */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex gap-2">
                    {currentCollection.featuredNFTs.slice(0, 3).map((nft, index) => (
                        <div
                            key={nft.id}
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden border border-white/20 bg-black/20 hover:scale-105 hover:border-white/40 transition-all duration-200"
                        >
                            <img
                                src={nft.image}
                                alt={nft.name || `NFT ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Collection Info - Vercel Style */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl lg:text-5xl font-bold text-white">
                            {currentCollection.title}
                        </h1>
                        {currentCollection.isVerified && (
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <p className="text-base lg:text-lg text-white/90 font-medium">
                        By {currentCollection.creator}
                    </p>
                </div>

                {/* Vercel Stats Container */}
                <div className="relative bg-black/60 rounded-2xl p-6 lg:p-8 border border-white/10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Floor Price */}
                        <div>
                            <div className="text-xs lg:text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">
                                Floor Price
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.floorPrice.eth} ETH
                            </div>
                            <div className="text-xs text-white/60 font-medium mt-1">
                                ≈ ${(currentCollection.stats.floorPrice.eth * 2500).toLocaleString()}
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <div className="text-xs lg:text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">
                                Items
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.items.toLocaleString()}
                            </div>
                            <div className="text-xs text-white/60 font-medium mt-1">
                                Total Supply
                            </div>
                        </div>

                        {/* Total Volume */}
                        <div>
                            <div className="text-xs lg:text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">
                                Total Volume
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.totalVolume.eth.toLocaleString()} ETH
                            </div>
                            <div className="text-xs text-white/60 font-medium mt-1">
                                All Time
                            </div>
                        </div>

                        {/* Listed */}
                        <div>
                            <div className="text-xs lg:text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">
                                Listed
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white">
                                {currentCollection.stats.listed}%
                            </div>
                            <div className="text-xs text-white/60 font-medium mt-1">
                                {Math.floor(currentCollection.stats.items * currentCollection.stats.listed / 100)} Items
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vercel Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 rounded-full px-4 py-2 border border-white/10">
                {collections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`transition-all duration-200 rounded-full ${
                            index === currentIndex
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to collection ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
