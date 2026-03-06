import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-cream pt-32 pb-10 overflow-hidden border-t border-earth/5">
            {/* Soft background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-saffron/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-sage rounded-2xl flex items-center justify-center shadow-colored-sage">
                                <span className="text-white font-display text-2xl font-bold">ॐ</span>
                            </div>
                            <span className="font-display text-3xl font-bold text-earth tracking-tight">SD<span className="text-saffron">HC</span></span>
                        </Link>
                        <p className="text-earth/60 text-lg leading-relaxed mb-8 pr-4">
                            Elevating Ayurvedic practice with clinical-grade, sustainably sourced raw materials since 2009.
                        </p>

                        <div className="space-y-4">
                            <a href="tel:+919876543210" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-white transition-all duration-300 group-hover:-translate-y-1">
                                    <Phone size={18} />
                                </div>
                                <span className="text-earth font-medium group-hover:text-saffron transition-colors">+91 98765 43210</span>
                            </a>
                            <a href="mailto:contact@sdhc.com" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-white transition-all duration-300 group-hover:-translate-y-1">
                                    <Mail size={18} />
                                </div>
                                <span className="text-earth font-medium group-hover:text-saffron transition-colors">contact@sdhc.com</span>
                            </a>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-saffron shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-earth font-medium py-2">Kerala, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
                        <h4 className="font-display text-xl font-bold text-earth mb-6">Catalog</h4>
                        <ul className="space-y-4">
                            {['Raw Herbs', 'Herbal Powders', 'Extracts', 'Oils & Resins'].map((item) => (
                                <li key={item}>
                                    <Link to={`/catalog?category=${item}`} className="text-earth/60 hover:text-saffron font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="font-display text-xl font-bold text-earth mb-6">Company</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Our Story', to: '/about' },
                                { label: 'Quality Standards', to: '/quality' },
                                { label: 'Bulk Partner', to: '/bulk-supply' },
                                { label: 'Knowledge Base', to: '/blog' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link to={item.to} className="text-earth/60 hover:text-saffron font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Certifications & Trust */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 border-gold/20 shadow-none bg-white/50">
                            <h4 className="font-display text-lg font-bold text-earth mb-4 flex items-center gap-2">
                                <Leaf className="text-saffron" size={20} /> Trusted Excellence
                            </h4>
                            <p className="text-earth/60 text-sm mb-6 leading-relaxed">
                                Our facility meets rigorous pharmaceutical GMP protocols, ensuring unparalleled purity and efficacy.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-earth shadow-sm border border-earth/5">ISO 9001:2015</span>
                                <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-earth shadow-sm border border-earth/5">GMP Certified</span>
                                <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-earth shadow-sm border border-earth/5">FSSAI</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-earth/10 gap-4">
                    <p className="text-earth/40 text-sm font-medium">© {year} SDHC Ayurveda. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/admin" className="text-earth/40 hover:text-saffron text-sm font-medium transition-colors">Admin Access</Link>
                        <Link to="/" className="text-earth/40 hover:text-saffron text-sm font-medium transition-colors">Privacy Policy</Link>
                        <Link to="/" className="text-earth/40 hover:text-saffron text-sm font-medium transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
