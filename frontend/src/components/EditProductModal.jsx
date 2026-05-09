import React, { useState, useEffect } from 'react';

const EditProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: 'New',
        category_id: 1,
        shipping_available: 0,
        pickup_location: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || '',
                description: product.description || '',
                price: product.price || '',
                condition: product.condition || 'New',
                category_id: product.category_id || 1,
                shipping_available: product.shipping_available || 0,
                pickup_location: product.pickup_location || ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product.id, formData);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Product</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Description</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required 
                                ></textarea>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Price (€)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="form-control" 
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Condition</label>
                                    <select 
                                        className="form-select" 
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good Condition">Good Condition</option>
                                        <option value="Acceptable">Acceptable</option>
                                        <option value="For Parts">For Parts</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Category</label>
                                    {/* We hardcode the categories or fetch them. For simplicity, just provide some common options, or ideally let's not let them edit category if it's too complex, but they should be able to. Assuming typical categories: */}
                                    <select 
                                        className="form-select" 
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                    >
                                        <option value="1">Electronics</option>
                                        <option value="2">Fashion & Accessories</option>
                                        <option value="3">Home & Garden</option>
                                        <option value="4">Sports & Leisure</option>
                                        <option value="5">Vehicles</option>
                                        <option value="6">Books & Media</option>
                                        <option value="7">Toys & Games</option>
                                        <option value="8">Other</option>
                                    </select>
                                </div>
                                <div className="col-md-6 pt-4">
                                    <div className="form-check form-switch mt-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            name="shipping_available"
                                            id="shippingAvailableEdit"
                                            checked={formData.shipping_available === 1}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="shippingAvailableEdit">
                                            Shipping Available
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.shipping_available === 0 && (
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pickup Location (Required for local pickup)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="pickup_location"
                                        value={formData.pickup_location}
                                        onChange={handleChange}
                                        placeholder="e.g. Rome Central Station"
                                        required={formData.shipping_available === 0}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-success">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
