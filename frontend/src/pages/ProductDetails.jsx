import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Factory, FlaskConical, Scale, ShieldCheck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        document.title = "Product Details | SDHC";
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-28 pb-24 flex items-center justify-center text-earth">Loading...</div>;
    if (!product) return <div className="min-h-screen pt-28 pb-24 flex items-center justify-center text-earth">Product not found.</div>;


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
                                    <img 
                                        src={product.images && product.images.length > 0 ? product.images[activeImage].url : 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80'} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-earth/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Badges on image */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-bold text-saffron shadow-sm flex items-center gap-2 border border-white">
                                            <ShieldCheck size={14} /> 100% Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${activeImage === idx ? 'border-saffron' : 'border-transparent hover:border-earth/20'}`}
                                        >
                                            <img src={img.url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
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
                                { icon: Scale, label: 'Bulk', value: product.bulkAvailability ? 'Available' : 'N/A' },
                                { icon: Factory, label: 'Origin', value: 'India' },
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
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-teal shrink-0 mt-0.5" size={18} />
                                        <span className="text-earth/70 font-medium">GMP Certified Process</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-teal shrink-0 mt-0.5" size={18} />
                                        <span className="text-earth/70 font-medium">Quality Verified</span>
                                    </li>
                                </ul>
                            </div>

                            {product.directionsForUse && (
                                <div className="glass-card p-8">
                                    <h3 className="font-display text-2xl font-bold text-earth mb-4">Directions for Use</h3>
                                    <p className="text-earth/70 font-medium leading-relaxed">{product.directionsForUse}</p>
                                </div>
                            )}

                            <div className="glass-card p-8 bg-gradient-to-br from-white/80 to-saffron/5 border-saffron/20 shadow-colored-sage">
                                <h3 className="font-display text-2xl font-bold text-earth mb-4">Request Bulk Quote</h3>
                                <p className="text-earth/60 mb-6 font-medium">Get real-time pricing, availability, and CoAs for commercial quantities.</p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/bulk-supply" className="btn-primary w-full sm:w-auto shadow-colored-sage">
                                        Request Quote
                                    </Link>
                                    <a href="https://wa.me/919376481607" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
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
