import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: 'new',
        category_id: '1',
        shipping_available: false,
        pickup_location: ''
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    // memoryze index of the image cover
    const [primaryIndex, setPrimaryIndex] = useState(0); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Add new photos to the existing ones, but block if total exceeds 5
    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        
        // Controllo se il totale supera 5
        if (images.length + newFiles.length > 5) {
            setError('You can upload a maximum of 5 images in total.');
            return;
        }

        const updatedImages = [...images, ...newFiles];
        setImages(updatedImages);

        const previews = updatedImages.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setError('');
    };

    // Delete images onclick x
    const removeImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        
        setImages(updatedImages);
        setImagePreviews(updatedPreviews);
        
        // changing index of the cover, if image deleted
        if (primaryIndex === indexToRemove) {
            setPrimaryIndex(0); // Torna alla prima
        } else if (primaryIndex > indexToRemove) {
            setPrimaryIndex(primaryIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('condition', formData.condition);
            data.append('category_id', formData.category_id);
            data.append('shipping_available', formData.shipping_available ? 1 : 0);
            if (formData.pickup_location) {
                data.append('pickup_location', formData.pickup_location);
            }

            // Append images
            images.forEach(image => {
                data.append('images', image);
            });
            
            // Sending cover image to backend
            data.append('primaryIndex', primaryIndex);

            const response = await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.success) {
                navigate(`/product/${response.data.productId}`);
            } else {
                setError('Error creating product.');
            }
        } catch (err) {
            console.error('Error creating product:', err);
            setError(err.response?.data?.message || 'A server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5 add-product-container">
            <h2 className="mb-4">Add a New Product</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="add-product-form bg-light p-4 rounded shadow-sm">
                <div className="row">
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-bold">Listing Title *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="title" 
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required 
                                placeholder="E.g. iPhone 13 Pro Max 256GB"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label fw-bold">Description *</label>
                            <textarea 
                                className="form-control" 
                                id="description" 
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe the condition, specifications, and other useful details"
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="price" className="form-label fw-bold">Price (€) *</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="price" 
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="condition" className="form-label fw-bold">Condition *</label>
                                <select 
                                    className="form-select" 
                                    id="condition" 
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="New">New</option>
                                    <option value="Like New">Like new</option>
                                    <option value="Good Condition">Excellent</option>
                                    <option value="Acceptable">Fair</option>
                                    <option value="For Parts">For parts / not working</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="category_id" className="form-label fw-bold">Category *</label>
                                <select 
                                    className="form-select" 
                                    id="category_id" 
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="1">Electronics</option>
                                    <option value="2">Clothing</option>
                                    <option value="3">Home & Garden</option>
                                    <option value="4">Automotive</option>
                                    <option value="5">Sports & Leisure</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3 d-flex flex-column justify-content-end">
                                <div className="form-check form-switch mb-2">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="shipping_available" 
                                        name="shipping_available"
                                        checked={formData.shipping_available}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="shipping_available">
                                        Shipping Available
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="pickup_location" className="form-label fw-bold">Pickup Location (Optional)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="pickup_location" 
                                name="pickup_location"
                                value={formData.pickup_location}
                                onChange={handleChange}
                                placeholder="E.g. Milan, Via Roma"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="images" className="form-label fw-bold">Product Images *</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                id="images" 
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                value="" 
                            />
                            <div className="form-text">You can upload up to 5 images. Select one to set as cover.</div>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="image-previews-container mt-3">
                                <h6>Preview (Select Cover):</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="preview-wrapper position-relative text-center">
                                            <div 
                                                className="position-relative d-inline-block"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setPrimaryIndex(index)}
                                            >
                                                <img 
                                                    src={src} 
                                                    alt={`Preview ${index}`} 
                                                    // Green border if selected as cover
                                                    className={`img-thumbnail object-fit-cover ${primaryIndex === index ? 'border-success border-3' : ''}`}
                                                    style={{ width: '100px', height: '100px' }}
                                                />
                                                {/* X for deleting image */}
                                                <button 
                                                    type="button" 
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '22px', height: '22px', padding: 0 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // avoid triggering cover selection when clicking X
                                                        removeImage(index);
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                                
                                                {/* Badge "Cover" */}
                                                {primaryIndex === index && (
                                                    <span className="badge bg-success position-absolute bottom-0 start-50 translate-middle-x mb-1">
                                                        Cover
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-4" />
                
                <div className="d-flex justify-content-end gap-3">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success px-5" disabled={loading || images.length === 0}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Publishing...
                            </>
                        ) : 'Publish Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;