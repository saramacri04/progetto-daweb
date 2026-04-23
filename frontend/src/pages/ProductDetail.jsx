import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.message || 'Errore nel caricamento del prodotto.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Errore di connessione al server.');
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

  if (loading) {
    return (
      <div className="product-detail-container loading-container">
        <div className="spinner"></div>
        <p>Caricamento dettagli prodotto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container error-container">
        <h2>Ops! Qualcosa è andato storto.</h2>
        <p>{error || 'Prodotto non trovato.'}</p>
        <Link to="/" className="btn btn-primary">Torna alla Home</Link>
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
                   src={`http://localhost:5000${product.images[currentImageIndex]}`} 
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
                    src={`http://localhost:5000${img}`} 
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-image-placeholder">Nessuna immagine disponibile</div>
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
              <span className="meta-label">Condizione:</span>
              <span className={`condition-badge condition-${product.condition.toLowerCase()}`}>
                {product.condition}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Pubblicato il:</span>
              <span>{new Date(product.created_at).toLocaleDateString('it-IT')}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Visualizzazioni:</span>
              <span>{product.views_count}</span>
            </div>
          </div>

          <div className="product-description-box">
            <h3>Descrizione</h3>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="product-logistics">
            {product.shipping_available ? (
              <div className="logistics-item success">
                <i className="bi bi-box-seam"></i> Spedizione disponibile
              </div>
            ) : (
              <div className="logistics-item text-muted">
                <i className="bi bi-x-circle"></i> Spedizione non disponibile
              </div>
            )}
            
            {product.pickup_location && (
              <div className="logistics-item">
                <i className="bi bi-geo-alt"></i> Ritiro a mano: {product.pickup_location}
              </div>
            )}
          </div>

          {/* Seller Info Card */}
          <div className="seller-card">
            <h3>Informazioni Venditore</h3>
            <div className="seller-profile">
              <div className="seller-avatar">
                {product.seller_name.charAt(0).toUpperCase()}
              </div>
              <div className="seller-details">
                <p className="seller-name">{product.seller_name}</p>
                {product.seller_rating ? (
                  <div className="seller-rating">
                    <span className="stars">★ {product.seller_rating}</span> 
                    <span className="review-count">({product.seller_reviews_count} recensioni)</span>
                  </div>
                ) : (
                  <p className="no-reviews">Nuovo venditore</p>
                )}
                {product.seller_joined && (
                  <p className="seller-joined">Membro dal {new Date(product.seller_joined).getFullYear()}</p>
                )}
              </div>
            </div>
            <button className="btn btn-contact-seller">Contatta il Venditore</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
