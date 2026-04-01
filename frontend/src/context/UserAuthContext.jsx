import React, { createContext, useContext, useState, useEffect } from 'react';

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const TOKEN_KEY = 'sdhc_user_token';

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) { setIsLoading(false); return; }
            try {
                const res = await fetch(`${API_BASE}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem(TOKEN_KEY);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);
            }
            setIsLoading(false);
        };
        init();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem(TOKEN_KEY, token);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setIsLoggedIn(false);
    };

    const getToken = () => localStorage.getItem(TOKEN_KEY);

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
    });

    return (
        <UserAuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, getToken, authHeaders, setUser }}>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(UserAuthContext);
