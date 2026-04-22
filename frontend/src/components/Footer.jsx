import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="custom-footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                        <div className="d-flex align-items-center mb-3">
                            <img src="/favicon.png" alt="EcoMarket Logo" height="28" className="me-2 rounded opacity-75" />
                            <h5 className="mb-0 text-white">EcoMarket</h5>
                        </div>
                        <p>
                            Your premium destination for buying and selling high-quality second-hand items.
                            Join our eco-friendly community today.
                        </p>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6">
                        <h5>Explore</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="footer-link">Catalog</Link></li>
                            <li className="mb-2"><Link to="/categories" className="footer-link">Categories</Link></li>
                            <li className="mb-2"><Link to="/how-it-works" className="footer-link">How it Works</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6">
                        <h5>Company</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/about" className="footer-link">About Us</Link></li>
                            <li className="mb-2"><Link to="/contact" className="footer-link">Contact</Link></li>
                            <li className="mb-2"><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 mt-4 mt-lg-0">
                        <h5>Newsletter</h5>
                        <p>Subscribe to receive updates on new products and special offers.</p>
                        <form className="d-flex w-100" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                className="form-control me-2 bg-dark text-white border-secondary"
                                placeholder="Your email address"
                                aria-label="Email for newsletter"
                            />
                            <button className="btn btn-primary-custom" type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <hr />

                <div className="row align-items-center footer-bottom">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        &copy; 2026 EcoMarket. DAWeb Final Project. All rights reserved.
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <a href="#" className="social-icon" aria-label="Facebook">Fb</a>
                        <a href="#" className="social-icon" aria-label="Twitter">Tw</a>
                        <a href="#" className="social-icon" aria-label="Instagram">Ig</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
