import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    const checkAuth = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/users/profile');
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/users/login', { email, password });
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('/api/users', { name, email, password });
        setUser(data);
        return data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/users/logout', {});
        } catch {
            // ignore
        }
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const { data } = await axios.put('/api/users/profile', updates);
        setUser(data);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
