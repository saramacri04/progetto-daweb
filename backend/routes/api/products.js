const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const authAPI = require('../../middleware/authAPI');
const upload = require('../../middleware/upload');

// GET /api/products - Catalogo prodotti
router.get('/', productController.getProducts);

// POST /api/products - Creazione prodotto (con upload immagini)
router.post('/', authAPI, upload.array('images', 5), productController.createProduct);

// PUT /api/products/:id - Modifica prodotto
router.put('/:id', authAPI, productController.updateProduct);

// PATCH /api/products/:id/status - Modifica status (archivia, venduto)
router.patch('/:id/status', authAPI, productController.archiveProduct);

module.exports = router;
