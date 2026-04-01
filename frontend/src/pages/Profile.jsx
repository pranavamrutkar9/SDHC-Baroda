import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, ChevronRight, LogOut, Package, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_CONFIG = {
    Pending:    { color: 'bg-amber-50 text-amber-600 border-amber-200',   icon: Clock },
    Processing: { color: 'bg-blue-50 text-blue-600 border-blue-200',      icon: Package },
    Shipped:    { color: 'bg-purple-50 text-purple-600 border-purple-200', icon: Truck },
    Delivered:  { color: 'bg-teal-50 text-teal border-teal/30',           icon: CheckCircle2 },
    Cancelled:  { color: 'bg-red-50 text-red-500 border-red-200',         icon: XCircle },
};

const Profile = () => {
    const { user, isLoggedIn, isLoading, logout, authHeaders } = useUserAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        document.title = 'My Profile | SDHC';
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login');
    }, [isLoggedIn, isLoading]);

    useEffect(() => {
        if (isLoggedIn) fetchOrders();
    }, [isLoggedIn]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE}/orders/myorders`, { headers: authHeaders() });
            if (res.ok) setOrders(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) return (
        <div className="min-h-screen pt-28 flex items-center justify-center bg-cream">
            <div className="text-earth/40 font-bold animate-pulse">Loading...</div>
        </div>
    );

    return (
        <div className="bg-cream min-h-screen pt-28 pb-24">
            <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-20">

                {/* Header Card */}
                <div className="glass-panel p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-sage flex items-center justify-center shadow-colored-sage shrink-0">
                        <span className="text-white font-display text-3xl font-bold uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h1 className="font-display text-3xl font-bold text-earth">{user?.name}</h1>
                        <p className="text-earth/50 font-medium">{user?.email}</p>
                        {user?.phone && <p className="text-earth/50 text-sm font-medium mt-1">{user.phone}</p>}
                    </div>
                    <button onClick={handleLogout}
                        className="btn-secondary !py-2.5 !px-5 text-sm flex items-center gap-2 shrink-0">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/50 p-1.5 rounded-full border border-white/60 shadow-sm mb-8 w-fit">
                    {[
                        { key: 'orders', label: 'My Orders', icon: ShoppingBag },
                        { key: 'account', label: 'Account', icon: User },
                    ].map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === key ? 'bg-white text-saffron shadow-sm' : 'text-earth/50 hover:text-earth'}`}>
                            <Icon size={15} /> {label}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {ordersLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="glass-card p-6 animate-pulse">
                                        <div className="h-4 bg-earth/10 rounded-full w-1/3 mb-3" />
                                        <div className="h-3 bg-earth/5 rounded-full w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="glass-panel p-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="text-saffron" size={36} />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-earth mb-3">No orders yet</h3>
                                <p className="text-earth/50 mb-8">Explore our catalog and place your first order.</p>
                                <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
                            </div>
                        ) : (
                            orders.map(order => {
                                const StatusIcon = STATUS_CONFIG[order.orderStatus]?.icon || Clock;
                                const statusColor = STATUS_CONFIG[order.orderStatus]?.color || '';
                                return (
                                    <div key={order._id} className="glass-card p-6 group hover:shadow-soft-xl transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-earth/40 uppercase tracking-wider mb-1">Order ID</p>
                                                <p className="font-mono text-sm font-bold text-earth">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusColor}`}>
                                                <StatusIcon size={12} /> {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <span className="text-earth/70 font-medium">{item.name} {item.size && `(${item.size})`} × {item.qty}</span>
                                                    <span className="text-earth font-bold">₹{(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between border-t border-earth/5 pt-4">
                                            <div>
                                                <p className="text-xs text-earth/40 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p className="text-earth font-display font-bold">Total: ₹{order.totalPrice.toFixed(2)}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.isPaid ? 'bg-teal/10 text-teal' : 'bg-amber-50 text-amber-600'}`}>
                                                {order.isPaid ? '✓ Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="glass-panel p-8">
                        <h2 className="font-display text-2xl font-bold text-earth mb-6">Account Details</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Full Name', value: user?.name },
                                { label: 'Email Address', value: user?.email },
                                { label: 'Phone', value: user?.phone || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="glass-card p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-earth/40 uppercase tracking-wider mb-1">{label}</p>
                                        <p className="text-earth font-semibold">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
