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
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            }
        } catch (err) {
            console.error(`Error fetching ${tab} data:`, err);
            setError('Errore durante il caricamento dei dati.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5 dashboard-container">
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
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Prodotto</th>
                                                    <th>Prezzo Accordato</th>
                                                    <th>Venditore</th>
                                                    <th>Stato</th>
                                                    <th>Data</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {acquisti.map(transaction => (
                                                    <tr key={transaction.id}>
                                                        <td>
                                                            <Link to={`/product/${transaction.product_id}`} className="text-decoration-none text-dark fw-bold">
                                                                {transaction.product_title}
                                                            </Link>
                                                        </td>
                                                        <td>€{Number(transaction.agreed_price).toFixed(2)}</td>
                                                        <td>{transaction.seller_name}</td>
                                                        <td>
                                                            <span className={`badge ${transaction.status === 'accepted' || transaction.status === 'completed' ? 'bg-success' : transaction.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                                {transaction.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center mt-3">
                                        Non hai ancora effettuato acquisti (o richieste di acquisto).
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
