import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    FaDiscord,
    FaFacebook,
    FaGithub,
    FaGlobe,
    FaInstagram,
    FaLinkedin,
    FaTelegram,
    FaTiktok,
    FaTwitter,
    FaYoutube
} from 'react-icons/fa';
import AppLogo from './app-logo';

const iconMap: Record<string, any> = {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaDiscord,
    FaTelegram,
    FaTiktok,
    FaGithub,
    FaGlobe
};

export function Footer() {
    const { socialLinks } = usePage<SharedData>().props;

    return (
        <footer className="bg-background border-t border-border mt-auto">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <AppLogo className="h-9" />
                        <p className="text-sm leading-6 text-muted-foreground max-w-xs">
                            Discover, collect, and sell extraordinary NFTs. The world's first and largest NFT marketplace.
                        </p>
                        <div className="flex space-x-6">
                            {socialLinks.map((link) => {
                                const Icon = iconMap[link.icon] || FaGlobe;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <span className="sr-only">{link.platform}</span>
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Marketplace</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['All NFTs', 'Art', 'Gaming', 'Memberships', 'PFPs'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">My Account</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['Profile', 'Favorites', 'Watchlist', 'My Collections', 'Settings'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Resources</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['Help Center', 'Partners', 'Blog', 'Newsletter', 'Taxes'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['About', 'Careers', 'Ventures', 'Grants'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-muted-foreground">
                        &copy; {new Date().getFullYear()} NFTSeller.io, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
