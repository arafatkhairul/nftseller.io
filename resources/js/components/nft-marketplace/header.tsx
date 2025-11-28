import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { label: 'All', href: '#', active: true },
        { label: 'Gaming', href: '#', active: false },
        { label: 'Arts', href: '#', active: false },
        { label: 'Notes', href: '#', active: false },
        { label: 'Wise', href: '#', active: false },
    ];

    return (
        <header className="bg-background/80 backdrop-blur-md border-b border-border text-foreground sticky top-0 z-50 pro-header">
            {/* Top Header */}
            <div className="flex items-center justify-between px-4 py-3 lg:px-8">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img
                        src="/logo.png"
                        alt="NFTSeller Logo"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Login Button */}
                    <Button
                        onClick={onLoginClick}
                        className="hidden sm:flex pro-button !text-black border-none"
                    >
                        Login
                    </Button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2"
                    >
                        {isMenuOpen ? (
                            <FiX className="h-6 w-6" />
                        ) : (
                            <FiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`border-t border-border ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
                <div className="px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 py-4 lg:py-0">
                        {navigationItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`py-2 lg:py-4 px-2 text-sm font-medium transition-colors hover:text-primary ${item.active
                                    ? 'text-primary border-b-2 border-primary lg:border-b-2'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Expanded */}
            {isMenuOpen && (
                <div className="md:hidden px-4 pb-4 border-t border-border">
                    <Button
                        onClick={onLoginClick}
                        className="w-full mt-4 sm:hidden pro-button text-white border-none"
                    >
                        Login
                    </Button>
                </div>
            )}
        </header>
    );
}
