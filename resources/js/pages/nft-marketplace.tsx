import { Head } from '@inertiajs/react';
import Header from '@/components/nft-marketplace/header';
import HeroBanner from '@/components/nft-marketplace/hero-banner';
import CollectionBanner from '@/components/nft-marketplace/collection-banner';
import NFTGrid from '@/components/nft-marketplace/nft-grid';
import { type NFTCardProps } from '@/components/nft-marketplace/nft-card';
import NFTDetailsModal from '@/components/nft-marketplace/nft-details-modal';
import { router } from '@inertiajs/react';
import { useState } from 'react';

// Sample NFT data using real OpenSea image
const realNFTImage = 'https://i2.seadn.io/hyperevm/0x9125e2d6827a00b0f8330d6ef7bef07730bac685/a95969c6d8d235c4459ed84d1067dd/7da95969c6d8d235c4459ed84d1067dd.png?w=350';

// Multiple collections data
const collectionsData = [
    {
        id: "good-vibes-club",
        title: "Good Vibes Club",
        creator: "GVC_Official",
        isVerified: true,
        backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
        stats: {
            floorPrice: { eth: 0.592 },
            items: 6968,
            totalVolume: { eth: 8975.61 },
            listed: 9.5
        },
        featuredNFTs: [
            { id: "featured-1", image: realNFTImage, name: "Good Vibes #1234" },
            { id: "featured-2", image: realNFTImage, name: "Good Vibes #5678" },
            { id: "featured-3", image: realNFTImage, name: "Good Vibes #9012" }
        ]
    },
    {
        id: "crypto-punks",
        title: "CryptoPunks",
        creator: "LarvaLabs",
        isVerified: true,
        backgroundImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        stats: {
            floorPrice: { eth: 45.2 },
            items: 10000,
            totalVolume: { eth: 954821.73 },
            listed: 1.2
        },
        featuredNFTs: [
            { id: "punk-1", image: realNFTImage, name: "CryptoPunk #7804" },
            { id: "punk-2", image: realNFTImage, name: "CryptoPunk #3100" },
            { id: "punk-3", image: realNFTImage, name: "CryptoPunk #5822" }
        ]
    },
    {
        id: "bored-apes",
        title: "Bored Ape Yacht Club",
        creator: "Yuga Labs",
        isVerified: true,
        backgroundImage: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        stats: {
            floorPrice: { eth: 12.8 },
            items: 10000,
            totalVolume: { eth: 673420.12 },
            listed: 2.8
        },
        featuredNFTs: [
            { id: "ape-1", image: realNFTImage, name: "Bored Ape #8817" },
            { id: "ape-2", image: realNFTImage, name: "Bored Ape #2087" },
            { id: "ape-3", image: realNFTImage, name: "Bored Ape #5014" }
        ]
    },
    {
        id: "azuki",
        title: "Azuki",
        creator: "Chiru Labs",
        isVerified: true,
        backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        stats: {
            floorPrice: { eth: 3.45 },
            items: 10000,
            totalVolume: { eth: 298765.89 },
            listed: 4.1
        },
        featuredNFTs: [
            { id: "azuki-1", image: realNFTImage, name: "Azuki #9605" },
            { id: "azuki-2", image: realNFTImage, name: "Azuki #4521" },
            { id: "azuki-3", image: realNFTImage, name: "Azuki #7832" }
        ]
    },
    {
        id: "doodles",
        title: "Doodles",
        creator: "Doodles LLC",
        isVerified: true,
        backgroundImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        stats: {
            floorPrice: { eth: 2.1 },
            items: 10000,
            totalVolume: { eth: 145632.44 },
            listed: 6.7
        },
        featuredNFTs: [
            { id: "doodle-1", image: realNFTImage, name: "Doodle #6914" },
            { id: "doodle-2", image: realNFTImage, name: "Doodle #2847" },
            { id: "doodle-3", image: realNFTImage, name: "Doodle #8193" }
        ]
    }
];

const sampleNFTs: Omit<NFTCardProps, 'onLike' | 'onView' | 'onPurchase'>[] = [
    {
        id: '1',
        name: 'Hypurr #2633',
        image: realNFTImage,
        price: { eth: 1.620, usd: 4050 },
        creator: 'Hypurr Collection',
        likes: 24,
        views: 156,
        isLiked: false
    },
    {
        id: '2',
        name: 'Hypurr #2634',
        image: realNFTImage,
        price: { eth: 1.450, usd: 3625 },
        creator: 'Hypurr Collection',
        likes: 18,
        views: 203,
        isLiked: true
    },
    {
        id: '3',
        name: 'Hypurr #2635',
        image: realNFTImage,
        price: { eth: 1.780, usd: 4450 },
        creator: 'Hypurr Collection',
        likes: 31,
        views: 89,
        isLiked: false
    },
    {
        id: '4',
        name: 'Hypurr #2636',
        image: realNFTImage,
        price: { eth: 1.520, usd: 3800 },
        creator: 'Hypurr Collection',
        likes: 42,
        views: 267,
        isLiked: false
    },
    {
        id: '5',
        name: 'Hypurr #2637',
        image: realNFTImage,
        price: { eth: 1.690, usd: 4225 },
        creator: 'Hypurr Collection',
        likes: 15,
        views: 134,
        isLiked: false
    },
    {
        id: '6',
        name: 'Hypurr #2638',
        image: realNFTImage,
        price: { eth: 1.380, usd: 3450 },
        creator: 'Hypurr Collection',
        likes: 28,
        views: 198,
        isLiked: true
    },
    {
        id: '7',
        name: 'Hypurr #2639',
        image: realNFTImage,
        price: { eth: 1.850, usd: 4625 },
        creator: 'Hypurr Collection',
        likes: 37,
        views: 245,
        isLiked: false
    },
    {
        id: '8',
        name: 'Hypurr #2640',
        image: realNFTImage,
        price: { eth: 1.720, usd: 4300 },
        creator: 'Hypurr Collection',
        likes: 52,
        views: 312,
        isLiked: false
    },
    {
        id: '9',
        name: 'Hypurr #2641',
        image: realNFTImage,
        price: { eth: 1.590, usd: 3975 },
        creator: 'Hypurr Collection',
        likes: 38,
        views: 189,
        isLiked: true
    },
    {
        id: '10',
        name: 'Hypurr #2642',
        image: realNFTImage,
        price: { eth: 1.820, usd: 4550 },
        creator: 'Hypurr Collection',
        likes: 67,
        views: 298,
        isLiked: false
    }
];


export default function NFTMarketplace() {
    const handleLogin = () => {
        // Navigate to login page
        window.location.href = '/login';
    };

    const handleHeroBannerClick = () => {
        console.log('Hero banner clicked - Navigate to Sonic Racing collection');
    };

    const handleSeeAll = () => {
        console.log('See all NFTs clicked');
    };

    const handleNFTLike = (id: string) => {
        console.log(`NFT ${id} liked`);
    };

    const [selectedNFT, setSelectedNFT] = useState<typeof sampleNFTs[number] | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleNFTView = (id: string) => {
        const nft = sampleNFTs.find((n) => n.id === id) || null;
        setSelectedNFT(nft);
        setDetailsOpen(true);
    };

    const handleNFTPurchase = (id: string) => {
        setDetailsOpen(false);
        router.visit('/order-confirmation');
    };

    return (
        <>
            <Head title="NFT Marketplace - NFTSELLER.IO">
                <meta name="description" content="Discover, collect, and sell extraordinary NFTs on the world's first and largest NFT marketplace." />
            </Head>

            <div className="min-h-screen bg-background bg-animated">
                {/* Header */}
                <Header onLoginClick={handleLogin} />

                {/* Main Container */}
                <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-6">
                    {/* Enhanced Collection Banner */}
                    <div className="w-full mb-12">
                        <CollectionBanner
                            collections={collectionsData}
                            onCollectionChange={(index) => console.log(`Collection changed to: ${collectionsData[index].title}`)}
                        />
                    </div>

                    {/* NFT Grid */}
                    <div className="w-full">
                        <NFTGrid
                            title="NFTS"
                            nfts={sampleNFTs}
                            showSeeAll={true}
                            onSeeAll={handleSeeAll}
                            onNFTLike={handleNFTLike}
                            onNFTView={handleNFTView}
                            onNFTPurchase={handleNFTPurchase}
                        />
                    </div>

                    {/* Footer Space */}
                    <div className="h-8"></div>
                </div>
            </div>

            {/* Details Modal */}
            <NFTDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                nft={selectedNFT}
                onPurchase={handleNFTPurchase}
            />
        </>
    );
}
