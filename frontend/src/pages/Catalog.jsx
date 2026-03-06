import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, ArrowRight, Leaf, Info } from 'lucide-react';

const Catalog = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        document.title = "Catalog | SDHC";
        window.scrollTo(0, 0);
    }, []);

    const categories = ['All', 'Raw Herbs', 'Herbal Powders', 'Extracts', 'Oils & Resins'];

    // Placeholder data
    const products = [
        { id: 1, name: 'Ashwagandha Root', botanical: 'Withania somnifera', category: 'Raw Herbs', tags: ['High Demand'], img: 'https://images.unsplash.com/photo-1615486171448-4fd186414757?auto=format&fit=crop&q=80' },
        { id: 2, name: 'Brahmi Leaves', botanical: 'Bacopa monnieri', category: 'Raw Herbs', tags: ['Wildcrafted'], img: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80' },
        { id: 3, name: 'Triphala Churna', botanical: 'Emblica, Terminalia', category: 'Herbal Powders', tags: ['Standardized'], img: 'https://images.unsplash.com/photo-1608528577891-eb05feca37bf?auto=format&fit=crop&q=80' },
        { id: 4, name: 'Curcumin 95%', botanical: 'Curcuma longa', category: 'Extracts', tags: ['High Purity'], img: 'https://images.unsplash.com/photo-1628189855581-2b0ea2a013d5?auto=format&fit=crop&q=80' },
        { id: 5, name: 'Neem Oil', botanical: 'Azadirachta indica', category: 'Oils & Resins', tags: ['Cold Pressed'], img: 'https://images.unsplash.com/photo-1615486171448-4fd186414757?auto=format&fit=crop&q=80' },
        { id: 6, name: 'Shatavari Powder', botanical: 'Asparagus racemosus', category: 'Herbal Powders', tags: [], img: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80' },
        { id: 7, name: 'Guggulu Resin', botanical: 'Commiphora mukul', category: 'Oils & Resins', tags: ['Purified'], img: 'https://images.unsplash.com/photo-1608528577891-eb05feca37bf?auto=format&fit=crop&q=80' },
        { id: 8, name: 'Tulsi Extract', botanical: 'Ocimum sanctum', category: 'Extracts', tags: ['Water Soluble'], img: 'https://images.unsplash.com/photo-1628189855581-2b0ea2a013d5?auto=format&fit=crop&q=80' },
    ];

    const filteredProducts = products.filter(p => {
        const matchesCat = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.botanical.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="bg-cream min-h-screen pt-32 pb-24">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-mesh opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">

                {/* Header */}
                <div className="mb-16 animate-fade-in-up">
                    <h1 className="heading-xl mb-4 text-earth">Master <span className="text-saffron italic">Catalog</span></h1>
                    <p className="subtitle">Browse our exhaustive selection of clinical-grade raw materials.</p>
                </div>

                {/* Filters & Search - Glassmorphic Bar */}
                <div className="glass-panel p-4 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up animation-delay-200">
                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeCategory === cat ? 'bg-earth text-white shadow-md' : 'bg-transparent text-earth/60 hover:bg-white/50 hover:text-earth'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search herbs, botanical names..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white focus:border-saffron focus:bg-white rounded-full text-earth outline-none font-medium transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product, i) => (
                        <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="glass-card group overflow-hidden flex flex-col"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="relative h-64 overflow-hidden border-b border-white/40">
                                <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                {product.tags.map((tag, idx) => (
                                    <div key={idx} className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-saffron shadow-sm">
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="text-earth/50 text-xs font-bold uppercase tracking-widest mb-2">{product.category}</div>
                                    <h3 className="font-display font-bold text-xl text-earth mb-1">{product.name}</h3>
                                    <p className="text-earth/60 text-sm italic mb-4">{product.botanical}</p>
                                </div>

                                <div className="flex items-center text-saffron font-bold text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    View Details <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-earth/5">
                            <Search className="text-earth/30" size={32} />
                        </div>
                        <h3 className="font-display font-bold text-2xl text-earth mb-2">No products found</h3>
                        <p className="text-earth/60">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
