import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(); //context creation (empty object)

export const useAuth = () => { //convenience hook
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => { //provider component
    const [user, setUser] = useState(null); //contiene user state
    const [loading, setLoading] = useState(true); //loading prevents children from rendering until /auth/me check completes

    useEffect(() => {
        // Fetch current session from the backend logic
        const checkAuthStatus = async () => { // session persistence check on app load
            try {
                // This endpoint will return the user data if the session exists
                const response = await api.get('/auth/me');
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                // If 401 or not logged in, user remains null
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    //used in /pages/Login.jsx
    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password }); //Axios POST request
        setUser(response.data.user); //updates global React Context state (components with useAuth())
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        // Sometimes backend logs in immediately, or we just rely on redirect
        return response.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null); //clears React state. all protected routes immediately redirect to login
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}> 
            {!loading && children} //check complete
        </AuthContext.Provider>
    );
};
