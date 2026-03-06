import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Handshake, ArrowRight } from 'lucide-react';

const About = () => {
    useEffect(() => {
        document.title = "About | SDHC";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-cream min-h-screen">
            {/* ===== Full-bleed hero with overlay text ===== */}
            <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
                <div className="absolute top-20 left-10 w-96 h-96 bg-saffron/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />

                <div className="relative max-w-5xl mx-auto px-6 sm:px-12 lg:px-20 z-10 text-center">
                    <div className="tag-modern mb-8 mx-auto">Since 2009</div>
                    <h1 className="heading-xl text-earth mb-6">
                        Rooted in <span className="text-saffron italic">Tradition</span>,<br />
                        Built on Trust
                    </h1>
                    <p className="subtitle mx-auto">
                        SDHC was born from a simple belief: Ayurvedic practitioners deserve raw materials as pure as the science they practice.
                    </p>
                </div>
            </section>

            {/* ===== Story: bento and glass cards ===== */}
            <section className="section-padding relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                    {/* Block 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
                        <div className="order-2 lg:order-1 glass-panel p-10 lg:p-16">
                            <span className="text-saffron font-bold text-sm tracking-widest uppercase mb-4 block">The Beginning</span>
                            <h2 className="heading-lg text-earth mb-6">A Gap in the Supply Chain</h2>
                            <p className="text-earth/70 text-lg leading-relaxed mb-6">
                                In 2009, our founder Dr. S. Hariharan noticed that Ayurvedic clinics across Kerala were struggling with inconsistent herb quality. Suppliers prioritized volume over purity, and there was no reliable way to verify what practitioners were receiving.
                            </p>
                            <p className="text-earth/70 text-lg leading-relaxed">
                                SDHC was started to fix this. We built direct relationships with cultivators, set up in-house testing, and committed to pharmaceutical-grade standards for every single batch.
                            </p>
                        </div>
                        <div className="order-1 lg:order-2 relative h-[500px] rounded-4xl overflow-hidden shadow-soft-2xl border-4 border-white">
                            <img src="https://images.unsplash.com/photo-1606326608690-4e0281b1e588?auto=format&fit=crop&q=80" alt="Herb sourcing" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                        </div>
                    </div>

                    {/* Block 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] rounded-4xl overflow-hidden shadow-soft-2xl border-4 border-white">
                            <img src="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80" alt="Lab testing" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                        </div>
                        <div className="glass-panel p-10 lg:p-16">
                            <span className="text-teal font-bold text-sm tracking-widest uppercase mb-4 block">Today</span>
                            <h2 className="heading-lg text-earth mb-6">A Trusted Name Across 18 States</h2>
                            <p className="text-earth/70 text-lg leading-relaxed mb-6">
                                Today, SDHC supplies over 300 clinical-grade Ayurvedic raw materials to 500+ practitioners, hospitals, and formulation houses across India.
                            </p>
                            <p className="text-earth/70 text-lg leading-relaxed">
                                Our GMP-certified facility in Kerala processes, tests, and packages every product under strict quality controls. Every batch ships with a Certificate of Analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Mission: Glassmorphic cards ===== */}
            <section className="section-padding relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
                    <div className="text-center mb-20 animate-fade-in-up">
                        <h2 className="heading-lg text-earth mb-4">What Drives <span className="text-saffron italic">Us</span></h2>
                        <p className="subtitle mx-auto">Three pillars that define everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: 'Purity First', desc: 'Every decision starts with one question: is this the purest we can offer? If not, we go back to the source.', color: 'text-saffron', bg: 'bg-saffron/10' },
                            { icon: Heart, title: 'Practitioner-Centric', desc: 'We are not a marketplace. We are built exclusively for Ayurvedic professionals who need clinical-grade reliability.', color: 'text-teal', bg: 'bg-teal/10' },
                            { icon: Handshake, title: 'Ethical Sourcing', desc: 'Fair wages for cultivators, sustainable harvesting practices, and complete supply chain transparency.', color: 'text-gold-600', bg: 'bg-gold/10' },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-10 text-center group hover:-translate-y-2">
                                <div className={`w-20 h-20 rounded-[2rem] ${item.bg} flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <item.icon className={`w-10 h-10 ${item.color}`} />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-earth mb-4">{item.title}</h3>
                                <p className="text-earth/60 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Numbers ===== */}
            <section className="py-20 bg-white relative">
                <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="glass-panel p-12 bg-cream/50 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-earth/10">
                        {[
                            { num: '500+', label: 'Practitioners Served' },
                            { num: '300+', label: 'Products' },
                            { num: '18', label: 'States Covered' },
                            { num: '15+', label: 'Years Experience' },
                        ].map((s, i) => (
                            <div key={i} className="text-center px-4">
                                <div className="font-display text-4xl sm:text-6xl font-bold text-earth mb-2">{s.num}</div>
                                <div className="text-earth/50 font-bold uppercase tracking-widest text-xs">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="section-padding">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="heading-lg text-earth mb-6">Want to Know More?</h2>
                    <p className="subtitle mx-auto mb-10">We welcome visits to our facility. Come see how your herbs are sourced, tested, and processed.</p>
                    <Link to="/contact" className="btn-primary">
                        Get in Touch <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
