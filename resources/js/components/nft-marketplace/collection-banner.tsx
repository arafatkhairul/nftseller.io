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
        <div className="relative w-full h-[380px] lg:h-[450px] overflow-hidden rounded-xl">
            {/* Background Image with Enhanced Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${currentCollection.backgroundImage})` }}
            >
                {/* Minimal Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
                <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
            </div>

            {/* Enhanced Navigation Arrows */}
            <button
                onClick={handlePrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20 border border-white/20"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20 border border-white/20"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-6">

                {/* Enhanced Featured NFTs - Top Right */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 flex space-x-2">
                    {currentCollection.featuredNFTs.slice(0, 3).map((nft, index) => (
                        <div
                            key={nft.id}
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden border border-white/30 backdrop-blur-sm bg-white/5 hover:scale-105 transition-all duration-300 hover:border-white/50"
                        >
                            <img
                                src={nft.image}
                                alt={nft.name || `NFT ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Enhanced Collection Info - Centered */}
                <div className="mb-5 text-center lg:text-left lg:ml-16">
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                        <h1 className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg">
                            {currentCollection.title}
                        </h1>
                        {currentCollection.isVerified && (
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <FiCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <p className="text-base lg:text-lg text-white/90 font-medium drop-shadow">
                        By {currentCollection.creator}
                    </p>
                </div>

                {/* Pro-Level Enhanced Stats Container */}
                <div className="relative bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-2xl p-5 lg:p-6 border border-white/30 shadow-2xl">
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"></div>

                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Enhanced Floor Price */}
                        <div className="text-center lg:text-left">
                            <div className="text-xs lg:text-sm text-white/80 font-semibold mb-2 uppercase tracking-widest">
                                FLOOR PRICE
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                                {currentCollection.stats.floorPrice.eth} ETH
                            </div>
                            <div className="text-xs text-emerald-400 font-medium mt-1">
                                ≈ ${(currentCollection.stats.floorPrice.eth * 2500).toLocaleString()}
                            </div>
                        </div>

                        {/* Enhanced Items */}
                        <div className="text-center lg:text-left">
                            <div className="text-xs lg:text-sm text-white/80 font-semibold mb-2 uppercase tracking-widest">
                                ITEMS
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                                {currentCollection.stats.items.toLocaleString()}
                            </div>
                            <div className="text-xs text-blue-400 font-medium mt-1">
                                Total Supply
                            </div>
                        </div>

                        {/* Enhanced Total Volume */}
                        <div className="text-center lg:text-left">
                            <div className="text-xs lg:text-sm text-white/80 font-semibold mb-2 uppercase tracking-widest">
                                TOTAL VOLUME
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                                {currentCollection.stats.totalVolume.eth.toLocaleString()} ETH
                            </div>
                            <div className="text-xs text-purple-400 font-medium mt-1">
                                All Time
                            </div>
                        </div>

                        {/* Enhanced Listed */}
                        <div className="text-center lg:text-left">
                            <div className="text-xs lg:text-sm text-white/80 font-semibold mb-2 uppercase tracking-widest">
                                LISTED
                            </div>
                            <div className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                                {currentCollection.stats.listed}%
                            </div>
                            <div className="text-xs text-orange-400 font-medium mt-1">
                                {Math.floor(currentCollection.stats.items * currentCollection.stats.listed / 100)} Items
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro-Level Enhanced Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                {collections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`transition-all duration-300 rounded-full shadow-lg ${
                            index === currentIndex
                                ? 'w-8 h-2.5 bg-white shadow-white/30'
                                : 'w-2.5 h-2.5 bg-white/60 hover:bg-white/80 hover:scale-110'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
