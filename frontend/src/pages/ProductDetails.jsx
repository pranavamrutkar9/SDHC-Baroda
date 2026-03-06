import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Factory, FlaskConical, Scale, ShieldCheck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();

    useEffect(() => {
        document.title = "Product Details | SDHC";
        window.scrollTo(0, 0);
    }, [id]);

    // Mock data
    const product = {
        name: 'Ashwagandha Root Powder',
        botanicalName: 'Withania somnifera',
        category: 'Herbal Powders',
        description: 'Premium grade, finely milled Ashwagandha root powder sourced directly from the arid regions of Rajasthan. Known for its potent adaptogenic properties, this powder is processed under strict temperature controls to preserve withanolide content.',
        origin: 'Rajasthan, India',
        grade: 'Clinical Grade (Pharmaceutical)',
        testing: ['Heavy Metals: Pass', 'Microbial: Pass', 'Aflatoxins: Absent', 'Identity: TLC/HPTLC Verified'],
        certifications: ['GMP', 'ISO 9001:2015', 'FSSAI'],
        packaging: ['25kg HDPE Drums', '10kg Vacuum Bags'],
        minOrder: '25 kg',
        img: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80',
    };

    return (
        <div className="bg-cream min-h-screen pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

                {/* Back Button */}
                <Link to="/catalog" className="inline-flex items-center gap-2 text-earth/50 hover:text-saffron font-bold text-sm mb-10 transition-colors">
                    <ArrowLeft size={16} /> Back to Catalog
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left: Product Image & Badges */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32">
                            <div className="glass-panel p-2 shadow-soft-2xl border-white/80 rounded-[2.5rem] overflow-hidden group">
                                <div className="relative h-[500px] rounded-[2rem] overflow-hidden">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-earth/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Badges on image */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-bold text-saffron shadow-sm flex items-center gap-2 border border-white">
                                            <ShieldCheck size={14} /> 100% Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-7">
                        <div className="mb-8">
                            <div className="text-saffron text-sm font-bold tracking-widest uppercase mb-3">{product.category}</div>
                            <h1 className="heading-lg mb-2 text-earth">{product.name}</h1>
                            <p className="font-display text-2xl text-earth/50 italic mb-8">{product.botanicalName}</p>

                            <p className="subtitle mb-10">{product.description}</p>
                        </div>

                        {/* Quick Specs Bento Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { icon: Scale, label: 'Min. Order', value: product.minOrder },
                                { icon: Factory, label: 'Origin', value: product.origin },
                                { icon: ShieldCheck, label: 'Grade', value: 'Clinical' },
                                { icon: FlaskConical, label: 'Tested', value: 'Yes' },
                            ].map((spec, i) => (
                                <div key={i} className="glass-panel p-5 text-center transition-transform hover:-translate-y-1">
                                    <spec.icon className="mx-auto text-saffron mb-3" size={24} />
                                    <div className="text-xs text-earth/50 font-bold uppercase tracking-wider mb-1">{spec.label}</div>
                                    <div className="font-display font-bold text-earth">{spec.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Specs */}
                        <div className="space-y-8">
                            <div className="glass-card p-8">
                                <h3 className="font-display text-2xl font-bold text-earth mb-6 flex items-center gap-3">
                                    <FlaskConical className="text-saffron" size={24} /> Quality & Testing
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.testing.map((test, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="text-teal shrink-0 mt-0.5" size={18} />
                                            <span className="text-earth/70 font-medium">{test}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass-card p-8 bg-gradient-to-br from-white/80 to-saffron/5 border-saffron/20 shadow-colored-sage">
                                <h3 className="font-display text-2xl font-bold text-earth mb-4">Request Bulk Quote</h3>
                                <p className="text-earth/60 mb-6 font-medium">Get real-time pricing, availability, and CoAs for commercial quantities.</p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/bulk-supply" className="btn-primary w-full sm:w-auto shadow-colored-sage">
                                        Request Quote
                                    </Link>
                                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
                                        WhatsApp Us
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
