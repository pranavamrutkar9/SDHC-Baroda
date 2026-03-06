import React from 'react';
import { MessageCircle } from 'lucide-react';

const StickyWhatsApp = () => {
    return (
        <a
            href="https://wa.me/919876543210"
            className="fixed bottom-8 right-8 z-[100] group flex items-center gap-4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
        >
            {/* Tooltip visible on hover horizontally */}
            <div className="hidden md:flex px-4 py-2.5 glass-panel bg-white/90 text-earth font-bold text-sm shadow-soft-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none rounded-2xl">
                Need bulk supply? Let's chat!
            </div>

            {/* Glowing Button */}
            <div className="relative w-16 h-16">
                {/* Ping animation behind */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40" />

                {/* Button actual */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#128C7E] to-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <MessageCircle className="w-8 h-8 text-white fill-white" />
                </div>
            </div>
        </a>
    );
};

export default StickyWhatsApp;
