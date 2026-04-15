const pool = require('./db');
const bcrypt = require('bcrypt');

async function runSeed() {
    console.log('🌱 Starting database seeding...');
    
    try {
        // Drop existing tables in reverse order of foreign keys
        // Note: the schema.sql script creates tables but doesn't drop them.
        // We assume the DB is ready and tables have been created (by running schema.sql first)

        // Common password for test accounts
        const passwordHash = await bcrypt.hash('password123', 10);

        // 1. Seed Users
        console.log('Inserting Users...');
        const [users] = await pool.query(`INSERT INTO users (name, surname, email, password_hash, role) VALUES 
            ('Admin', 'Super', 'admin@ecomarket.it', ?, 'admin'),
            ('Mario', 'Rossi', 'mario@email.it', ?, 'user'),
            ('Giulia', 'Bianchi', 'giulia@email.it', ?, 'user')
            ON DUPLICATE KEY UPDATE id=id`, [passwordHash, passwordHash, passwordHash]);
            
        // 2. Seed Categories
        console.log('Inserting Categories...');
        await pool.query(`INSERT IGNORE INTO categories (id, name, description, icon) VALUES 
            (1, 'Electronics', 'Smartphones, PCs, and tech gadgets', 'bi-laptop'),
            (2, 'Clothing', 'Clothes, shoes, and accessories', 'bi-bag'),
            (3, 'Home & Garden', 'Furniture, decoration, gardening', 'bi-house'),
            (4, 'Automotive', 'Cars, motorcycles, and accessories', 'bi-car-front'),
            (5, 'Sports & Leisure', 'Sports equipment and hobbies', 'bi-bicycle')`);

        // 3. Seed Products
        // Retrieve user IDs (assuming keys are 1, 2, 3 for simplicity)
        console.log('Inserting Products...');
        await pool.query(`INSERT IGNORE INTO products (id, title, description, price, condition, seller_id, category_id, shipping_available, pickup_location) VALUES 
            (1, 'iPhone 13 Pro Max', 'Perfect condition, 90% battery, comes with box', 600.00, 'Like New', 2, 1, 1, 'Milan'),
            (2, 'Carbon Road Bike', 'Barely used, new tires', 850.50, 'Good Condition', 3, 5, 0, 'Rome'),
            (3, 'IKEA 3-Seater Sofa', 'Comfortable grey sofa, selling due to relocation', 120.00, 'Acceptable', 2, 3, 0, 'Florence')`);

        // 4. Seed Images
        console.log('Inserting Product Images...');
        await pool.query(`INSERT IGNORE INTO product_images (product_id, image_url, is_primary) VALUES 
            (1, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400', 1),
            (2, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400', 1),
            (3, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400', 1)`);

        // 5. Seed Transactions
        console.log('Inserting Transactions...');
        await pool.query(`INSERT IGNORE INTO transactions (id, product_id, buyer_id, seller_id, agreed_price, status) VALUES 
            (1, 1, 3, 2, 600.00, 'pending')`);

        console.log('✅ Seeding completed successfully!');
        
    } catch (err) {
        console.error('❌ Error during seeding:', err);
    } finally {
        process.exit();
    }
}

runSeed();
