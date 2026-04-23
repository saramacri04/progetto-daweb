const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const authAPI = require('../../middleware/authAPI');
const upload = require('../../middleware/upload');

// GET /api/products - Product catalog
router.get('/', productController.getProducts);

// GET /api/products/:id - Product detail
router.get('/:id', productController.getProductById);

// POST /api/products - Create product (with image upload)
router.post('/', authAPI, upload.array('images', 5), productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', authAPI, productController.updateProduct);

// PATCH /api/products/:id/status - Update status (archive, sold)
router.patch('/:id/status', authAPI, productController.archiveProduct);

module.exports = router;
