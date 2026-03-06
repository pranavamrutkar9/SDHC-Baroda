import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact | SDHC";
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const faqs = [
        { q: 'What is the minimum order quantity?', a: 'Our standard minimum order is 50 kg per product for bulk supply. For catalog purchases and evaluation, smaller quantities may be available.' },
        { q: 'Do you ship outside India?', a: 'Currently we serve domestic clients across 18 states. International shipping for select products is available on request.' },
        { q: 'Can I visit your facility?', a: 'Absolutely. We encourage facility visits. Please schedule at least 48 hours in advance through this form or WhatsApp.' },
        { q: 'How do I verify your product quality?', a: 'Every shipment includes a Certificate of Analysis. We also offer free evaluation samples for first-time clients.' },
    ];

    const contactInfo = [
        { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
        { icon: Mail, label: 'Email', value: 'contact@sdhc.com', href: 'mailto:contact@sdhc.com' },
        { icon: MapPin, label: 'Location', value: 'Kerala, India', href: null },
        { icon: Clock, label: 'Hours', value: 'Mon - Sat, 9 AM - 6 PM IST', href: null },
    ];

    return (
        <div className="bg-cream min-h-screen">
            {/* ===== Hero ===== */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="tag-modern mb-6">Reach Out</div>
                            <h1 className="heading-xl text-earth mb-6">
                                Let's <span className="text-saffron italic">Talk</span>
                            </h1>
                            <p className="subtitle">
                                We respond within 4 hours during business hours. Or just message us on WhatsApp for instant assistance.
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-2 gap-6">
                            {contactInfo.map((info, i) => (
                                <div key={i} className="glass-panel p-8 text-center sm:text-left shadow-soft-xl hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-4">
                                        <info.icon className="w-6 h-6 text-saffron" />
                                    </div>
                                    <div className="text-earth/50 text-xs font-bold uppercase tracking-widest mb-1">{info.label}</div>
                                    {info.href ? (
                                        <a href={info.href} className="text-earth font-bold text-lg hover:text-saffron transition-colors block">{info.value}</a>
                                    ) : (
                                        <span className="text-earth font-bold text-lg block">{info.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Form + FAQ side by side ===== */}
            <section className="section-padding relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Form area */}
                        <div className="lg:col-span-7">
                            <div className="glass-panel p-10 md:p-14 bg-white/80 shadow-soft-2xl border-white relative overflow-hidden">
                                {/* Subtle internal glow */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-saffron/10 rounded-full mix-blend-multiply filter blur-[80px]" />

                                <h2 className="heading-lg text-earth mb-8 relative z-10">Send a Message</h2>

                                {submitted ? (
                                    <div className="text-center py-10 relative z-10">
                                        <div className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-12 h-12 text-saffron" />
                                        </div>
                                        <h3 className="heading-lg text-earth mb-4">Message Sent!</h3>
                                        <p className="subtitle mx-auto">We'll respond within 4 hours during business hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-earth/70 mb-2">Full Name *</label>
                                                <input type="text" required className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-2xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-earth/70 mb-2">Email *</label>
                                                <input type="email" required className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-2xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-earth/70 mb-2">Phone</label>
                                                <input type="tel" className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-2xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-earth/70 mb-2">Subject</label>
                                                <input type="text" className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-2xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-earth/70 mb-2">Message *</label>
                                            <textarea rows="5" required className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-earth/10 rounded-2xl text-earth focus:outline-none focus:border-saffron focus:bg-white transition-all shadow-sm" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary w-full justify-center">
                                            <Send size={18} /> Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* FAQ and side content */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div className="mb-12">
                                <h2 className="heading-lg text-earth mb-8">Common Questions</h2>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="glass-card overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between p-6 text-left"
                                            >
                                                <span className="text-lg font-bold text-earth pr-8">{faq.q}</span>
                                                <div className={`w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-saffron text-white' : 'text-earth'}`}>
                                                    <ChevronDown size={20} />
                                                </div>
                                            </button>
                                            {openFaq === i && (
                                                <div className="px-6 pb-6 animate-fade-in">
                                                    <p className="text-earth/70 font-medium leading-relaxed">{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WhatsApp Callout */}
                            <div className="glass-panel p-8 bg-gradient-to-br from-[#128C7E]/10 to-[#25D366]/5 border-[#25D366]/20 shadow-[0_20px_40px_rgba(37,211,102,0.1)] text-center">
                                <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#25D366]/30 animate-float-delayed">
                                    <MessageCircle className="w-8 h-8 text-white fill-white" />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-earth mb-3">Prefer WhatsApp?</h3>
                                <p className="text-earth/60 font-medium mb-6">Get instant responses during business hours for quick quotes and queries.</p>
                                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-bold transition-all duration-300 hover:bg-[#128C7E] hover:shadow-lg hover:-translate-y-1">
                                    <MessageCircle size={20} /> Chat Now
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
