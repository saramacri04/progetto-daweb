const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// Route for the Homepage (will be rendered by HBS)
router.get('/', (req, res) => {
    // Passing data to the view to test Handlebars
    res.render('home', {
        title: 'Second Hand Market - EcoMarket',
        description: 'The best platform to buy and sell used products.'
    });
});

// Authentication Views and Logic
router.get('/login', (req, res) => {
    // check if in queryString
    const registered = req.query.registered ? true : false;
    res.render('login', { title: 'Login - EcoMarket', registered });
});
router.post('/login', authController.loginUser);

const { isAuthenticated, isAdmin } = require('../../middleware/auth');
const adminController = require('../../controllers/adminController');

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register - EcoMarket' });
});
router.post('/register', authController.registerUser);

router.get('/logout', authController.logoutUser);

// Protected Area: Admin Panel
router.get('/admin', isAuthenticated, isAdmin, adminController.getDashboard);

module.exports = router;
