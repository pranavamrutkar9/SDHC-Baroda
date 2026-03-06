import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
    useEffect(() => {
        document.title = "Knowledge Hub | SDHC";
        window.scrollTo(0, 0);
    }, []);

    const articles = [
        {
            id: 1, featured: true,
            title: 'Understanding Ashwagandha: From Root to Clinical Application',
            excerpt: 'A comprehensive guide to Withania somnifera — its traditional roots in Rasayana therapy, modern pharmacological research, and what practitioners should know about sourcing clinical-grade root powder.',
            category: 'Herb Profiles', date: 'March 2026', readTime: '12 min read',
            image: 'https://images.unsplash.com/photo-1615486171448-4fd186414757?auto=format&fit=crop&q=80',
        },
        {
            id: 2,
            title: 'Heavy Metal Testing: Why Your Supplier\'s CoA Matters',
            excerpt: 'Not all Certificates of Analysis are created equal. Learn what parameters to check and why ICP-MS testing is the gold standard.',
            category: 'Quality', date: 'Feb 2026', readTime: '8 min read',
            image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80',
        },
        {
            id: 3,
            title: 'The Case for Shade-Dried Herbs Over Machine Processing',
            excerpt: 'High-heat drying degrades thermolabile compounds. How traditional shade-drying preserves the full phytochemical profile.',
            category: 'Processing', date: 'Feb 2026', readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80',
        },
        {
            id: 4,
            title: 'Sourcing Triphala: Origin Matters More Than You Think',
            excerpt: 'Why the geographic origin of Haritaki, Bibhitaki, and Amalaki dramatically affects the efficacy of your Triphala formulation.',
            category: 'Sourcing', date: 'Jan 2026', readTime: '7 min read',
            image: 'https://images.unsplash.com/photo-1608528577891-eb05feca37bf?auto=format&fit=crop&q=80',
        },
        {
            id: 5,
            title: 'CO2 Extraction vs. Solvent Extraction: A Practitioner\'s Guide',
            excerpt: 'Understanding when supercritical CO2 extraction is worth the premium, and when traditional solvent methods are perfectly adequate.',
            category: 'Processing', date: 'Jan 2026', readTime: '9 min read',
            image: 'https://images.unsplash.com/photo-1628189855581-2b0ea2a013d5?auto=format&fit=crop&q=80',
        },
    ];

    const featured = articles.find(a => a.featured);
    const rest = articles.filter(a => !a.featured);

    return (
        <div className="bg-cream min-h-screen">
            {/* ===== Hero ===== */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
                <div className="relative max-w-5xl mx-auto px-6 sm:px-12 lg:px-20 text-center z-10">
                    <h1 className="heading-xl text-earth mb-6">
                        Knowledge <span className="text-saffron italic">Hub</span>
                    </h1>
                    <p className="subtitle mx-auto">
                        Research notes, sourcing guides, and quality insights for Ayurvedic practitioners.
                    </p>
                </div>
            </section>

            {/* ===== Featured article ===== */}
            {featured && (
                <section className="pb-16 relative z-10">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                        <Link to="#" className="glass-panel group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden hover:-translate-y-1 transition-transform p-0 border-white/80 shadow-soft-2xl bg-white/70">
                            <div className="relative h-[300px] lg:h-[450px] overflow-hidden">
                                <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-bold text-saffron shadow-sm uppercase tracking-widest">{featured.category}</span>
                                </div>
                            </div>
                            <div className="p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white/10 to-transparent">
                                <div className="flex items-center gap-3 text-earth/50 text-xs font-bold uppercase tracking-widest mb-6">
                                    <span>{featured.date}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {featured.readTime}</span>
                                </div>
                                <h2 className="heading-lg text-earth mb-6 group-hover:text-saffron transition-colors leading-tight">{featured.title}</h2>
                                <p className="text-earth/70 font-medium leading-relaxed mb-8">{featured.excerpt}</p>
                                <span className="inline-flex items-center gap-2 text-saffron font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all">
                                    Read Article <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* ===== Article grid ===== */}
            <section className="section-padding pt-0 relative z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px w-12 bg-earth/10" />
                        <span className="text-earth/40 text-sm font-bold tracking-widest uppercase">More Articles</span>
                        <div className="h-px flex-1 bg-earth/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rest.map((article, i) => (
                            <Link
                                key={article.id}
                                to="#"
                                className="glass-card group flex flex-col overflow-hidden hover:-translate-y-2 transition-transform shadow-soft-xl"
                            >
                                <div className="relative h-48 overflow-hidden rounded-t-[1.5rem]">
                                    <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-earth/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-saffron shadow-sm uppercase tracking-widest">{article.category}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1 bg-white/40">
                                    <div className="flex items-center gap-3 text-earth/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                                        <span>{article.date}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-earth mb-3 group-hover:text-saffron transition-colors leading-snug">{article.title}</h3>
                                    <p className="text-earth/60 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

                                    <span className="inline-flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        Read <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
