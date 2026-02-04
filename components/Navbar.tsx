import React from 'react';
import { Clapperboard, Menu, X } from 'lucide-react';

interface NavbarProps {
    currentPage: 'home' | 'app';
    onNavigate: (page: 'home' | 'app') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => onNavigate('home')}
                >
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center transform -rotate-3 transition-transform group-hover:rotate-0">
                        <Clapperboard className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Thumbnail<span className="text-red-500">Pro</span> AI</h1>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => onNavigate('home')}
                        className={`text-sm font-medium transition-colors hover:text-red-500 ${currentPage === 'home' ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => onNavigate('app')}
                        className={`text-sm font-medium transition-colors hover:text-red-500 ${currentPage === 'app' ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                        Generator
                    </button>

                    <button
                        onClick={() => onNavigate('app')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all"
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-zinc-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <button
                        onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
                        className={`text-left text-lg font-medium ${currentPage === 'home' ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => { onNavigate('app'); setIsMenuOpen(false); }}
                        className={`text-left text-lg font-medium ${currentPage === 'app' ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                        Generator
                    </button>
                    <button
                        onClick={() => { onNavigate('app'); setIsMenuOpen(false); }}
                        className="w-full py-3 bg-red-600 text-white rounded-xl font-bold mt-2"
                    >
                        Get Started
                    </button>
                </div>
            )}
        </nav>
    );
};
