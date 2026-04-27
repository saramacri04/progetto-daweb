import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerStatus, setOfferStatus] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const result = response.data;

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.message || 'Error loading product.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Server connection error. (Please make sure the backend is running!)');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const getImageUrl = (url) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!offerAmount || isNaN(offerAmount) || Number(offerAmount) <= 0) {
      setOfferStatus({ loading: false, error: 'Please enter a valid amount', success: false });
      return;
    }

    setOfferStatus({ loading: true, error: null, success: false });
    try {
      const response = await api.post('/transactions', {
        product_id: product.id,
        offered_price: Number(offerAmount)
      });
      
      if (response.data.success) {
        setOfferStatus({ loading: false, error: null, success: true });
        setTimeout(() => {
          setShowOfferModal(false);
          setOfferStatus({ loading: false, error: null, success: false });
          setOfferAmount('');
        }, 2000);
      } else {
        setOfferStatus({ loading: false, error: response.data.message || 'Failed to make offer', success: false });
      }
    } catch (err) {
      setOfferStatus({ loading: false, error: err.response?.data?.message || 'Server error', success: false });
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container error-container">
        <h2>Oops! Something went wrong.</h2>
        <p>{error || 'Product not found.'}</p>
        <Link to="/" className="btn btn-primary">Go back to Home Page</Link>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="product-detail-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{product.category_name}</span> / <span>{product.title}</span>
      </div>

      <div className="product-main-content">
        {/* Left Side: Images */}
        <div className="product-gallery">
          {hasImages ? (
            <div className="carousel">
              {product.images.length > 1 && (
                <button className="carousel-btn prev" onClick={prevImage}>&#10094;</button>
              )}

              <div className="carousel-main-image-container">
                <img
                  src={getImageUrl(product.images[currentImageIndex])}
                  alt={`${product.title} - img ${currentImageIndex + 1}`}
                  className="carousel-main-image"
                />
              </div>

              {product.images.length > 1 && (
                <button className="carousel-btn next" onClick={nextImage}>&#10095;</button>
              )}

              <div className="carousel-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-image-placeholder">No images available</div>
          )}
        </div>

        {/* Right Side: Product Info */}
        <div className="product-info-panel">
          <div className="product-header">
            <span className="category-badge">
              <i className={product.category_icon || "bi bi-tag"}></i> {product.category_name}
            </span>
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">€ {Number(product.price).toFixed(2)}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className={`condition-badge condition-${product.condition.toLowerCase()}`}>
                {product.condition}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Posted on:</span>
              <span>{new Date(product.created_at).toLocaleDateString('en-US')}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Views:</span>
              <span>{product.views_count}</span>
            </div>
          </div>

          <div className="product-description-box">
            <h3>Description</h3>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="product-logistics">
            {product.shipping_available ? (
              <div className="logistics-item success">
                <i className="bi bi-box-seam"></i> Shipping available
              </div>
            ) : (
              <div className="logistics-item text-muted">
                <i className="bi bi-x-circle"></i> Shipping not available
              </div>
            )}

            {product.pickup_location && (
              <div className="logistics-item">
                <i className="bi bi-geo-alt"></i> Local pickup: {product.pickup_location}
              </div>
            )}
          </div>

          {/* Seller Info Card */}
          <div className="seller-card">
            <h3>Seller Information</h3>
            <div className="seller-profile">
              <div className="seller-avatar">
                {product.seller_name.charAt(0).toUpperCase()}
              </div>
              <div className="seller-details">
                <p className="seller-name">{product.seller_name}</p>
                {product.seller_rating ? (
                  <div className="seller-rating">
                    <span className="stars">★ {product.seller_rating}</span>
                    <span className="review-count">({product.seller_reviews_count} reviews)</span>
                  </div>
                ) : (
                  <p className="no-reviews">New seller</p>
                )}
                {product.seller_joined && (
                  <p className="seller-joined">Member since {new Date(product.seller_joined).getFullYear()}</p>
                )}
              </div>
            </div>
            <button className="btn btn-contact-seller">Contact Seller</button>
            
            {user ? (
              user.id === product.seller_id ? (
                <button className="btn btn-secondary btn-make-offer" disabled style={{marginTop: '10px', width: '100%'}}>This is your product</button>
              ) : (
                <button className="btn btn-primary btn-make-offer" onClick={() => setShowOfferModal(true)} style={{marginTop: '10px', width: '100%'}}>Make an Offer / Buy</button>
              )
            ) : (
              <Link to="/login" className="btn btn-primary btn-make-offer" style={{marginTop: '10px', width: '100%', display: 'block', textAlign: 'center'}}>Login to Make an Offer</Link>
            )}
          </div>

        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => !offerStatus.loading && setShowOfferModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make an Offer</h3>
              <button className="close-btn" onClick={() => setShowOfferModal(false)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <p className="product-summary"><strong>{product.title}</strong></p>
              <p className="asking-price">Asking price: <strong>€{Number(product.price).toFixed(2)}</strong></p>
              
              {offerStatus.success ? (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle"></i> Offer sent successfully! The seller will review it.
                </div>
              ) : (
                <form onSubmit={handleMakeOffer}>
                  <div className="form-group">
                    <label htmlFor="offerAmount">Your Offer Amount (€)</label>
                    <input
                      type="number"
                      id="offerAmount"
                      className="form-control"
                      step="0.01"
                      min="0.01"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder="Enter your offer..."
                      required
                      autoFocus
                    />
                  </div>
                  
                  {offerStatus.error && (
                    <div className="alert alert-danger" style={{marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px'}}>
                      {offerStatus.error}
                    </div>
                  )}
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowOfferModal(false)} 
                      disabled={offerStatus.loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={offerStatus.loading || !offerAmount}
                    >
                      {offerStatus.loading ? 'Sending...' : 'Confirm Offer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
