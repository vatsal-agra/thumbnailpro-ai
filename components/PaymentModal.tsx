import React from 'react';
import { CreditCard, Zap, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isFirstTime: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, isFirstTime }) => {
    if (!isOpen) return null;

    const amount = isFirstTime ? 0 : 50;

    const handlePay = () => {
        if (isFirstTime) {
            onSuccess();
            return;
        }

        // Razorpay Integration
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Enter your Key ID generated from the Dashboard
            amount: amount * 100, // Amount is in currency subunits. 5000 paise = INR 50
            currency: "INR",
            name: "ThumbnailPro AI",
            description: "Thumbnail Generation Credit",
            image: "https://cdn-icons-png.flaticon.com/512/1055/1055666.png",
            handler: function (response: any) {
                console.log("Payment Success:", response.razorpay_payment_id);
                onSuccess();
            },
            prefill: {
                name: "User",
                email: "user@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "ThumbnailPro AI Office"
            },
            theme: {
                color: "#dc2626"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl glass">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <CreditCard className="w-8 h-8 text-red-500" />
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isFirstTime ? "Claim Your Free Gift!" : "Unlock Generation"}
                        </h2>
                        <p className="text-zinc-400">
                            {isFirstTime
                                ? "Your very first thumbnail is on the house! Zero cost."
                                : "High-quality AI generation requires specialized compute power."}
                        </p>
                    </div>

                    <div className="bg-zinc-800/50 rounded-2xl p-6 mb-8 border border-zinc-700/50">
                        <div className="flex justify-between items-center mb-4 leading-none">
                            <span className="text-zinc-400 font-medium">Generation Fee</span>
                            <span className="text-2xl font-black text-white">
                                {isFirstTime ? "₹0" : "₹50"}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>2 Unique Variations (Normal & Clickbait)</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span>Instant AI Analysis & Styling</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                <span>Safe & Secure Workspace</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePay}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                        {isFirstTime ? "Start Free Generation" : "Pay ₹50 & Generate"}
                    </button>

                    <p className="text-[10px] text-center text-zinc-600 mt-4 uppercase tracking-widest font-bold">
                        Secure SSL Encrypted Payment
                    </p>
                </div>
            </div>
        </div>
    );
};
