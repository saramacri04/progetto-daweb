import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters and Pagination State
    const [categoryId, setCategoryId] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [triggerFetch, setTriggerFetch] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: page,
                limit: 12
            };
            if (categoryId) params.category_id = categoryId;
            if (maxPrice) params.max_price = maxPrice;
            if (sort) params.sort = sort;

            const response = await api.get('/products', { params });
            if (response.data && response.data.success) {
                setProducts(response.data.data);
                setTotalPages(response.data.pagination.total_pages || 1);
            } else {
                setError('Failed to load products.');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('An error occurred while loading the catalog.');
        } finally {
            setLoading(false);
        }
    }, [categoryId, maxPrice, sort, page]);

    useEffect(() => {
        fetchProducts();
    }, [page, sort, triggerFetch]);

    const handleApplyFilters = (e) => {
        if(e) e.preventDefault();
        setPage(1);
        setTriggerFetch(prev => prev + 1);
    };

    const handleResetFilters = () => {
        setCategoryId('');
        setMaxPrice('');
        setSort('newest');
        setPage(1);
        setTriggerFetch(prev => prev + 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    return (
        <div className="container mt-4">
            <section className="home-hero">
                <h1>Welcome to EcoMarket</h1>
                <p>Discover sustainably sourced second-hand items. Buy, sell, and contribute to a greener planet.</p>
            </section>

            <section className="catalog-section">
                <div className="catalog-header mb-4">
                    <h2>Latest Products</h2>
                    
                    <form className="filter-bar" onSubmit={handleApplyFilters}>
                        <div className="filter-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">All Categories</option>
                                <option value="1">Electronics</option>
                                <option value="2">Clothing</option>
                                <option value="3">Home & Garden</option>
                                <option value="4">Automotive</option>
                                <option value="5">Sports & Leisure</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label htmlFor="maxPrice">Max Price (€)</label>
                            <input 
                                type="number" 
                                id="maxPrice" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                                placeholder="e.g. 100" 
                                min="0" 
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="sort">Sort By</label>
                            <select id="sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); handleApplyFilters(); }}>
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-actions mt-auto">
                            <button type="submit" className="btn btn-primary d-block w-100 mb-2">Apply</button>
                            <button type="button" className="btn btn-outline-secondary d-block w-100" onClick={handleResetFilters}>Reset</button>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="loading-container text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="product-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-container mt-5 mb-4 d-flex justify-content-center align-items-center gap-3">
                                <button className="btn btn-success rounded-pill px-4" onClick={handlePrevPage} disabled={page === 1}>
                                    &laquo; Previous
                                </button>
                                <span className="pagination-info font-weight-bold">Page {page} of {totalPages}</span>
                                <button className="btn btn-success rounded-pill px-4" onClick={handleNextPage} disabled={page === totalPages}>
                                    Next &raquo;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="alert alert-info text-center" role="alert">
                        No products match your filters.
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
