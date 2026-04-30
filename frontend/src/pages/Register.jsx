import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                password: formData.password
            });
            setSuccessMsg('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <div className="card auth-card">
                <div className="card-header bg-white pb-0 border-0 pt-4">
                    <h3 className="mb-0 fw-bold text-success">Create an Account</h3>
                    <p className="text-muted mt-2">Join the EcoMarket community</p>
                </div>
                <div className="card-body pt-3">
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-secondary">First Name</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-light border-0" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-secondary">Last Name</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-light border-0" 
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">Email</label>
                            <input 
                                type="email" 
                                className="form-control bg-light border-0" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">Password</label>
                            <input 
                                type="password" 
                                className="form-control bg-light border-0" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary">Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control bg-light border-0" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading || successMsg}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : 'Sign Up'}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="text-success fw-semibold text-decoration-none">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
