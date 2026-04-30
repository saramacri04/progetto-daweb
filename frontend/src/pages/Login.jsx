import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <div className="card auth-card">
                <div className="card-header bg-white pb-0 border-0 pt-4">
                    <h3 className="mb-0 fw-bold text-success">Welcome Back!</h3>
                    <p className="text-muted mt-2">Log in to your EcoMarket account</p>
                </div>
                <div className="card-body pt-3">
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">Email</label>
                            <input 
                                type="email" 
                                className="form-control bg-light border-0" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary">Password</label>
                            <input 
                                type="password" 
                                className="form-control bg-light border-0" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : 'Log In'}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/register" className="text-success fw-semibold text-decoration-none">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
