import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminUsers = ({ authHeaders, showTempMessage }) => {
    const { currentAdmin, setCurrentAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const [admins, setAdmins] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [adminFormType, setAdminFormType] = useState('create'); // 'create' | 'username' | 'password'
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [adminFormData, setAdminFormData] = useState({ username: '', password: '', newPassword: '', currentPassword: '' });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/all`, { headers: authHeaders() });
            if (res.ok) {
                setAdmins(await res.json());
            } else {
                showTempMessage('Failed to load admins', true);
            }
        } catch (err) {
            showTempMessage('Network error fetching admins', true);
        }
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    const openAdminModal = (type, adminId = null) => {
        setAdminFormType(type);
        setSelectedAdminId(adminId);
        setAdminFormData({ username: '', password: '', newPassword: '', currentPassword: '' });
        setShowAdminForm(true);
    };

    const handleSaveAdmin = async (e) => {
        e.preventDefault();

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
                showTempMessage(data.message || 'Success');
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
                showTempMessage(data.message || 'Operation failed', true);
            }
        } catch (err) {
            showTempMessage('Network error occurred.', true);
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
                    handleLogoutClick();
                } else {
                    showTempMessage('Admin deleted');
                    fetchAdmins();
                }
            } else {
                showTempMessage(data.message || 'Failed to delete admin', true);
            }
        } catch (err) { showTempMessage('Network error', true); }
    };

    return (
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
    );
};

export default AdminUsers;
