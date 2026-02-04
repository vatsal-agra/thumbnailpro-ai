import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { setCookie, getCookie } from '../utils/cookies';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = getCookie('user_cookie_consent');
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setCookie('user_cookie_consent', 'true', 365);
        setIsVisible(false);
    };

    const handleDecline = () => {
        setCookie('user_cookie_consent', 'false', 7);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[450px] z-[100] animate-fade-in">
            <div className="glass bg-[#0a0a0a]/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/50 overflow-hidden relative group">
                {/* Accent glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full group-hover:bg-red-600/20 transition-all duration-700" />

                <div className="flex gap-4 items-start relative z-10">
                    <div className="bg-red-600/20 p-3 rounded-xl border border-red-500/30">
                        <Cookie className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white font-outfit">Cookie Consent</h3>
                            <button onClick={handleDecline} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-sans">
                            We use cookies and local storage to personalize your experience and remember your <span className="text-white font-semibold">"Recent Projects"</span> across visits. No data is stored on our servers.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAccept}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Check className="w-4 h-4" /> Accept All
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg text-sm transition-all border border-zinc-700/50"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>

                {/* Small indicator at the bottom */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-red-600 w-full animate-pulse shadow-[0_0_10px_#dc2626]" />
            </div>
        </div>
    );
};
