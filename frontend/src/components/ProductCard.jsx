import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    // Generate an image URL; fallback to a placeholder if none exists
    const imageUrl = product.primary_image 
        ? product.primary_image 
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="product-card card-premium">
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img 
                        src={imageUrl} 
                        alt={product.title} 
                        className="product-image" 
                    />
                    {product.condition && (
                        <span className="product-badge condition-badge">
                            {product.condition}
                        </span>
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
