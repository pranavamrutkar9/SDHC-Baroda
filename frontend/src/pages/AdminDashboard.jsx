import React, { useState } from 'react';
import { LogOut, Users, Package, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminProducts from '../components/admin/AdminProducts';
import AdminUsers from '../components/admin/AdminUsers';
import AdminInquiries from '../components/admin/AdminInquiries';

const AdminDashboard = () => {
    const { currentAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'admins' | 'inquiries'

    const navigate = useNavigate();

    // Global State for messages
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const authHeaders = () => {
        const token = localStorage.getItem('sdhc_admin_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrorMsg('');
        setSuccessMsg('');
    };

    const showTempMessage = (msg, isError = false) => {
        if (isError) {
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(''), 5000);
        } else {
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(''), 5000);
        }
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="glass-panel rounded-none border-x-0 border-t-0 border-b border-earth/5 bg-white/80 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-earth">Dashboard</h1>
                        <p className="text-sm font-bold text-earth/50">Logged in as: <span className="text-saffron">{currentAdmin}</span></p>
                    </div>

                    <div className="flex bg-white/50 p-1.5 rounded-full border border-earth/5 shadow-sm">
                        <button onClick={() => handleTabChange('products')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white text-saffron shadow-sm' : 'text-earth/60 hover:text-earth'}`}>
                            <div className="flex items-center gap-2"><Package size={16} /> Products</div>
                        </button>
                        <button onClick={() => handleTabChange('admins')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'admins' ? 'bg-white text-saffron shadow-sm' : 'text-earth/60 hover:text-earth'}`}>
                            <div className="flex items-center gap-2"><Users size={16} /> Admins</div>
                        </button>
                        <button onClick={() => handleTabChange('inquiries')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'inquiries' ? 'bg-white text-saffron shadow-sm' : 'text-earth/60 hover:text-earth'}`}>
                            <div className="flex items-center gap-2"><ClipboardList size={16} /> Inquiries</div>
                        </button>
                    </div>

                    <button onClick={handleLogoutClick} className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12">
                {errorMsg && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 font-bold text-sm border border-red-100">{errorMsg}</div>}
                {successMsg && <div className="mb-6 p-4 rounded-xl bg-teal/10 text-teal font-bold text-sm border border-teal/20">{successMsg}</div>}

                {/* --- Content Tabs --- */}
                {activeTab === 'products' && <AdminProducts authHeaders={authHeaders} showTempMessage={showTempMessage} />}
                {activeTab === 'admins' && <AdminUsers authHeaders={authHeaders} showTempMessage={showTempMessage} />}
                {activeTab === 'inquiries' && <AdminInquiries authHeaders={authHeaders} showTempMessage={showTempMessage} />}
            </div>
        </div>
    );
};

export default AdminDashboard;
