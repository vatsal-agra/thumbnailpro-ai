import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
    position: 'top' | 'sidebar' | 'bottom';
    className?: string;
    slotId?: string; // Optional: specific slot ID from Google AdSense
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = "", slotId }) => {
    const adRef = useRef<boolean>(false);

    useEffect(() => {
        // Only push one ad per component mount
        if (!adRef.current) {
            try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                adRef.current = true;
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }
    }, []);

    // Placeholder Client ID - User should replace this
    const clientId = "ca-pub-XXXXXXXXXXXXX";

    // Default slot IDs if not provided
    const defaultSlot = slotId || (position === 'sidebar' ? "SIDEBAR_SLOT_ID" : "BOTTOM_SLOT_ID");

    if (position === 'sidebar') {
        return (
            <div className={`w-full bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col items-center p-4 text-center overflow-hidden ${className}`}>
                <div className="w-full mb-4">
                    <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Advertisement</span>
                </div>
                <div className="w-full flex-1 min-h-[600px] flex items-center justify-center bg-black/20 rounded-lg">
                    {/* Google AdSense tag */}
                    <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client={clientId}
                        data-ad-slot={defaultSlot}
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>
                <div className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Google Ad</div>
            </div>
        );
    }

    return (
        <div className={`w-full p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col items-center min-h-[100px] text-center overflow-hidden ${className}`}>
            <span className="text-[10px] text-zinc-700 uppercase tracking-tighter mb-4">Advertisement</span>
            <div className="w-full flex-1">
                {/* Google AdSense tag */}
                <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={clientId}
                    data-ad-slot={defaultSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
        </div>
    );
};
