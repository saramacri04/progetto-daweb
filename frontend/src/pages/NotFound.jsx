import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container mt-5 text-center">
            <h1 className="display-1">404</h1>
            <h2>Page Not Found</h2>
            <p className="lead">Sorry, the page you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
    );
};

export default NotFound;
