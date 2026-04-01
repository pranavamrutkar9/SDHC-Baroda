import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoggedIn } = useUserAuth();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Login | SDHC';
        if (isLoggedIn) navigate('/profile');
    }, [isLoggedIn]);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            login(data.token, data.user);
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-sage flex items-center justify-center shadow-colored-sage">
                            <span className="text-white font-display text-2xl font-bold">ॐ</span>
                        </div>
                        <span className="text-3xl font-display font-bold text-earth">
                            SD<span className="text-saffron">HC</span>
                        </span>
                    </Link>
                    <h1 className="mt-4 text-2xl font-display font-bold text-earth">Welcome back</h1>
                    <p className="text-earth/50 font-medium mt-1">Sign in to your account</p>
                </div>

                <div className="glass-panel p-8 rounded-3xl">
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-earth/70">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth/30" size={18} />
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/70 border border-white/80 rounded-2xl text-earth font-medium placeholder:text-earth/30 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-earth/70">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth/30" size={18} />
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/70 border border-white/80 rounded-2xl text-earth font-medium placeholder:text-earth/30 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-earth/30 hover:text-earth/60 transition-colors"
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? 'Signing in...' : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-earth/50 font-medium text-sm">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="text-saffron font-bold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-earth/40 text-xs font-semibold">
                        <Leaf size={14} className="text-sage" /> 100% Natural Products
                    </div>
                    <div className="w-px h-4 bg-earth/10" />
                    <div className="flex items-center gap-2 text-earth/40 text-xs font-semibold">
                        🔒 Secure Login
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
