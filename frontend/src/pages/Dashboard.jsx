import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mt-5">
            <h2>User Dashboard</h2>
            <p>Welcome, {user?.name || user?.email || 'User'}!</p>
            <p>This is a protected route. Only logged-in users can see this.</p>
            <button className="btn btn-danger mt-3" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
