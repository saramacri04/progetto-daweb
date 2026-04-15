const db = require('../db');

exports.createRequest = async (req, res) => {
    try {
        const { product_id, offered_price } = req.body;
        const buyer_id = req.user.id;

        // Recupera info prodotto
        const [product] = await db.query('SELECT price, seller_id, status FROM products WHERE id = ?', [product_id]);
        if (product.length === 0) return res.status(404).json({ success: false, message: 'Prodotto non trovato' });
        
        if (product[0].status !== 'active') return res.status(400).json({ success: false, message: 'Prodotto non disponibile' });
        if (product[0].seller_id === buyer_id) return res.status(400).json({ success: false, message: 'Non puoi acquistare un tuo stesso prodotto' });

        const price = offered_price || product[0].price;

        // Inserisci transazione
        const [result] = await db.query(
            `INSERT INTO transactions (product_id, buyer_id, seller_id, agreed_price, status) VALUES (?, ?, ?, ?, 'pending')`,
            [product_id, buyer_id, product[0].seller_id, price]
        );

        res.status(201).json({ success: true, message: 'Richiesta di acquisto inviata con successo', transactionId: result.insertId });
    } catch (err) {
        console.error("Errore createRequest:", err);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

exports.getBuyerRequests = async (req, res) => {
    try {
        const buyer_id = req.user.id;
        const [rows] = await db.query(`
            SELECT t.id, t.agreed_price, t.status, t.created_at, 
                   p.title as product_title, p.id as product_id, 
                   u.name as seller_name, u.email as seller_email
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.seller_id = u.id
            WHERE t.buyer_id = ?
            ORDER BY t.created_at DESC
        `, [buyer_id]);
        
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("Errore getBuyerRequests:", err);
        res.status(500).json({ success: false, message: 'Errore nel recupero delle transazioni' });
    }
};

exports.getSellerRequests = async (req, res) => {
    try {
        const seller_id = req.user.id;
        const [rows] = await db.query(`
            SELECT t.id, t.agreed_price, t.status, t.created_at, 
                   p.title as product_title, p.id as product_id, 
                   u.name as buyer_name, u.email as buyer_email
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.buyer_id = u.id
            WHERE t.seller_id = ?
            ORDER BY t.created_at DESC
        `, [seller_id]);
        
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("Errore getSellerRequests:", err);
        res.status(500).json({ success: false, message: 'Errore nel recupero delle transazioni' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const transaction_id = req.params.id;
        const seller_id = req.user.id;
        const { status } = req.body; // 'accepted', 'rejected', 'completed'

        if (!['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status non valido' });
        }

        // Verifica la transazione
        const [trans] = await connection.query('SELECT seller_id, product_id, status FROM transactions WHERE id = ?', [transaction_id]);
        if (trans.length === 0) throw new Error('Transaction not found');
        if (trans[0].seller_id !== seller_id) throw new Error('Not authorized');
        
        // Aggiorna status transazione
        await connection.query('UPDATE transactions SET status = ? WHERE id = ?', [status, transaction_id]);

        // Se accetta, allora archivia il prodotto mettendolo a 'sold' e rifiuta altre offerte
        if (status === 'accepted') {
            await connection.query("UPDATE products SET status = 'sold' WHERE id = ?", [trans[0].product_id]);
            await connection.query("UPDATE transactions SET status = 'rejected' WHERE product_id = ? AND id != ? AND status = 'pending'", [trans[0].product_id, transaction_id]);
        }

        await connection.commit();
        res.json({ success: true, message: `Stato transazione aggiornato a '${status}'` });
    } catch (err) {
        await connection.rollback();
        const msg = err.message === 'Not authorized' ? 'Operazione non autorizzata' : err.message === 'Transaction not found' ? 'Transazione non trovata' : 'Errore interno del server';
        const code = err.message === 'Not authorized' ? 403 : err.message === 'Transaction not found' ? 404 : 500;
        res.status(code).json({ success: false, message: msg });
    } finally {
        connection.release();
    }
};
