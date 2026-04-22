import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products from our api
                const response = await api.get('/products');
                // The backend responds with { success: true, data: [...] }
                if (response.data && response.data.success) {
                    setProducts(response.data.data);
                } else {
                    setError('Failed to load products.');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('An error occurred while loading the catalog.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-4">
            <section className="home-hero">
                <h1>Welcome to EcoMarket</h1>
                <p>Discover sustainably sourced second-hand items. Buy, sell, and contribute to a greener planet.</p>
            </section>

            <section className="catalog-section">
                <div className="catalog-header">
                    <h2>Latest Products</h2>
                    {/* Filters and sorting will go here later */}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <p>Loading catalog...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="loading-container">
                        <p>No products available at the moment.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
