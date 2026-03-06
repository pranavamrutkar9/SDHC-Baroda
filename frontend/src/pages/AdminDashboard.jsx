import React, { useState, useEffect } from 'react';
import { LogIn, Plus, Edit, Trash2, LogOut, Leaf, Loader2, Key, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'admins'

    const navigate = useNavigate();

    // Product State
    const [products, setProducts] = useState([]);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);

    // Admin State
    const [admins, setAdmins] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [adminFormType, setAdminFormType] = useState('create'); // 'create' | 'username' | 'password'
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [adminFormData, setAdminFormData] = useState({ username: '', password: '', newPassword: '', currentPassword: '' });

    // Global State
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const initialProductFormState = {
        name: '', botanicalName: '', sanskritName: '', category: 'Raw Herbs',
        partUsed: '', forms: '', description: '', uses: '', sizes: '',
        bulkAvailability: true, imageUrl: ''
    };
    const [productFormData, setProductFormData] = useState(initialProductFormState);

    const authHeaders = () => {
        const token = localStorage.getItem('sdhc_admin_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('sdhc_admin_token');
            if (!token) { setIsLoading(false); return; }
            try {
                const res = await fetch(`${API_BASE}/admin/me`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(true);
                    setCurrentAdmin(data.username);
                    fetchProducts();
                } else {
                    localStorage.removeItem('sdhc_admin_token');
                }
            } catch {
                localStorage.removeItem('sdhc_admin_token');
            }
            setIsLoading(false);
        };
        verifyToken();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            if (res.ok) setProducts(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/all`, { headers: authHeaders() });
            if (res.ok) {
                setAdmins(await res.json());
            } else {
                setErrorMsg('Failed to load admins');
            }
        } catch (err) {
            setErrorMsg('Network error fetching admins');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrorMsg('');
        setSuccessMsg('');
        setShowProductForm(false);
        setShowAdminForm(false);
        if (tab === 'admins') fetchAdmins();
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

    // --- Authentication --- //
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('sdhc_admin_token', data.token);
                setIsAuthenticated(true);
                setCurrentAdmin(data.username);
                fetchProducts();
            } else {
                setErrorMsg(data.message || 'Invalid credentials');
            }
        } catch {
            setErrorMsg('Server unavailable. Please try again later.');
        }
        setIsLoggingIn(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('sdhc_admin_token');
        setIsAuthenticated(false);
        setProducts([]);
        setAdmins([]);
        navigate('/');
    };

    // --- Product Management --- //
    const openAddProduct = () => { setProductFormData(initialProductFormState); setIsEditingProduct(false); setShowProductForm(true); setErrorMsg(''); };
    const openEditProduct = (product) => {
        setProductFormData({
            ...product,
            forms: Array.isArray(product.forms) ? product.forms.join(', ') : product.forms || '',
            sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || ''
        });
        setCurrentProduct(product); setIsEditingProduct(true); setShowProductForm(true); setErrorMsg('');
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                showTempMessage('Product deleted');
            }
        } catch (err) { console.error('Delete failed:', err); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const formatted = {
            ...productFormData,
            forms: productFormData.forms.split(',').map(s => s.trim()).filter(Boolean),
            sizes: productFormData.sizes.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            const url = isEditingProduct ? `${API_BASE}/products/${currentProduct._id}` : `${API_BASE}/products`;
            const method = isEditingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(formatted) });
            if (res.ok) {
                const saved = await res.json();
                if (isEditingProduct) setProducts(products.map(p => p._id === currentProduct._id ? saved : p));
                else setProducts([saved, ...products]);
                setShowProductForm(false);
                showTempMessage(isEditingProduct ? 'Product updated' : 'Product created');
            } else {
                showTempMessage('Failed to save product', true);
            }
        } catch (err) { showTempMessage('Network error saving product', true); }
    };

    // --- Admin Management --- //
    const openAdminModal = (type, adminId = null) => {
        setAdminFormType(type);
        setSelectedAdminId(adminId);
        setAdminFormData({ username: '', password: '', newPassword: '', currentPassword: '' });
        setShowAdminForm(true);
        setErrorMsg('');
    };

    const handleSaveAdmin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            let res;
            if (adminFormType === 'create') {
                res = await fetch(`${API_BASE}/admin/create`, {
                    method: 'POST', headers: authHeaders(),
                    body: JSON.stringify({ username: adminFormData.username, password: adminFormData.password })
                });
            } else if (adminFormType === 'username') {
                res = await fetch(`${API_BASE}/admin/${selectedAdminId}/username`, {
                    method: 'PUT', headers: authHeaders(),
                    body: JSON.stringify({ newUsername: adminFormData.username })
                });
            } else if (adminFormType === 'password') {
                res = await fetch(`${API_BASE}/admin/${selectedAdminId}/password`, {
                    method: 'PUT', headers: authHeaders(),
                    body: JSON.stringify({ currentPassword: adminFormData.currentPassword, newPassword: adminFormData.newPassword })
                });
            }

            const data = await res.json();
            if (res.ok) {
                showTempMessage(data.message);
                setShowAdminForm(false);
                fetchAdmins();
                // If they changed their own username, update current Admin state
                if (adminFormType === 'username' && data.admin.username !== currentAdmin) {
                    const meRes = await fetch(`${API_BASE}/admin/me`, { headers: authHeaders() });
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        setCurrentAdmin(meData.username);
                    }
                }
            } else {
                setErrorMsg(data.message || 'Operation failed');
            }
        } catch (err) {
            setErrorMsg('Network error occurred.');
        }
    };

    const handleDeleteAdmin = async (id, username) => {
        if (admins.length <= 1) {
            showTempMessage('Cannot delete the only remaining admin.', true);
            return;
        }
        if (username === currentAdmin) {
            if (!window.confirm("You are about to delete your own account! You will be logged out immediately. Are you sure?")) return;
        } else {
            if (!window.confirm(`Delete admin user "${username}"?`)) return;
        }

        try {
            const res = await fetch(`${API_BASE}/admin/${id}`, { method: 'DELETE', headers: authHeaders() });
            const data = await res.json();
            if (res.ok) {
                if (username === currentAdmin) {
                    handleLogout();
                } else {
                    showTempMessage('Admin deleted');
                    fetchAdmins();
                }
            } else {
                showTempMessage(data.message || 'Failed to delete admin', true);
            }
        } catch (err) { showTempMessage('Network error', true); }
    };

    if (isLoading) return <div className="min-h-screen pt-32 flex items-center justify-center bg-cream"><Loader2 className="w-10 h-10 text-saffron animate-spin" /></div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-6 bg-cream relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
                <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                    <div className="glass-panel p-10 bg-white/70 shadow-soft-2xl border-white relative overflow-hidden text-center">
                        <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-6">
                            <LogIn className="w-10 h-10 text-saffron" />
                        </div>
                        <h2 className="heading-lg text-earth mb-2">Admin Auth</h2>

                        {errorMsg && <div className="rounded-2xl p-4 mb-6 bg-red-50 text-red-500 font-bold text-sm shadow-sm">{errorMsg}</div>}

                        <form onSubmit={handleLogin} className="space-y-5 text-left">
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Username</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron focus:bg-white shadow-sm" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Password</label>
                                <input type="password" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron focus:bg-white shadow-sm" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center flex items-center gap-2 mt-2" disabled={isLoggingIn}>
                                {isLoggingIn ? <><Loader2 size={18} className="animate-spin" /> Authorizing</> : 'Secure Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

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
                    </div>

                    <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12">
                {errorMsg && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 font-bold text-sm border border-red-100">{errorMsg}</div>}
                {successMsg && <div className="mb-6 p-4 rounded-xl bg-teal/10 text-teal font-bold text-sm border border-teal/20">{successMsg}</div>}

                {/* --- Admins Tab --- */}
                {activeTab === 'admins' && (
                    <div className="animate-fade-in-up">
                        {!showAdminForm ? (
                            <>
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                    <h2 className="heading-lg text-earth">Admin Users</h2>
                                    {currentAdmin === 'admin' && (
                                        <button className="btn-primary !py-2.5 flex items-center gap-2" onClick={() => openAdminModal('create')}>
                                            <Plus size={18} /> New Admin
                                        </button>
                                    )}
                                </div>
                                <div className="glass-card overflow-hidden bg-white/50 shadow-soft-xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-earth/10 bg-white/80">
                                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Username</th>
                                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-earth/5">
                                            {admins.map(admin => (
                                                <tr key={admin._id} className="hover:bg-white/80 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-earth text-lg">
                                                        {admin.username} {admin.username === currentAdmin && <span className="ml-2 text-xs font-bold text-teal bg-teal/10 px-2 py-1 rounded-lg">You</span>}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-saffron/10 rounded-xl text-xs font-bold text-saffron shadow-sm border border-saffron/20">Active</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end gap-3">
                                                            {admin.username === currentAdmin && (
                                                                <>
                                                                    <button onClick={() => openAdminModal('username', admin._id)} className="px-3 py-1.5 rounded-lg bg-white flex items-center gap-2 text-xs font-bold text-teal shadow-soft-sm hover:-translate-y-0.5 transition-transform border border-earth/5">
                                                                        <Edit size={14} /> Username
                                                                    </button>
                                                                    <button onClick={() => openAdminModal('password', admin._id)} className="px-3 py-1.5 rounded-lg bg-white flex items-center gap-2 text-xs font-bold text-maroon shadow-soft-sm hover:-translate-y-0.5 transition-transform border border-earth/5">
                                                                        <Key size={14} /> Password
                                                                    </button>
                                                                </>
                                                            )}
                                                            {(currentAdmin === 'admin' || admin.username === currentAdmin) && (
                                                                <button onClick={() => handleDeleteAdmin(admin._id, admin.username)} className={`px-3 py-1.5 rounded-lg bg-white flex items-center gap-2 text-xs font-bold shadow-soft-sm transition-transform border border-earth/5 ${(admins.length <= 1 || admin.username === 'admin') ? 'opacity-50 cursor-not-allowed text-earth/30' : 'text-red-500 hover:-translate-y-0.5'}`} disabled={admins.length <= 1 || admin.username === 'admin'}>
                                                                    <Trash2 size={14} /> Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel p-10 bg-white/80 shadow-soft-2xl border-white relative max-w-lg mx-auto">
                                <h2 className="heading-lg text-earth mb-6">
                                    {adminFormType === 'create' ? 'Create Admin' : adminFormType === 'username' ? 'Change Username' : 'Change Password'}
                                </h2>
                                <form onSubmit={handleSaveAdmin} className="space-y-6">
                                    {(adminFormType === 'create' || adminFormType === 'username') && (
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Username</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron focus:bg-white shadow-sm" required value={adminFormData.username} onChange={e => setAdminFormData({ ...adminFormData, username: e.target.value })} />
                                        </div>
                                    )}
                                    {adminFormType === 'password' && (
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Current Password</label>
                                            <input type="password" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron focus:bg-white shadow-sm" required value={adminFormData.currentPassword} onChange={e => setAdminFormData({ ...adminFormData, currentPassword: e.target.value })} />
                                        </div>
                                    )}
                                    {(adminFormType === 'create' || adminFormType === 'password') && (
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">{adminFormType === 'create' ? 'Password' : 'New Password'}</label>
                                            <input type="password" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron focus:bg-white shadow-sm" required value={adminFormType === 'create' ? adminFormData.password : adminFormData.newPassword} onChange={e => setAdminFormData({ ...adminFormData, [adminFormType === 'create' ? 'password' : 'newPassword']: e.target.value })} />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="submit" className="btn-primary flex-1">Save Changes</button>
                                        <button type="button" onClick={() => setShowAdminForm(false)} className="btn-secondary flex-1">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Products Tab --- */}
                {activeTab === 'products' && (
                    <div className="animate-fade-in-up">
                        {!showProductForm ? (
                            <>
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                    <h2 className="heading-lg text-earth">Inventory <span className="text-saffron">({products.length})</span></h2>
                                    <button className="btn-primary !py-2.5 flex items-center gap-2" onClick={openAddProduct}>
                                        <Plus size={18} /> Add Product
                                    </button>
                                </div>

                                <div className="glass-card overflow-hidden bg-white/50 shadow-soft-xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-earth/10 bg-white/80">
                                                    <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Product Details</th>
                                                    <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Category</th>
                                                    <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Status</th>
                                                    <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-earth/5">
                                                {products.map(product => (
                                                    <tr key={product._id} className="hover:bg-white/80 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-[1rem] overflow-hidden shrink-0 shadow-sm border border-earth/5 bg-cream flex items-center justify-center">
                                                                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <Leaf size={20} className="text-earth/20" />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-display font-bold text-earth text-lg mb-1">{product.name}</div>
                                                                    <div className="text-xs font-bold text-earth/40 italic">{product.botanicalName}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1 bg-cream rounded-xl text-xs font-bold text-earth/70 shadow-sm border border-earth/5">{product.category}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${product.bulkAvailability ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                                                                {product.bulkAvailability ? 'Available' : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <button onClick={() => openEditProduct(product)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal shadow-soft-sm hover:-translate-y-1 transition-transform" title="Edit"><Edit size={16} /></button>
                                                                <button onClick={() => handleDeleteProduct(product._id)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-soft-sm hover:-translate-y-1 transition-transform" title="Delete"><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel p-10 bg-white/80 shadow-soft-2xl border-white relative">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-earth/10 pb-6">
                                    <h2 className="heading-lg text-earth">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                    <button className="btn-secondary !py-2" onClick={() => setShowProductForm(false)}>Cancel Edit</button>
                                </div>
                                <form onSubmit={handleSaveProduct} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Product Name *</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron shadow-sm" required value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Category *</label>
                                            <select className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron shadow-sm" value={productFormData.category} onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}>
                                                <option value="Raw Herbs">Raw Herbs</option>
                                                <option value="Herbal Powders">Herbal Powders</option>
                                                <option value="Extracts">Extracts</option>
                                                <option value="Oils & Resins">Oils & Resins</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Botanical Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.botanicalName} onChange={e => setProductFormData({ ...productFormData, botanicalName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Sanskrit Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.sanskritName} onChange={e => setProductFormData({ ...productFormData, sanskritName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Part Used</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.partUsed} onChange={e => setProductFormData({ ...productFormData, partUsed: e.target.value })} placeholder="e.g. Root, Leaf" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Available Forms</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.forms} onChange={e => setProductFormData({ ...productFormData, forms: e.target.value })} placeholder="Comma separated" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Description</label>
                                        <textarea className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" rows="3" value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Traditional Uses</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.uses} onChange={e => setProductFormData({ ...productFormData, uses: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Pack Sizes</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.sizes} onChange={e => setProductFormData({ ...productFormData, sizes: e.target.value })} placeholder="Comma separated" />
                                        </div>
                                    </div>
                                    <div className="glass-card p-4 mt-4 inline-block">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={productFormData.bulkAvailability} onChange={e => setProductFormData({ ...productFormData, bulkAvailability: e.target.checked })} className="w-5 h-5 rounded accent-saffron" />
                                            <span className="text-sm text-earth font-bold uppercase tracking-widest">Available for Bulk Supply</span>
                                        </label>
                                    </div>
                                    <div className="border-t border-earth/10 pt-6 mt-6">
                                        <button type="submit" className="btn-primary w-full sm:w-auto px-8">
                                            {isEditingProduct ? 'Update Product Details' : 'Publish Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
