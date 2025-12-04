import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FiHome, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface HeaderProps {
    user?: User | null;
    onLoginClick?: () => void;
    categories?: Category[];
    activeCategory?: string;
    onCategoryChange?: (category: string) => void;
}

export default function Header({
    user,
    onLoginClick,
    categories = [],
    activeCategory = 'All',
    onCategoryChange
}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDashboard = () => {
        router.visit('/dashboard');
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleCategoryClick = (categoryName: string) => {
        if (onCategoryChange) {
            onCategoryChange(categoryName);
        }
    };

    return (
        <header className="bg-background/80 backdrop-blur-md border-b border-border text-foreground sticky top-0 z-50 pro-header">
            {/* Top Header */}
            <div className="flex items-center justify-between px-4 py-3 lg:px-8">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img
                        src="/logo.png"
                        alt="NFTSeller Logo"
                        className="h-8 w-auto object-contain"
                    />
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        /* User Dropdown Menu */
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-accent transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="hidden sm:block font-medium">{user.name}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
                                    <FiHome className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                    <FiLogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        /* Login Button */
                        <Button
                            onClick={onLoginClick}
                            className="hidden sm:flex pro-button !text-black border-none"
                        >
                            Login
                        </Button>
                    )}

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
                        <button
                            onClick={() => handleCategoryClick('All')}
                            className={`py-2 lg:py-4 px-2 text-sm font-medium transition-colors hover:text-primary text-left ${activeCategory === 'All'
                                ? 'text-primary border-b-2 border-primary lg:border-b-2'
                                : 'text-muted-foreground'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`py-2 lg:py-4 px-2 text-sm font-medium transition-colors hover:text-primary text-left ${activeCategory === category.name
                                    ? 'text-primary border-b-2 border-primary lg:border-b-2'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Expanded */}
            {isMenuOpen && (
                <div className="md:hidden px-4 pb-4 border-t border-border">
                    {user ? (
                        <div className="space-y-2 mt-4">
                            <Button
                                onClick={handleDashboard}
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <FiHome className="h-4 w-4" />
                                Dashboard
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                            >
                                <FiLogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={onLoginClick}
                            className="w-full mt-4 sm:hidden pro-button !text-black border-none"
                        >
                            Login
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
}
