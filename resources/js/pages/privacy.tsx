import { Footer } from '@/components/footer';
import Header from '@/components/nft-marketplace/header';
import { Head, usePage } from '@inertiajs/react';

export default function Privacy() {
    const page = usePage<{ auth?: { user?: any } }>();
    const user = page.props.auth?.user || null;

    return (
        <>
            <Head title="Privacy Policy" />
            <div className="min-h-screen bg-background flex flex-col">
                <Header
                    user={user}
                    onLoginClick={() => window.location.href = '/login'}
                    categories={[]}
                    activeCategory="All"
                    onCategoryChange={() => { }}
                />

                <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-sm text-muted-foreground mb-8">Last updated: December 5, 2025</p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                        <p className="mb-6">
                            We collect information you provide directly to us, such as when you create an account, connect your wallet, or communicate with us.
                            This may include your username, email address, and wallet address.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-6">
                            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing of Information</h2>
                        <p className="mb-6">
                            We do not share your personal information with third parties except as described in this policy or with your consent.
                            Public blockchain data is visible to anyone.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
                        <p className="mb-6">
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
