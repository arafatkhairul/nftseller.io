import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';
import { useState } from 'react';

export interface NFTCardProps {
    id: string;
    name: string;
    image: string;
    price: {
        eth: number;
        usd: number;
    };
    creator?: string;
    likes?: number;
    views?: number;
    isLiked?: boolean;
    onLike?: (id: string) => void;
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
    likes = 0,
    views = 0,
    isLiked = false,
    onLike,
    onView,
    onPurchase,
    className = ""
}: NFTCardProps) {
    const [liked, setLiked] = useState(isLiked);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
        onLike?.(id);
    };

    const handleView = () => {
        onView?.(id);
    };

    const handlePurchase = () => {
        onPurchase?.(id);
    };

    return (
        <Card className={`group relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-700/30 hover:border-blue-500/40 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 ${className}`}>
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none rounded-2xl"></div>

            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
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

                {/* Compact Ranking Badge */}
                <div className="absolute top-3 left-3">
                    <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-lg rounded-full px-2.5 py-1 border border-white/10">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-white font-medium">#{id.padStart(4, '0')}</span>
                    </div>
                </div>

                {/* Compact Like Button */}
                <button
                    onClick={handleLike}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-lg border transition-all duration-300 hover:scale-105 ${
                        liked
                            ? 'bg-red-500/80 border-red-400/40 text-white shadow-lg shadow-red-500/20'
                            : 'bg-black/40 border-white/15 text-slate-300 hover:bg-black/60 hover:text-white'
                    }`}
                >
                    <FiHeart
                        className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`}
                    />
                </button>

                {/* Compact Rarity Indicator */}
                <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500/70 to-pink-500/70 backdrop-blur-lg rounded-full px-2 py-0.5">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <span className="text-xs text-white font-medium">Rare</span>
                    </div>
                </div>

                {/* Compact View Count */}
                <div className="absolute bottom-3 right-3">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-lg rounded-full px-2 py-0.5">
                        <FiEye className="w-3 h-3 text-slate-300" />
                        <span className="text-xs text-slate-300 font-medium">{views}</span>
                    </div>
                </div>
            </div>

            {/* Minimal Glass Content */}
            <CardContent className="relative p-3 bg-slate-900/70 backdrop-blur-xl">
                {/* Glass Effect for Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-white/[0.08] pointer-events-none rounded-b-2xl"></div>

                {/* Minimal NFT Name and Ranking */}
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base truncate">
                            {name}
                        </h3>
                        {creator && (
                            <p className="text-xs text-slate-400 truncate">
                                by <span className="text-blue-400 font-medium">{creator}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                        <div className="w-2 h-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-sm"></div>
                        <span className="text-xs font-semibold">#{Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                </div>

                {/* Minimal Price Section */}
                <div className="relative z-10 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-white">
                                {(price.eth * 1000).toFixed(0)}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">HYPE</span>
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <SiEthereum className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <div className="text-xs text-emerald-400 font-medium">
                            ≈ ${price.usd.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-500">Last sale</span>
                        <span className="text-slate-300 font-medium">{(price.eth * 900).toFixed(0)} HYPE</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">24h change</span>
                        <span className="text-emerald-400 font-medium flex items-center">
                            +{(Math.random() * 15 + 2).toFixed(1)}%
                            <svg className="w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Minimal Glass Action Buttons */}
                <div className="relative z-10 flex space-x-2 mb-2">
                    <button
                        onClick={handleView}
                        className="flex-1 py-1.5 px-2 bg-slate-800/40 backdrop-blur-md text-slate-300 rounded-md hover:bg-slate-700/50 hover:text-white text-xs font-medium border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                        <FiEye className="w-2.5 h-2.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={handlePurchase}
                        className="flex-1 py-1.5 px-2 bg-blue-600/40 backdrop-blur-md text-blue-200 rounded-md hover:bg-blue-500/50 hover:text-white text-xs font-medium transition-all duration-300 flex items-center justify-center space-x-1 border border-blue-500/20 hover:border-blue-400/30"
                    >
                        <FiShoppingCart className="w-2.5 h-2.5" />
                        <span>Buy</span>
                    </button>
                </div>

                {/* Minimal Engagement Stats */}
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-700/30">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                            <FiHeart className="w-2.5 h-2.5" />
                            <span>{likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FiEye className="w-2.5 h-2.5" />
                            <span>{views}</span>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">
                        2d ago
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
