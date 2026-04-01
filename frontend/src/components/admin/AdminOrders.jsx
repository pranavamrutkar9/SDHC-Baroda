import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ChevronDown, RefreshCw, Filter } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
    Pending:    { color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock,         dot: 'bg-amber-400' },
    Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200',      icon: Package,       dot: 'bg-blue-400' },
    Shipped:    { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck,         dot: 'bg-purple-400' },
    Delivered:  { color: 'bg-teal-50 text-teal border-teal/30',           icon: CheckCircle2,  dot: 'bg-teal-400' },
    Cancelled:  { color: 'bg-red-50 text-red-600 border-red-200',         icon: XCircle,       dot: 'bg-red-400' },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || {};
    const Icon = cfg.icon || Clock;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${cfg.color}`}>
            <Icon size={12} /> {status}
        </span>
    );
};

const AdminOrders = ({ authHeaders, showTempMessage }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [updatingId, setUpdatingId] = useState(null);

    const LIMIT = 15;

    useEffect(() => { fetchOrders(); }, [filterStatus, page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: LIMIT });
            if (filterStatus !== 'All') params.append('status', filterStatus);
            const res = await fetch(`${API_BASE}/orders?${params}`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
                setTotal(data.total);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ orderStatus: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
                showTempMessage(`Order status updated to "${newStatus}"`);
            } else {
                showTempMessage('Failed to update status', true);
            }
        } catch {
            showTempMessage('Network error', true);
        } finally {
            setUpdatingId(null);
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="heading-lg text-earth">Orders <span className="text-saffron">({total})</span></h2>
                    <p className="text-earth/40 font-medium text-sm mt-1">Manage and update order statuses</p>
                </div>
                <button onClick={fetchOrders}
                    className="btn-secondary !py-2.5 !px-5 flex items-center gap-2 text-sm">
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
                <Filter size={14} className="text-earth/40" />
                {ALL_STATUSES.map(status => (
                    <button key={status}
                        onClick={() => { setFilterStatus(status); setPage(1); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${filterStatus === status
                            ? 'bg-earth text-white border-earth'
                            : 'bg-white/60 text-earth/60 border-earth/10 hover:border-earth/30 hover:text-earth'}`}>
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden bg-white/50 shadow-soft-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-earth/10 bg-white/80">
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-earth/40 uppercase tracking-widest">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-earth/5">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-6 py-5">
                                                <div className="h-3 bg-earth/8 rounded-full animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <Package className="mx-auto text-earth/20 mb-3" size={36} />
                                        <p className="text-earth/40 font-bold">No orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order._id} className="hover:bg-white/70 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs font-bold text-earth">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-earth/40 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-earth">{order.user?.name || '—'}</p>
                                            <p className="text-earth/50 text-xs">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-earth">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</p>
                                            <p className="text-earth/50 text-xs truncate max-w-[140px]">
                                                {order.orderItems.map(i => i.name).join(', ')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-display font-bold text-earth">₹{order.totalPrice?.toFixed(2)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${order.isPaid ? 'bg-teal/10 text-teal border-teal/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                {order.isPaid ? '✓ Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.orderStatus} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select
                                                    disabled={updatingId === order._id}
                                                    value={order.orderStatus}
                                                    onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-earth/10 rounded-xl text-xs font-bold text-earth shadow-sm cursor-pointer hover:border-saffron/50 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron/20 disabled:opacity-50"
                                                >
                                                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-earth/40 pointer-events-none" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-earth/5 flex items-center justify-between bg-white/40">
                        <p className="text-xs text-earth/40 font-medium">
                            Page {page} of {totalPages} · {total} total orders
                        </p>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-earth/60 bg-white border border-earth/10 hover:border-earth/30 disabled:opacity-30 transition-all">
                                ← Prev
                            </button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-earth/60 bg-white border border-earth/10 hover:border-earth/30 disabled:opacity-30 transition-all">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
