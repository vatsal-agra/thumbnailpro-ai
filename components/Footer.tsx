import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-900 bg-black py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-sm" />
                            </div>
                            <span className="font-bold text-lg">ThumbnailPro AI</span>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            The world's first AI-powered thumbnail generator that actually understands your video content.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-zinc-300">Product</h4>
                        <ul className="space-y-4 text-zinc-500 text-sm">
                            <li><a href="#" className="hover:text-red-500 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-zinc-300">Company</h4>
                        <ul className="space-y-4 text-zinc-500 text-sm">
                            <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Privacy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-zinc-300">Social</h4>
                        <ul className="space-y-4 text-zinc-500 text-sm">
                            <li><a href="#" className="hover:text-red-500 transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">YouTube</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
                    <div>&copy; {new Date().getFullYear()} ThumbnailPro AI. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                        <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-400">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
