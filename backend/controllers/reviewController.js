const db = require('../db');

exports.addReview = async (req, res) => {
    try {
        const { transaction_id, rating, comment } = req.body;
        const reviewer_id = req.user.id;

        // Validations
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        // Verify transaction
        const [trans] = await db.query(
            'SELECT buyer_id, seller_id, status FROM transactions WHERE id = ?', 
            [transaction_id]
        );

        if (trans.length === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        const transaction = trans[0];

        if (!['accepted', 'completed'].includes(transaction.status)) {
            return res.status(400).json({ success: false, message: 'Transaction is not eligible for review yet' });
        }

        // Verify user is part of transaction
        if (transaction.buyer_id !== reviewer_id && transaction.seller_id !== reviewer_id) {
            return res.status(403).json({ success: false, message: 'Not authorized to review this transaction' });
        }

        const reviewee_id = (transaction.buyer_id === reviewer_id) ? transaction.seller_id : transaction.buyer_id;

        // Check if user already reviewed this transaction
        const [existing] = await db.query(
            'SELECT id FROM reviews WHERE transaction_id = ? AND reviewer_id = ?',
            [transaction_id, reviewer_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this transaction' });
        }

        // Insert
        await db.query(
            'INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [transaction_id, reviewer_id, reviewee_id, rating, comment]
        );

        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (err) {
        console.error("Error addReview:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [rows] = await db.query(`
            SELECT r.id, r.rating, r.comment, r.created_at, 
                   u.name as reviewer_name, 
                   p.title as product_title
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            JOIN transactions t ON r.transaction_id = t.id
            JOIN products p ON t.product_id = p.id
            WHERE r.reviewee_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);

        // Calculate average
        const avg = rows.length > 0 
                    ? (rows.reduce((sum, r) => sum + r.rating, 0) / rows.length).toFixed(1)
                    : 0;

        res.json({ success: true, data: rows, average_rating: Number(avg), total_reviews: rows.length });
    } catch (err) {
        console.error("Error getUserReviews:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
