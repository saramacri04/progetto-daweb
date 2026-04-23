import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Parse the comma-separated images string from the backend into an array
    const imageArray = product.images ? product.images.split(',') : [];
    
    useEffect(() => {
        let interval;
        // Only set up the interval if hovered and there's more than one image
        if (isHovered && imageArray.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => 
                    (prevIndex + 1) % imageArray.length
                );
            }, 1500); // Change image every 1.5 seconds on hover for better responsiveness
        } else {
            // Reset to the primary image when mouse leaves
            setCurrentImageIndex(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered, imageArray.length]);

    // Generate an image URL; fallback to a placeholder if none exists
    const getImageUrl = (url) => {
        if (!url) return '/placeholder.png';
        return url.startsWith('http') ? url : `http://localhost:3000${url}`;
    };

    const imageUrl = imageArray.length > 0 
        ? getImageUrl(imageArray[currentImageIndex]) 
        : '/placeholder.png';

    return (
        <div 
            className="product-card card-premium"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img 
                        src={imageUrl} 
                        alt={product.title} 
                        className="product-image fade-transition" 
                    />
                    {product.condition && (
                        <span className="product-badge condition-badge">
                            {product.condition}
                        </span>
                    )}
                    {/* Small dots indicator if multiple images */}
                    {imageArray.length > 1 && (
                        <div className="card-image-indicators">
                            {imageArray.map((_, idx) => (
                                <span 
                                    key={idx} 
                                    className={`card-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="product-content">
                    <div className="product-meta">
                        <span className="category-name">
                            {product.category_icon && <i className={product.category_icon}></i>} 
                            {' '} {product.category_name}
                        </span>
                        <span className="product-price">€{parseFloat(product.price).toFixed(2)}</span>
                    </div>
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                        <span className="seller-name">By {product.seller_name}</span>
                        {product.shipping_available === 1 ? (
                            <span className="shipping-badge">Shipping Available</span>
                        ) : (
                            <span className="pickup-badge">Pickup: {product.pickup_location || 'Local'}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
