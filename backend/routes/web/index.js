const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// Rotta per la Homepage (verrà renderizzata da HBS)
router.get('/', (req, res) => {
    // Passiamo un po' di dati alla vista per testare Handlebars
    res.render('home', {
        title: 'Mercatino Seconda Mano - EcoMarket',
        description: 'La migliore piattaforma per comprare e vendere prodotti usati.'
    });
});

// Viste e logiche Autenticazione
router.get('/login', (req, res) => {
    // se è in queryString
    const registered = req.query.registered ? true : false;
    res.render('login', { title: 'Accedi - EcoMarket', registered });
});
router.post('/login', authController.loginUser);

const { isAuthenticated, isAdmin } = require('../../middleware/auth');
const adminController = require('../../controllers/adminController');

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registrati - EcoMarket' });
});
router.post('/register', authController.registerUser);

router.get('/logout', authController.logoutUser);

// Area Protetta: Pannello Admin
router.get('/admin', isAuthenticated, isAdmin, adminController.getDashboard);

module.exports = router;
