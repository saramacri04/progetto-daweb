const express = require('express');
const router = express.Router();

// Endpoint di test API
router.get('/status', (req, res) => {
    res.json({
        status: 'success',
        message: "L'API Backend è attiva e funzionante",
        timestamp: new Date()
    });
});

// Rotte API figlie
const productsRouter = require('./products');

// Registrazione rotte API
router.use('/products', productsRouter);
module.exports = router;
