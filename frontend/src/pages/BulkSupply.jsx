import React, { useState, useEffect } from 'react';
import { Truck, TestTubes, PackageCheck, Clock, Send, ArrowRight, CheckCircle2 } from 'lucide-react';

const BulkSupply = () => {
    useEffect(() => {
        document.title = "Bulk Supply | SDHC";
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', products: '', quantity: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="bg-cream min-h-screen">
            {/* ===== Split hero ===== */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="tag-modern mb-6">B2B Supply</div>
                            <h1 className="heading-xl text-earth mb-6">
                                Bulk Raw Materials,<br /><span className="text-saffron italic">Your Schedule</span>
                            </h1>
                            <p className="subtitle mb-8">
                                Recurring supply arrangements with auto-dispatch, priority processing, and dedicated account management for your practice or formulation unit.
                            </p>
                            <a href="#inquiry-form" className="btn-primary inline-flex">
                                Start Inquiry <ArrowRight size={20} className="ml-2" />
                            </a>
                        </div>

                        <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-soft-2xl border-4 border-white animate-fade-in-up animation-delay-300">
                            <img src="https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80" alt="Bulk herbs" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-earth/50 via-transparent to-transparent" />

                            {/* Floating stat card */}
                            <div className="absolute bottom-6 left-6 right-6 glass-panel border-white/40 p-5 backdrop-blur-md">
                                <div className="flex items-center gap-4 text-white">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Pan-India Delivery</div>
                                        <div className="text-white/80 text-sm">Reliable logistics network</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Advantages ===== */}
            <section className="section-padding bg-white relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="text-center mb-16">
                        <h2 className="heading-lg text-earth mb-4">Why Bulk With SDHC?</h2>
                        <p className="subtitle mx-auto">Streamlined procurement for professional practices.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, title: 'Scheduled Delivery', desc: 'Set your delivery frequency. We auto-dispatch on time.', color: 'text-saffron', bg: 'bg-saffron/10' },
                            { icon: TestTubes, title: 'Batch-Wise CoA', desc: 'Certificate of Analysis included with EVERY shipment.', color: 'text-teal', bg: 'bg-teal/10' },
                            { icon: PackageCheck, title: 'Custom Packaging', desc: 'Labels, pack sizes, and formats tailored to your needs.', color: 'text-gold-600', bg: 'bg-gold/10' },
                            { icon: Clock, title: 'Priority Processing', desc: 'Bulk orders get dedicated slots in our production line.', color: 'text-maroon', bg: 'bg-maroon/10' },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 group hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <h4 className="font-display text-xl font-bold text-earth mb-3">{item.title}</h4>
                                <p className="text-earth/60 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Inquiry Form ===== */}
            <section id="inquiry-form" className="section-padding relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                    <div className="glass-panel p-10 lg:p-16 border-white shadow-soft-2xl bg-white/70">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                            {/* Left Text */}
                            <div className="flex flex-col justify-center">
                                <div className="tag-modern mb-4 bg-saffron/10 text-saffron border-saffron/20 max-w-max">Inquiry</div>
                                <h2 className="heading-lg text-earth mb-6">Tell Us What<br />You Need</h2>
                                <p className="subtitle mb-8">
                                    Minimum order: 25 kg per product. We handle both one-time bulk orders and recurring supply contracts with locked-in pricing.
                                </p>

                                <div className="space-y-4">
                                    {['Direct cultivator pricing', 'Custom formulation support', 'Flexible payment terms', 'Dedicated account manager'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 glass-card p-3 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-teal" />
                                            </div>
                                            <span className="text-earth font-bold text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Form */}
                            <div>
                                {submitted ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-fade-in">
                                        <div className="w-24 h-24 bg-teal/10 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-12 h-12 text-teal" />
                                        </div>
                                        <h3 className="heading-lg text-earth mb-4">Inquiry Received!</h3>
                                        <p className="subtitle">Our B2B team will get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Name *</label>
                                                <input type="text" required className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Email *</label>
                                                <input type="email" required className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Phone</label>
                                                <input type="tel" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Company / Clinic</label>
                                                <input type="text" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Products Required *</label>
                                            <input type="text" required placeholder="e.g. Ashwagandha Root Powder, Brahmi Extract" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.products} onChange={e => setFormData({ ...formData, products: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Estimated Quantity</label>
                                            <input type="text" placeholder="e.g. 100 kg/month" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Additional Notes</label>
                                            <textarea rows="3" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full justify-center">
                                            <Send size={18} /> Submit Inquiry
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BulkSupply;
