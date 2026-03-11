import React, { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminLogin = () => {
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

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
                authLogin(data.token, data.username);
                navigate('/admin');
            } else {
                setErrorMsg(data.message || 'Invalid credentials');
            }
        } catch {
            setErrorMsg('Server unavailable. Please try again later.');
        }
        setIsLoggingIn(false);
    };

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
};

export default AdminLogin;
