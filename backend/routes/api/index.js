const express = require('express');
const router = express.Router();

// API test endpoint
router.get('/status', (req, res) => {
    res.json({
        status: 'success',
        message: "The Backend API is up and running",
        timestamp: new Date()
    });
});

// Child API routes
const productsRouter = require('./products');
const transactionsRouter = require('./transactions');


// Register API routes
router.use('/products', productsRouter);
router.use('/transactions', transactionsRouter);
module.exports = router;
