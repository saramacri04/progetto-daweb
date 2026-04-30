import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('vetrina');
    
    const [vetrinaProducts, setVetrinaProducts] = useState([]);
    const [vendutiProducts, setVendutiProducts] = useState([]);
    const [acquisti, setAcquisti] = useState([]);
    const [ordini, setOrdini] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Review Modal State
    const [reviewModal, setReviewModal] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        if (user) {
            fetchData(activeTab);
        }
    }, [user, activeTab]);

    const fetchData = async (tab) => {
        setLoading(true);
        setError(null);
        try {
            if (tab === 'vetrina') {
                const res = await api.get('/products', {
                    params: { seller_id: user.id, status: 'active', limit: 100 }
                });
                if (res.data.success) setVetrinaProducts(res.data.data);
            } else if (tab === 'venduti') {
                const res = await api.get('/products', {
                    params: { seller_id: user.id, status: 'sold', limit: 100 }
                });
                if (res.data.success) setVendutiProducts(res.data.data);
            } else if (tab === 'acquisti') {
                const res = await api.get('/transactions/buyer');
                if (res.data.success) setAcquisti(res.data.data);
            } else if (tab === 'ordini') {
                const res = await api.get('/transactions/seller');
                if (res.data.success) setOrdini(res.data.data);
            }
        } catch (err) {
            console.error(`Error fetching ${tab} data:`, err);
            setError('Errore durante il caricamento dei dati.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionStatus = async (id, status) => {
        try {
            const res = await api.patch(`/transactions/${id}/status`, { status });
            if (res.data.success) {
                fetchData(activeTab);
            }
        } catch (err) {
            console.error("Error updating transaction:", err);
            alert(err.response?.data?.message || 'Errore aggiornamento stato');
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
                fetchData(activeTab);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            alert(err.response?.data?.message || 'Errore inserimento recensione');
        }
    };

    const renderTransactionTable = (transactions, isBuyer) => (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Prodotto</th>
                        <th>Prezzo Accordato</th>
                        <th>{isBuyer ? 'Venditore' : 'Compratore'}</th>
                        <th>Stato</th>
                        <th>Data</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
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
                                        <button className="btn btn-sm btn-success" onClick={() => handleTransactionStatus(transaction.id, 'accepted')}>Accetta</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleTransactionStatus(transaction.id, 'rejected')}>Rifiuta</button>
                                    </div>
                                )}
                                {isBuyer && (transaction.status === 'accepted' || transaction.status === 'completed') && !transaction.has_reviewed && (
                                    <button className="btn btn-sm btn-primary" onClick={() => setReviewModal(transaction)}>Lascia Recensione</button>
                                )}
                                {isBuyer && transaction.has_reviewed && (
                                    <span className="text-muted small">Recensito ✓</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container mt-5 mb-5 dashboard-container position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Il Mio Profilo: {user?.name || user?.email || 'User'}</h2>
                <div>
                    <Link to="/add-product" className="btn btn-success me-3">
                        + Aggiungi Prodotto
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
                        onClick={() => setActiveTab('vetrina')}
                    >
                        Vetrina
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'venduti' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => setActiveTab('venduti')}
                    >
                        Venduti
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'acquisti' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => setActiveTab('acquisti')}
                    >
                        Acquisti Effettuati
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'ordini' ? 'active font-weight-bold text-success' : 'text-secondary'}`}
                        onClick={() => setActiveTab('ordini')}
                    >
                        Ordini in Arrivo
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {error && <div className="alert alert-danger">{error}</div>}
                
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Caricamento...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tab Vetrina */}
                        {activeTab === 'vetrina' && (
                            <div className="tab-pane active">
                                {vetrinaProducts.length > 0 ? (
                                    <div className="dashboard-grid">
                                        {vetrinaProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        Non hai ancora nessun prodotto in vetrina. <Link to="/add-product">Aggiungi il tuo primo prodotto!</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Venduti */}
                        {activeTab === 'venduti' && (
                            <div className="tab-pane active">
                                {vendutiProducts.length > 0 ? (
                                    <div className="dashboard-grid">
                                        {vendutiProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        Non hai ancora venduto nessun prodotto.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Acquisti */}
                        {activeTab === 'acquisti' && (
                            <div className="tab-pane active">
                                {acquisti.length > 0 ? (
                                    renderTransactionTable(acquisti, true)
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        Non hai ancora effettuato acquisti (o richieste di acquisto).
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Ordini in Arrivo */}
                        {activeTab === 'ordini' && (
                            <div className="tab-pane active">
                                {ordini.length > 0 ? (
                                    renderTransactionTable(ordini, false)
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        Non hai ancora ricevuto ordini per i tuoi prodotti.
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Review Modal */}
            {reviewModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Lascia una Recensione</h5>
                                <button type="button" className="btn-close" onClick={() => setReviewModal(null)}></button>
                            </div>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="modal-body">
                                    <p className="mb-3">Transazione per: <strong>{reviewModal.product_title}</strong></p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Valutazione (1-5)</label>
                                        <select 
                                            className="form-select" 
                                            value={reviewForm.rating}
                                            onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                                            required
                                        >
                                            <option value="5">5 - Eccellente</option>
                                            <option value="4">4 - Molto Buono</option>
                                            <option value="3">3 - Buono</option>
                                            <option value="2">2 - Sufficiente</option>
                                            <option value="1">1 - Scarso</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Commento</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4"
                                            value={reviewForm.comment}
                                            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                                            required
                                            placeholder="Condividi la tua esperienza con questo utente..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setReviewModal(null)}>Annulla</button>
                                    <button type="submit" className="btn btn-success">Pubblica Recensione</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
