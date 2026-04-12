const express = require('express');
const router = express.Router();

// Rotta per la Homepage (verrà renderizzata da HBS)
router.get('/', (req, res) => {
    // Passiamo un po' di dati alla vista per testare Handlebars
    res.render('home', {
        title: 'Mercatino Seconda Mano',
        description: 'La migliore piattaforma per comprare e vendere prodotti usati.'
    });
});

module.exports = router;
