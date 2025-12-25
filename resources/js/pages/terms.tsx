import { Footer } from '@/components/footer';
import Header from '@/components/nft-marketplace/header';
import { Head, usePage } from '@inertiajs/react';

export default function Terms() {
    const page = usePage<{ auth?: { user?: any } }>();
    const user = page.props.auth?.user || null;

    return (
        <>
            <Head title="Terms & Conditions" />
            <div className="min-h-screen bg-background flex flex-col">
                <Header
                    user={user}
                    onLoginClick={() => window.location.href = '/login'}
                    categories={[]}
                    activeCategory="All"
                    onCategoryChange={() => { }}
                />

                <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-sm text-muted-foreground mb-8">Last updated: December 5, 2025</p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
                        <p className="mb-6">
                            Welcome to NFTSeller.IO. By accessing or using our website, you agree to be bound by these Terms and Conditions.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Accessing the Marketplace</h2>
                        <p className="mb-6">
                            You must be at least 18 years old to use our services. You are responsible for maintaining the security of your wallet and account.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Buying and Selling NFTs</h2>
                        <p className="mb-6">
                            NFTSeller.IO is a platform for buying and selling NFTs. We are not a broker, financial institution, or creditor.
                            You bear full responsibility for verifying the identity, legitimacy, and authenticity of assets you purchase.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Fees and Payments</h2>
                        <p className="mb-6">
                            Transactions on the blockchain may be subject to gas fees. We may also charge service fees for transactions on our marketplace.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
