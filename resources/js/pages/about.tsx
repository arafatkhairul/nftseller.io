import { Footer } from '@/components/footer';
import Header from '@/components/nft-marketplace/header';
import { Head, usePage } from '@inertiajs/react';

export default function About() {
    const page = usePage<{ auth?: { user?: any } }>();
    const user = page.props.auth?.user || null;

    return (
        <>
            <Head title="About Us" />
            <div className="min-h-screen bg-background flex flex-col">
                <Header
                    user={user}
                    onLoginClick={() => window.location.href = '/login'}
                    categories={[]}
                    activeCategory="All"
                    onCategoryChange={() => { }}
                />

                <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">About NFTSeller.IO</h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg mb-6">
                            NFTSeller.IO is the world's first and largest web3 marketplace for NFTs and crypto collectibles.
                            Browse, create, buy, sell, and auction NFTs using OpenSea today.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
                        <p className="mb-6">
                            We are building the tools that allow consumers to trade their items freely,
                            creators to launch new digital works, and developers to build rich, integrated marketplaces for their digital items.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">The Future of Digital Assets</h2>
                        <p className="mb-6">
                            We believe that the future of the web is decentralized. We are passionate about building
                            a platform that empowers creators and collectors to participate in this new digital economy.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
