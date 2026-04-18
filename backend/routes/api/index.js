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
const reviewsRouter = require('./reviews');
const authRouter = require('./auth');

// Register API routes
router.use('/products', productsRouter);
router.use('/transactions', transactionsRouter);
router.use('/reviews', reviewsRouter);
router.use('/auth', authRouter);
module.exports = router;
