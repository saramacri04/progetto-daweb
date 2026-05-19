import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();

        const insertEmail = e.target[0].value;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(insertEmail)) {
            alert('Please enter a valid email address (e.g., mario@email.it)');
            return; 
        } 

        const iscritti = JSON.parse(localStorage.getItem('newsletter_emails')) || [];

        // check if email already exists in the list of subscribers
        if (iscritti.includes(insertEmail)) {
            alert('You are already subscribed with this email!');
            return; 
        }

        // if email is valid and not already subscribed, add it to the list of subscribers in localStorage
        iscritti.push(insertEmail);
        localStorage.setItem('newsletter_emails', JSON.stringify(iscritti));
       
        alert('Thank you for subscribing to our newsletter!');
        e.target.reset();
    };

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
                        <form className="d-flex w-100" onSubmit={handleNewsletterSubmit}>
                            <input
                                type="email"
                                className="form-control me-2 bg-dark text-white border-secondary"
                                placeholder="Your email address"
                                aria-label="Email for newsletter"
                                required
                            />
                            <button className="btn btn-primary-custom" type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <hr />

                <div className="row align-items-center footer-bottom">
                    <div className="col-md-12 text-center text-md-start mb-3 mb-md-0">
                        &copy; 2026 EcoMarket. DAWeb Final Project. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
