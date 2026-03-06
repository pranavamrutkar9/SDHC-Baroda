import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Quality = () => {
    useEffect(() => {
        document.title = "Quality | SDHC";
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        { title: 'Source Verification', desc: 'Every cultivator and collection site is GPS-tagged and personally vetted by our sourcing team.', image: 'https://images.unsplash.com/photo-1615486171448-4fd186414757?auto=format&fit=crop&q=80' },
        { title: 'Identity Testing', desc: 'Organoleptic and TLC-based identity confirmation before any herb enters our processing line.', image: 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80' },
        { title: 'Contaminant Screening', desc: 'ICP-MS testing for heavy metals (Pb, Hg, As, Cd). Automated microbial analysis. Zero-tolerance for aflatoxins.', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80' },
        { title: 'Processing', desc: 'Shade-drying at controlled temperatures. Cool-grinding to preserve volatile compounds. CO2 extraction for concentrates.', image: 'https://images.unsplash.com/photo-1608528577891-eb05feca37bf?auto=format&fit=crop&q=80' },
        { title: 'Packaging & Dispatch', desc: 'Vacuum-sealed, food-grade packaging with batch number, manufacturing date, and Certificate of Analysis enclosed.', image: 'https://images.unsplash.com/photo-1628189855581-2b0ea2a013d5?auto=format&fit=crop&q=80' },
    ];

    const certifications = [
        'ISO 9001:2015 Certified Quality Management',
        'GMP Compliant Manufacturing Facility',
        'FSSAI Licensed Food Safety Standards',
        'AYUSH Premium Mark Eligible',
        'Certificate of Analysis with Every Batch',
        'Organic Certification (Select Products)',
    ];

    return (
        <div className="bg-cream min-h-screen">
            {/* ===== Hero ===== */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
                <div className="relative max-w-5xl mx-auto px-6 sm:px-12 lg:px-20 text-center z-10">
                    <div className="tag-modern mb-8 mx-auto">Our Standards</div>
                    <h1 className="heading-xl text-earth mb-6">
                        Pharmaceutical-Grade<br /><span className="text-saffron italic">Quality Control</span>
                    </h1>
                    <p className="subtitle mx-auto">
                        We don't just meet industry standards. Our testing protocols are modeled after pharmaceutical supply chains, not typical herb trading.
                    </p>
                </div>
            </section>

            {/* ===== Process: Floating Glass Timeline ===== */}
            <section className="section-padding relative">
                <div className="absolute top-0 bottom-0 left-[2.5rem] md:left-1/2 w-1 bg-white shadow-sm -translate-x-1/2 rounded-full hidden md:block" />

                <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20">
                    {steps.map((step, i) => (
                        <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 last:mb-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Number Bubble on Timeline */}
                            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full items-center justify-center shadow-soft-xl border-4 border-cream z-20">
                                <span className="font-display text-2xl font-bold text-saffron">{String(i + 1).padStart(2, '0')}</span>
                            </div>

                            {/* Image side */}
                            <div className="flex-1 w-full md:w-1/2">
                                <div className="relative h-[300px] md:h-[400px] rounded-4xl overflow-hidden shadow-soft-2xl border-4 border-white group">
                                    <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                            </div>

                            {/* Content side */}
                            <div className="flex-1 w-full md:w-1/2 glass-panel p-10 relative">
                                <div className="md:hidden absolute -top-5 -left-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft-xl border-4 border-cream z-20">
                                    <span className="font-display text-xl font-bold text-saffron">{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <h3 className="font-display text-3xl font-bold text-earth mb-4">{step.title}</h3>
                                <p className="text-earth/70 font-medium leading-relaxed text-lg">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Certifications ===== */}
            <section className="py-24 bg-white relative">
                <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20">
                    <div className="text-center mb-16">
                        <h2 className="heading-lg text-earth mb-4">Certifications & Compliance</h2>
                        <p className="subtitle mx-auto">Standards we hold ourselves to.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, i) => (
                            <div key={i} className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1">
                                <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-saffron" />
                                </div>
                                <span className="text-earth font-bold mt-1 text-sm md:text-base leading-tight">{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="section-padding">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="glass-panel p-16 bg-gradient-to-br from-white/90 to-saffron/5 shadow-colored-sage border-saffron/20">
                        <h2 className="heading-lg text-earth mb-6">Request a Sample</h2>
                        <p className="subtitle mx-auto mb-10">Judge our quality yourself. We offer evaluation samples for new clients to verify our strict standards.</p>
                        <Link to="/contact" className="btn-primary">
                            Contact Us <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Quality;
