import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/favicon.png" alt="EcoMarket Logo" height="36" className="me-2 rounded object-fit-contain" />
                    EcoMarket
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                                to="/"
                            >
                                Catalog
                            </Link>
                        </li>
                        
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                                        to="/dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                    <div className="d-flex align-items-center">
                                        <span className="me-3 text-muted fw-500 d-none d-lg-block">
                                            Hi, {user.name || user.email || 'User'}
                                        </span>
                                        <button className="btn btn-outline-custom" onClick={logout}>
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                    <Link className="btn btn-outline-custom w-100" to="/login">
                                        Log In
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                                    <Link className="btn btn-primary-custom w-100" to="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
