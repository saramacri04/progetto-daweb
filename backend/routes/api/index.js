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

// Aggiungeremo qui altre route API: /users, /products, /transactions, /auth...

module.exports = router;
