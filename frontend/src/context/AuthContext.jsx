import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('sdhc_admin_token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`${API_BASE}/admin/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(true);
                    setCurrentAdmin(data.username);
                } else {
                    localStorage.removeItem('sdhc_admin_token');
                }
            } catch (error) {
                localStorage.removeItem('sdhc_admin_token');
            }
            setIsLoading(false);
        };
        verifyToken();
    }, [API_BASE]);

    const login = (token, username) => {
        localStorage.setItem('sdhc_admin_token', token);
        setIsAuthenticated(true);
        setCurrentAdmin(username);
    };

    const logout = () => {
        localStorage.removeItem('sdhc_admin_token');
        setIsAuthenticated(false);
        setCurrentAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentAdmin, setCurrentAdmin, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
