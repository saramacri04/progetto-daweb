const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');
const authAPI = require('../../middleware/authAPI');

// POST /api/reviews - Aggiunge una recensione
router.post('/', authAPI, reviewController.addReview);

// GET /api/reviews/user/:userId - Ottieni recensioni ricevute da un utente (Pubblico, ma potrebbe anche essere limitato se desiderato)
router.get('/user/:userId', reviewController.getUserReviews);

module.exports = router;
