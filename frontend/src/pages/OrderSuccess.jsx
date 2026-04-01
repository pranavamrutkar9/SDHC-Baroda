import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Leaf } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    useEffect(() => {
        document.title = 'Order Confirmed | SDHC';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-cream pt-28 pb-24 flex items-center justify-center">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-lg w-full mx-auto px-6 text-center">
                {/* Animated check */}
                <div className="relative inline-flex mb-8">
                    <div className="w-28 h-28 rounded-full bg-teal/10 flex items-center justify-center animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-teal/20 flex items-center justify-center">
                            <CheckCircle2 className="text-teal" size={48} strokeWidth={2} />
                        </div>
                    </div>
                    {/* Sparkles */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i}
                            className="absolute w-2 h-2 rounded-full bg-saffron"
                            style={{
                                top: `${50 + 50 * Math.sin((i * Math.PI * 2) / 6)}%`,
                                left: `${50 + 50 * Math.cos((i * Math.PI * 2) / 6)}%`,
                                transform: 'translate(-50%, -50%)',
                                animation: `ping 1s ease-out ${i * 0.15}s forwards`,
                                opacity: 0.6
                            }}
                        />
                    ))}
                </div>

                <h1 className="font-display text-4xl font-bold text-earth mb-3">Order Confirmed!</h1>
                <p className="text-earth/60 font-medium text-lg mb-2">
                    Thank you for your order. We've received it and will process it shortly.
                </p>

                {orderId && (
                    <div className="glass-card p-4 inline-flex items-center gap-3 mb-8">
                        <Package className="text-saffron shrink-0" size={18} />
                        <div className="text-left">
                            <p className="text-xs font-bold text-earth/40 uppercase tracking-wider">Order ID</p>
                            <p className="font-mono font-bold text-earth">#{orderId.slice(-10).toUpperCase()}</p>
                        </div>
                    </div>
                )}

                <div className="glass-panel p-8 mb-8 text-left space-y-4">
                    <h3 className="font-display font-bold text-earth text-xl mb-4">What happens next?</h3>
                    {[
                        { step: '1', text: 'Our team verifies your order and prepares it.' },
                        { step: '2', text: 'Your order is packed and dispatched.' },
                        { step: '3', text: 'Track your delivery from your Profile page.' },
                    ].map(({ step, text }) => (
                        <div key={step} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron font-bold text-sm flex items-center justify-center shrink-0">
                                {step}
                            </div>
                            <p className="text-earth/70 font-medium pt-1">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/profile" className="btn-primary">
                        View My Orders <ArrowRight size={18} />
                    </Link>
                    <Link to="/catalog" className="btn-secondary">
                        <Leaf size={18} /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
