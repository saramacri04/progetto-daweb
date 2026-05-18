import React from 'react';

export const AboutUs = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">About Us</h1>
        <p className="lead text-secondary">EcoMarket is the leading platform for buying and selling second-hand items, with a strong focus on sustainability.</p>
        <p>We believe in a world where every object deserves a second life. Besides reducing waste and environmental impact, our platform allows anyone to earn from what they no longer use and find great deals on quality products.</p>
        <p>Our team is composed of technology and ecology enthusiasts, united by the mission of making the circular economy accessible to everyone, safely and conveniently.</p>
    </div>
);

export const Contact = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">Contact Us</h1>
        <p className="lead text-secondary">We are here to help. If you have questions, suggestions, or need assistance, do not hesitate to contact us.</p>
        <div className="card border-0 bg-light p-4 mt-4 rounded-4">
            <ul className="list-unstyled mb-0">
                <li className="mb-3"><i className="bi bi-envelope-fill text-success me-2"></i> <strong>Email:</strong> support@ecomarket.com</li>
                <li className="mb-3"><i className="bi bi-telephone-fill text-success me-2"></i> <strong>Phone:</strong> +39 012 345 6789</li>
                <li><i className="bi bi-geo-alt-fill text-success me-2"></i> <strong>Address:</strong> Via Roma 1, 00100 Rome, Italy</li>
            </ul>
        </div>
        <p className="mt-4 text-muted">Our customer service is active Monday to Friday, from 9:00 AM to 6:00 PM.</p>
    </div>
);

export const Terms = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">Terms of Service & Privacy</h1>
        
        <h4 className="mt-4">1. Acceptance of Terms</h4>
        <p className="text-secondary">By using EcoMarket, you agree to be bound by these terms. If you do not agree, please do not use the platform.</p>
        
        <h4 className="mt-4">2. User Responsibilities</h4>
        <p className="text-secondary">Users are responsible for the content published and the truthfulness of the information provided. EcoMarket acts solely as a technological intermediary.</p>
        
        <h4 className="mt-4">3. Privacy Policy</h4>
        <p className="text-secondary">We respect your privacy. Your personal data is processed in accordance with the GDPR. We will never sell your data to third parties for marketing purposes without your explicit consent.</p>
        
        <h4 className="mt-4">4. Transactions</h4>
        <p className="text-secondary">EcoMarket is not responsible for the outcome of peer-to-peer transactions. We always recommend using common sense, exchanging by hand in public places, or using secure payment methods.</p>
    </div>
);

export const HowItWorks = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold text-center mb-5 text-success">How EcoMarket Works</h1>
        <div className="row mt-5">
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-camera text-white" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">1. Publish</h3>
                <p className="text-secondary">Take a few photos of your item, describe it accurately, and set a price. It takes less than two minutes.</p>
            </div>
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-chat-dots text-white" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">2. Negotiate</h3>
                <p className="text-secondary">Receive offers from buyers, accept the best ones, and agree via email on shipping or hand delivery.</p>
            </div>
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-star text-white" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">3. Review</h3>
                <p className="text-secondary">Once the deal is done, leave a review for the seller to help the community grow safely and transparently.</p>
            </div>
        </div>
    </div>
);
