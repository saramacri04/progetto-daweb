const pool = require('../db');

exports.getDashboard = async (req, res) => {
    try {
        // Recuperiamo gli utenti (escludendo l'hash della password per pulizia, sebbene non vitale per admin internal)
        const [users] = await pool.query('SELECT id, name, surname, email, role, created_at FROM users ORDER BY created_at DESC');
        
        // Recuperiamo le transazioni con join per nomi prodotto e utenti
        const [transactions] = await pool.query(`
            SELECT t.id, t.agreed_price, t.status, t.created_at,
                   p.title as product_title,
                   b.name as buyer_name, b.surname as buyer_surname,
                   s.name as seller_name, s.surname as seller_surname
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users b ON t.buyer_id = b.id
            JOIN users s ON t.seller_id = s.id
            ORDER BY t.created_at DESC
        `);

        res.render('admin/dashboard', { 
            title: 'Pannello Amministratore',
            users,
            transactions
        });
    } catch (error) {
        console.error("Errore recupero dashboard admin:", error);
        res.status(500).send("Errore nel server");
    }
};
