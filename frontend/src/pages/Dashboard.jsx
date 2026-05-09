import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import EditProductModal from '../components/EditProductModal';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('vetrina');
    
    const [vetrinaProducts, setVetrinaProducts] = useState([]);
    const [nascostiProducts, setNascostiProducts] = useState([]);
    const [vendutiProducts, setVendutiProducts] = useState([]);
    const [acquisti, setAcquisti] = useState([]);
    const [ordini, setOrdini] = useState([]);
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Review Modal State
    const [reviewModal, setReviewModal] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    // Edit Modal State
    const [editProductModal, setEditProductModal] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData(activeTab, page);
        }
    }, [user, activeTab, page]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    const fetchData = async (tab, currentPage) => {
        setLoading(true);
        setError(null);
        try {
            if (tab === 'vetrina') {
                const res = await api.get('/products', {
                    params: { seller_id: user.id, status: 'active', limit: 8, page: currentPage }
                });
                if (res.data.success) {
                    setVetrinaProducts(res.data.data);
                    setTotalPages(res.data.pagination.total_pages || 1);
                }
            } else if (tab === 'venduti') {
                const res = await api.get('/products', {
                    params: { seller_id: user.id, status: 'sold', limit: 8, page: currentPage }
                });
                if (res.data.success) {
                    setVendutiProducts(res.data.data);
                    setTotalPages(res.data.pagination.total_pages || 1);
                }
            } else if (tab === 'nascosti') {
                const res = await api.get('/products', {
                    params: { seller_id: user.id, status: 'hidden', limit: 8, page: currentPage }
                });
                if (res.data.success) {
                    setNascostiProducts(res.data.data);
                    setTotalPages(res.data.pagination.total_pages || 1);
                }
            } else if (tab === 'acquisti') {
                const res = await api.get('/transactions/buyer');
                if (res.data.success) {
                    setAcquisti(res.data.data);
                    setTotalPages(Math.ceil(res.data.data.length / 8) || 1);
                }
            } else if (tab === 'ordini') {
                const res = await api.get('/transactions/seller');
                if (res.data.success) {
                    setOrdini(res.data.data);
                    setTotalPages(Math.ceil(res.data.data.length / 8) || 1);
                }
            }
        } catch (err) {
            console.error(`Error fetching ${tab} data:`, err);
            setError('Error loading data.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionStatus = async (id, status) => {
        try {
            const res = await api.patch(`/transactions/${id}/status`, { status });
            if (res.data.success) {
                fetchData(activeTab, page);
            }
        } catch (err) {
            console.error("Error updating transaction:", err);
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    const handleProductStatus = async (id, newStatus) => {
        try {
            const res = await api.patch(`/products/${id}/status`, { status: newStatus });
            if (res.data.success) {
                fetchData(activeTab, page);
            }
        } catch (err) {
            console.error("Error updating product status:", err);
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
        try {
            const res = await api.delete(`/products/${id}`);
            if (res.data.success) {
                fetchData(activeTab, page);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert(err.response?.data?.message || 'Error deleting product');
        }
    };

    const handleEditSave = async (id, formData) => {
        try {
            const res = await api.put(`/products/${id}`, formData);
            if (res.data.success) {
                setEditProductModal(null);
                fetchData(activeTab, page);
            }
        } catch (err) {
            console.error("Error updating product:", err);
            alert(err.response?.data?.message || 'Error updating product');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/reviews', {
                transaction_id: reviewModal.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            if (res.data.success) {
                setReviewModal(null);
                setReviewForm({ rating: 5, comment: '' });
                fetchData(activeTab, page);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            alert(err.response?.data?.message || 'Error submitting review');
        }
    };

    const renderTransactionTable = (transactions, isBuyer) => (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Agreed Price</th>
                        <th>{isBuyer ? 'Seller' : 'Buyer'}</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.slice((page - 1) * 8, page * 8).map(transaction => (
                        <tr key={transaction.id}>
                            <td>
                                <Link to={`/product/${transaction.product_id}`} className="text-decoration-none text-dark fw-bold">
                                    {transaction.product_title}
                                </Link>
                            </td>
                            <td>€{Number(transaction.agreed_price).toFixed(2)}</td>
                            <td>{isBuyer ? transaction.seller_name : transaction.buyer_name}</td>
                            <td>
                                <span className={`badge ${transaction.status === 'accepted' || transaction.status === 'completed' ? 'bg-success' : transaction.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                    {transaction.status.toUpperCase()}
                                </span>
                            </td>
                            <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                            <td>
                                {!isBuyer && transaction.status === 'pending' && (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-success" onClick={() => handleTransactionStatus(transaction.id, 'accepted')}>Accept</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleTransactionStatus(transaction.id, 'rejected')}>Reject</button>
                                    </div>
                                )}
                                {isBuyer && (transaction.status === 'accepted' || transaction.status === 'completed') && !transaction.has_reviewed && (
                                    <button className="btn btn-sm btn-primary" onClick={() => setReviewModal(transaction)}>Leave Review</button>
                                )}
                                {isBuyer && transaction.has_reviewed && (
                                    <span className="text-muted small">Reviewed ✓</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="pagination-container mt-4 mb-4 d-flex justify-content-center align-items-center gap-3 w-100">
                <button 
                    className="btn btn-success rounded-pill px-4" 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1}
                >
                    &laquo; Previous
                </button>
                <span className="pagination-info font-weight-bold">Page {page} of {totalPages}</span>
                <button 
                    className="btn btn-success rounded-pill px-4" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page === totalPages}
                >
                    Next &raquo;
                </button>
            </div>
        );
    };

    return (
        <div className="container mt-5 mb-5 dashboard-container position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Profile: {user?.name || user?.email || 'User'}</h2>
                <div>
                    <Link to="/add-product" className="btn btn-success me-3">
                        + Add Product
                    </Link>
                    <button className="btn btn-outline-danger" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'vetrina' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => handleTabChange('vetrina')}
                    >
                        My Items
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'nascosti' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => handleTabChange('nascosti')}
                    >
                        Hidden
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'venduti' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => handleTabChange('venduti')}
                    >
                        Sold
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'acquisti' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => handleTabChange('acquisti')}
                    >
                        Purchases
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'ordini' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => handleTabChange('ordini')}
                    >
                        Incoming Orders
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {error && <div className="alert alert-danger">{error}</div>}
                
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tab Vetrina */}
                        {activeTab === 'vetrina' && (
                            <div className="tab-pane active">
                                {vetrinaProducts.length > 0 ? (
                                    <>
                                        <div className="dashboard-grid">
                                            {vetrinaProducts.map(product => (
                                                <div key={product.id} className="d-flex flex-column">
                                                    <ProductCard product={product} />
                                                    <div className="d-flex justify-content-between mt-2 px-1">
                                                        <button className="btn btn-sm btn-outline-primary w-100 me-1" onClick={() => setEditProductModal(product)}>
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-warning w-100 mx-1" onClick={() => handleProductStatus(product.id, 'hidden')}>
                                                            <i className="bi bi-eye-slash"></i> Hide
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger w-100 ms-1" onClick={() => handleDeleteProduct(product.id)}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        You don't have any products in your showcase yet. <Link to="/add-product">Add your first product!</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Nascosti */}
                        {activeTab === 'nascosti' && (
                            <div className="tab-pane active">
                                {nascostiProducts.length > 0 ? (
                                    <>
                                        <div className="dashboard-grid">
                                            {nascostiProducts.map(product => (
                                                <div key={product.id} className="d-flex flex-column">
                                                    <ProductCard product={product} />
                                                    <div className="d-flex justify-content-between mt-2 px-1">
                                                        <button className="btn btn-sm btn-outline-primary w-100 me-1" onClick={() => setEditProductModal(product)}>
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-success w-100 mx-1" onClick={() => handleProductStatus(product.id, 'active')}>
                                                            <i className="bi bi-eye"></i> Show
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger w-100 ms-1" onClick={() => handleDeleteProduct(product.id)}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        You don't have any hidden products.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Venduti */}
                        {activeTab === 'venduti' && (
                            <div className="tab-pane active">
                                {vendutiProducts.length > 0 ? (
                                    <>
                                        <div className="dashboard-grid">
                                            {vendutiProducts.map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        You haven't sold any products yet.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Acquisti */}
                        {activeTab === 'acquisti' && (
                            <div className="tab-pane active">
                                {acquisti.length > 0 ? (
                                    <>
                                        {renderTransactionTable(acquisti, true)}
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        You haven't made any purchases (or purchase requests) yet.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Ordini in Arrivo */}
                        {activeTab === 'ordini' && (
                            <div className="tab-pane active">
                                {ordini.length > 0 ? (
                                    <>
                                        {renderTransactionTable(ordini, false)}
                                        {renderPagination()}
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        You haven't received any orders for your products yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {reviewModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Leave a Review</h5>
                                <button type="button" className="btn-close" onClick={() => setReviewModal(null)}></button>
                            </div>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="modal-body">
                                    <p className="mb-3">Transaction for: <strong>{reviewModal.product_title}</strong></p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Rating (1-5)</label>
                                        <select 
                                            className="form-select" 
                                            value={reviewForm.rating}
                                            onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                                            required
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Comment</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4"
                                            value={reviewForm.comment}
                                            onChange={e => {
                                                e.target.setCustomValidity('');
                                                setReviewForm({...reviewForm, comment: e.target.value});
                                            }}
                                            onInvalid={e => e.target.setCustomValidity('Please fill out this field')}
                                            required
                                            placeholder="Share your experience with this user..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-success">Submit Review</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editProductModal && (
                <EditProductModal 
                    product={editProductModal} 
                    onClose={() => setEditProductModal(null)} 
                    onSave={handleEditSave} 
                />
            )}
        </div>
    );
};

export default Dashboard;
