import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminInquiries = ({ authHeaders, showTempMessage }) => {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await fetch(`${API_BASE}/inquiries`, { headers: authHeaders() });
            if (res.ok) {
                setInquiries(await res.json());
            } else {
                showTempMessage('Failed to load inquiries', true);
            }
        } catch (err) {
            showTempMessage('Network error fetching inquiries', true);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="heading-lg text-earth">Customer Inquiries <span className="text-saffron">({inquiries.length})</span></h2>
            </div>

            <div className="glass-card overflow-hidden bg-white/50 shadow-soft-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-earth/10 bg-white/80">
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Material Required</th>
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Quantity</th>
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Message</th>
                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-earth/5">
                            {inquiries.map(inquiry => (
                                <tr key={inquiry._id} className="hover:bg-white/80 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-earth">{inquiry.name}</div>
                                        {inquiry.organization && <div className="text-xs text-earth/60">{inquiry.organization}</div>}
                                    </td>
                                    <td className="px-6 py-5 text-sm">
                                        <div className="text-earth">{inquiry.phone}</div>
                                        <div className="text-earth/60">{inquiry.email}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-cream rounded-xl text-xs font-bold text-earth/70 shadow-sm border border-earth/5">{inquiry.materialRequired}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-earth">{inquiry.quantity}</td>
                                    <td className="px-6 py-5 text-sm text-earth/80 max-w-xs truncate" title={inquiry.message}>{inquiry.message || '-'}</td>
                                    <td className="px-6 py-5 text-xs text-earth/60 font-bold">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {inquiries.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-earth/50 font-bold">No inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInquiries;
