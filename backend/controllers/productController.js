const db = require('../db');

exports.getProducts = async (req, res) => {
    try {
        const { 
            q, 
            category_id, 
            condition, 
            min_price, 
            max_price, 
            sort = 'newest', 
            page = 1, 
            limit = 12 
        } = req.query;

        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        const limitNum = Number(limit);

        // Dynamic query building and parameters
        let whereClauses = ["p.status = 'active'"];
        let queryParams = [];

        if (q) {
            whereClauses.push("(p.title LIKE ? OR p.description LIKE ?)");
            const searchTerm = `%${q}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        if (category_id) {
            whereClauses.push("p.category_id = ?");
            queryParams.push(Number(category_id));
        }

        if (condition) {
            whereClauses.push("p.condition = ?");
            queryParams.push(condition);
        }

        if (min_price) {
            whereClauses.push("p.price >= ?");
            queryParams.push(Number(min_price));
        }

        if (max_price) {
            whereClauses.push("p.price <= ?");
            queryParams.push(Number(max_price));
        }

        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Order definition
        let orderString = "ORDER BY p.created_at DESC"; // default newest
        if (sort === 'price_asc') orderString = "ORDER BY p.price ASC";
        if (sort === 'price_desc') orderString = "ORDER BY p.price DESC";

        // Data query
        const sql = `
            SELECT 
                p.id, p.title, p.description, p.price, p.\`condition\`, p.status, p.views_count, p.shipping_available, p.pickup_location, p.created_at,
                c.id AS category_id, c.name AS category_name, c.icon AS category_icon,
                u.id AS seller_id, u.name AS seller_name,
                (SELECT GROUP_CONCAT(image_url ORDER BY is_primary DESC SEPARATOR ',') FROM product_images pi WHERE pi.product_id = p.id) AS images
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.seller_id = u.id
            ${whereString}
            ${orderString}
            LIMIT ? OFFSET ?
        `;

        // Total count query (for pagination)
        const countSql = `
            SELECT COUNT(*) AS total
            FROM products p
            ${whereString}
        `;

        // Execute parallel queries
        const countParams = [...queryParams]; // copy parameters for count (excludes limit/offset)
        const sqlParams = [...queryParams, limitNum, offset];

        const [rows] = await db.query(sql, sqlParams);
        const [countRows] = await db.query(countSql, countParams);

        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limitNum);

        res.json({
            success: true,
            data: rows,
            pagination: {
                total_items: totalItems,
                total_pages: totalPages,
                current_page: Number(page),
                limit: limitNum
            }
        });

    } catch (err) {
        console.error("Error getProducts:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Fetch product and seller info
        const sql = `
            SELECT 
                p.id, p.title, p.description, p.price, p.\`condition\`, p.status, p.views_count, p.shipping_available, p.pickup_location, p.created_at,
                c.id AS category_id, c.name AS category_name, c.icon AS category_icon,
                u.id AS seller_id, u.name AS seller_name, u.created_at AS seller_joined
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.seller_id = u.id
            WHERE p.id = ? AND p.status = 'active'
        `;
        
        const [rows] = await db.query(sql, [productId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const product = rows[0];

        // Fetch all images for the product
        const imagesSql = `
            SELECT image_url, is_primary 
            FROM product_images 
            WHERE product_id = ?
            ORDER BY is_primary DESC, id ASC
        `;
        
        const [images] = await db.query(imagesSql, [productId]);
        product.images = images.map(img => img.image_url);

        // Fetch average rating for seller (optional enhancement)
        const ratingSql = `
            SELECT AVG(rating) as average_rating, COUNT(*) as review_count
            FROM reviews
            WHERE reviewee_id = ?
        `;
        const [ratings] = await db.query(ratingSql, [product.seller_id]);
        
        product.seller_rating = ratings[0].average_rating ? Number(ratings[0].average_rating).toFixed(1) : null;
        product.seller_reviews_count = ratings[0].review_count;

        // Increment views count
        await db.query('UPDATE products SET views_count = views_count + 1 WHERE id = ?', [productId]);

        res.json({
            success: true,
            data: product
        });

    } catch (err) {
        console.error("Error getProductById:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.createProduct = async (req, res) => {
    // Transaction management to insert product and images
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { title, description, price, condition, shipping_available = 0, pickup_location = null, category_id } = req.body;
        const seller_id = req.user.id; // Dal middleware authAPI

        // 1. Insert product
        const [result] = await connection.query(
            `INSERT INTO products (title, description, price, \`condition\`, shipping_available, pickup_location, seller_id, category_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, price, condition, shipping_available, pickup_location, seller_id, category_id]
        );
        const productId = result.insertId;

        // 2. Handle images via Multer
        if (req.files && req.files.length > 0) {
            const imageValues = req.files.map((file, index) => [
                productId,
                `/uploads/products/${file.filename}`, // Public URL
                index === 0 ? 1 : 0 // The first image is is_primary
            ]);

            await connection.query(
                `INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?`,
                [imageValues]
            );
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Product created successfully', productId });
    } catch (err) {
        await connection.rollback();
        console.error("Error createProduct:", err);
        res.status(500).json({ success: false, message: 'Error creating product' });
    } finally {
        connection.release();
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.id;
        const { title, description, price, condition, shipping_available, pickup_location, category_id, status } = req.body;

        // Check that product exists and belongs to user
        const [product] = await db.query('SELECT seller_id FROM products WHERE id = ?', [productId]);
        if (product.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
        if (product[0].seller_id !== sellerId) return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });

        await db.query(
            `UPDATE products SET title = COALESCE(?, title), description = COALESCE(?, description), 
             price = COALESCE(?, price), \`condition\` = COALESCE(?, \`condition\`), 
             shipping_available = COALESCE(?, shipping_available), pickup_location = COALESCE(?, pickup_location),
             category_id = COALESCE(?, category_id), status = COALESCE(?, status)
             WHERE id = ? AND seller_id = ?`,
            [title, description, price, condition, shipping_available, pickup_location, category_id, status, productId, sellerId]
        );

        res.json({ success: true, message: 'Product updated successfully' });
    } catch (err) {
        console.error("Error updateProduct:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.id;
        const { status } = req.body; // status può essere 'hidden' o 'sold'

        if (!['hidden', 'sold'].includes(status)) {
             return res.status(400).json({ success: false, message: "Invalid status. Choose 'hidden' or 'sold'" });
        }

        const [result] = await db.query(
            `UPDATE products SET status = ? WHERE id = ? AND seller_id = ?`,
            [status, productId, sellerId]
        );

        if (result.affectedRows === 0) {
             return res.status(403).json({ success: false, message: 'Not authorized or product non-existent' });
        }

        res.json({ success: true, message: `Product set to ${status}` });
    } catch (err) {
        console.error("Error archiveProduct:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
