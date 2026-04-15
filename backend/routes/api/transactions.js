const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');
const authAPI = require('../../middleware/authAPI');

// POST /api/transactions - Genera una nuova richiesta d'acquisto (Pending)
router.post('/', authAPI, transactionController.createRequest);

// GET /api/transactions/buyer - Riepilogo delle richieste di acquisto fatte dall'utente
router.get('/buyer', authAPI, transactionController.getBuyerRequests);

// GET /api/transactions/seller - Riepilogo delle richieste ricevute per i prodotti dell'utente
router.get('/seller', authAPI, transactionController.getSellerRequests);

// PATCH /api/transactions/:id/status - Il venditore accetta o rifiuta la transazione
router.patch('/:id/status', authAPI, transactionController.updateTransactionStatus);

module.exports = router;
