import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="fixed-top">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                            <img src="/favicon.png" alt="EcoMarket Logo" height="32" className="me-2 rounded object-fit-contain" />
                            EcoMarket
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Catalog</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Log In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow-1" style={{ marginTop: '70px' }}>
                <Outlet />
            </main>

            <footer className="bg-light text-center py-3 mt-auto">
                <div className="container">
                    <p className="mb-0 text-muted">&copy; 2026 EcoMarket - DAWeb Project</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
