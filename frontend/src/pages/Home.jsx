import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ChevronRight, Shield, Leaf, FlaskConical, Truck, Star } from 'lucide-react';

const Home = () => {
    useEffect(() => {
        document.title = "SDHC | Premium Ayurvedic Raw Materials";
        window.scrollTo(0, 0);
    }, []);

    const scrollRef = useRef(null);

    const categories = [
        { name: 'Raw Herbs', tagline: 'Whole dried roots, leaves & bark sourced from natural habitats', img: 'https://images.unsplash.com/photo-1615486171448-4fd186414757?auto=format&fit=crop&q=80', count: '120+', query: 'Raw Herbs' },
        { name: 'Herbal Powders', tagline: 'Fine-ground Churna & traditional blends for formulations', img: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80', count: '85+', query: 'Herbal Powders' },
        { name: 'Extracts', tagline: 'Concentrated active compounds & standardized essences', img: 'https://images.unsplash.com/photo-1608528577891-eb05feca37bf?auto=format&fit=crop&q=80', count: '60+', query: 'Extracts' },
        { name: 'Oils & Resins', tagline: 'Cold-pressed oils, gum resins & aromatic distillates', img: 'https://images.unsplash.com/photo-1628189855581-2b0ea2a013d5?auto=format&fit=crop&q=80', count: '40+', query: 'Oils & Resins' },
    ];

    return (
        <div className="bg-cream">
            {/* ===== HERO: Ethereal Floating Hero ===== */}
            <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-saffron/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-teal/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob mix-blend-multiply animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gold/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob mix-blend-multiply animation-delay-4000" />

                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div className="max-w-xl animate-fade-in-up">
                        <div className="tag-modern mb-8 w-max">
                            <Leaf size={14} className="text-saffron" />
                            <span className="text-saffron-700">Clinical Grade Purity</span>
                        </div>

                        <h1 className="heading-xl mb-6 text-earth">
                            Where Ancient Wisdom Meets <br />
                            <span className="text-gradient">Modern Science</span>
                        </h1>

                        <p className="subtitle mb-10 text-earth/70">
                            India's most trusted supplier of clinical-grade Ayurvedic raw materials. Sourced ethically. Tested rigorously. Delivered reliably.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <Link to="/catalog" className="btn-primary w-full sm:w-auto">
                                Explore Catalog <ArrowRight size={20} />
                            </Link>
                            <Link to="/about" className="group flex items-center gap-2 text-earth font-bold hover:text-saffron transition-colors px-4 py-3">
                                Our Story <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-cream bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-bold text-earth/70">
                                Trusted by <span className="text-saffron font-extrabold text-base">500+</span><br /> Practitioners
                            </div>
                        </div>
                    </div>

                    {/* Right: Floating Glass Cards */}
                    <div className="relative h-[600px] hidden lg:block animate-fade-in-up animation-delay-500">
                        {/* Main Image */}
                        <div className="absolute top-0 right-0 w-[80%] h-[500px] rounded-5xl overflow-hidden shadow-soft-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80"
                                alt="Ayurvedic herbs"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Stats Card */}
                        <div className="absolute bottom-10 left-0 glass-panel p-6 max-w-xs animate-float">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                                    <FlaskConical size={24} />
                                </div>
                                <div>
                                    <div className="font-display font-bold text-xl text-earth">100% Lab Tested</div>
                                    <div className="text-earth/60 text-sm font-medium">GMP Certified Facility</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Small Card */}
                        <div className="absolute top-1/4 -left-10 glass-panel p-4 animate-float-delayed">
                            <div className="font-display font-bold text-3xl text-saffron">15+</div>
                            <div className="text-earth/60 text-xs uppercase tracking-widest font-bold">Years Exp.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TRUST MARQUEE ===== */}
            <div className="bg-white py-6 border-y border-earth/5 overflow-hidden">
                <div className="flex animate-[scroll_25s_linear_infinite] whitespace-nowrap">
                    {[...Array(3)].map((_, rep) => (
                        <div key={rep} className="flex items-center gap-16 px-8">
                            {[
                                'ISO 9001:2015 Certified',
                                'GMP Compliant Facility',
                                'FSSAI Licensed',
                                'Certificate of Analysis Included',
                                'Sustainably Sourced',
                            ].map((text, i) => (
                                <span key={i} className="flex items-center gap-3 text-sm text-earth/50 font-bold uppercase tracking-widest">
                                    <Star size={14} className="text-gold" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== CATEGORIES: Bento Grid Showcase ===== */}
            <section className="section-padding relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="heading-lg mb-4 text-earth">The Encyclopedia of <br /><span className="text-saffron italic">Nature</span></h2>
                            <p className="subtitle">Discover our comprehensive collection of raw materials, extracted and preserved with the utmost care.</p>
                        </div>
                        <Link to="/catalog" className="btn-secondary whitespace-nowrap">
                            View Full Catalog
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Large primary category */}
                        <Link to={`/catalog?category=${categories[0].query}`} className="glass-card group lg:col-span-2 h-[450px] relative overflow-hidden flex flex-col justify-end p-8 border-none pointer-events-auto">
                            <img src={categories[0].img} alt={categories[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/20 to-transparent" />

                            <div className="relative z-10">
                                <div className="tag-modern mb-4 bg-white/20 text-white border-white/30 backdrop-blur-md">{categories[0].count} Products</div>
                                <h3 className="font-display text-4xl font-bold text-white mb-2">{categories[0].name}</h3>
                                <p className="text-white/80 font-medium max-w-md">{categories[0].tagline}</p>
                            </div>
                        </Link>

                        {/* Smaller categories */}
                        {categories.slice(1).map((cat, i) => (
                            <Link key={cat.name} to={`/catalog?category=${cat.query}`} className={`glass-card group h-[450px] relative overflow-hidden flex flex-col justify-end p-8 border-none lg:col-span-1 ${i === 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/30 to-transparent" />

                                <div className="relative z-10">
                                    <div className="text-white/60 text-sm font-bold uppercase tracking-widest mb-2">{cat.count} Products</div>
                                    <h3 className="font-display text-3xl font-bold text-white mb-2">{cat.name}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-white font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        Explore <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY US ===== */}
            <section className="section-padding bg-white relative overflow-hidden rounded-[3rem] mx-4 sm:mx-8 shadow-soft-xl">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[600px] rounded-4xl overflow-hidden shadow-soft-2xl border-8 border-cream group">
                            <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80" alt="Ayurvedic practitioner" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-saffron/10 mix-blend-overlay" />
                        </div>

                        <div>
                            <h2 className="heading-lg mb-6 text-earth">Not Just a Supplier.<br /><span className="text-saffron italic">A Partner in Healing.</span></h2>
                            <p className="subtitle mb-12">We control the entire supply chain from cultivation to extraction, ensuring unparalleled quality at every step.</p>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { icon: Leaf, title: 'Farm-Direct', desc: 'Sourced straight from trusted cultivators.', color: 'text-saffron', bg: 'bg-saffron/10' },
                                    { icon: FlaskConical, title: 'Lab-Verified', desc: 'Tested for heavy metals and purity.', color: 'text-teal', bg: 'bg-teal/10' },
                                    { icon: Shield, title: 'Clinical-Grade', desc: 'Pharmaceutical GMP protocols.', color: 'text-maroon', bg: 'bg-maroon/10' },
                                    { icon: Truck, title: 'Scheduled Delivery', desc: 'Reliable bulk dispatch system.', color: 'text-gold-600', bg: 'bg-gold/10' },
                                ].map((feature, i) => (
                                    <div key={i} className="group">
                                        <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1`}>
                                            <feature.icon size={24} />
                                        </div>
                                        <h4 className="font-display text-xl font-bold text-earth mb-2">{feature.title}</h4>
                                        <p className="text-earth/60 font-medium leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="section-padding relative">
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="glass-panel p-12 md:p-20 border-white/80 shadow-soft-2xl rounded-[3rem] bg-white/60 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/20 rounded-full mix-blend-multiply filter blur-[50px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/20 rounded-full mix-blend-multiply filter blur-[50px]" />

                        <div className="relative z-10">
                            <h2 className="heading-lg mb-6 text-earth">Ready to Elevate Your Practice?</h2>
                            <p className="subtitle mx-auto mb-10">Join 500+ Ayurvedic practitioners who trust SDHC for consistent, lab-verified, clinical-grade raw materials.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/bulk-supply" className="btn-primary">
                                    Request a Quote
                                </Link>
                                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
