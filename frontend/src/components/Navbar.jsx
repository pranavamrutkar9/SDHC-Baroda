import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/catalog', label: 'Catalog' },
        { to: '/bulk-supply', label: 'Bulk Supply' },
        { to: '/quality', label: 'Quality' },
        { to: '/about', label: 'About' },
        { to: '/blog', label: 'Knowledge' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-500 pt-4 pb-2">
            <nav className={`max-w-7xl mx-auto transition-all duration-500 rounded-full ${scrolled
                ? 'glass-panel px-6 py-2 shadow-soft-xl'
                : 'bg-transparent px-6 py-4'
                }`}>

                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-sage flex items-center justify-center shadow-colored-sage transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(90,141,110,0.4)]">
                            <span className="text-white font-display text-lg font-bold">ॐ</span>
                        </div>
                        <span className="text-2xl font-display font-bold text-earth tracking-tight">
                            SD<span className="text-saffron">HC</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-2 bg-white/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/60 shadow-sm">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${location.pathname === link.to
                                    ? 'bg-white text-saffron shadow-sm'
                                    : 'text-earth/70 hover:text-earth hover:bg-white/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Contact */}
                    <div className="hidden lg:block">
                        <Link to="/contact" className="btn-primary !py-2.5 !px-6 text-sm">
                            Contact Us
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all ${scrolled ? 'bg-white shadow-sm text-saffron' : 'bg-white/50 text-earth backdrop-blur-md'}`}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`lg:hidden absolute top-[calc(100%+10px)] left-4 right-4 glass-panel overflow-hidden transition-all duration-500 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}>
                <div className="px-4 py-6 flex flex-col gap-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${location.pathname === link.to
                                ? 'bg-saffron/10 text-saffron'
                                : 'text-earth hover:bg-white/60'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/contact" className="btn-primary mt-4 w-full justify-center">
                        Get In Touch
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
