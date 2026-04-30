const pool = require('./db');
const bcrypt = require('bcrypt');

async function runSeed() {
    console.log('🌱 Starting database seeding with DENSE data...');

    try {
        const passwordHash = await bcrypt.hash('password123', 10);

        // Disabling foreign key checks to truncate easily
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE reviews');
        await pool.query('TRUNCATE TABLE transactions');
        await pool.query('TRUNCATE TABLE favorites');
        await pool.query('TRUNCATE TABLE product_images');
        await pool.query('TRUNCATE TABLE products');
        await pool.query('TRUNCATE TABLE categories');
        await pool.query('TRUNCATE TABLE users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Inserting Users...');
        const usersData = [
            ['Admin', 'Super', 'admin@ecomarket.it', passwordHash, 'admin'],
            ['Mario', 'Rossi', 'mario@email.it', passwordHash, 'user'],
            ['Giulia', 'Bianchi', 'giulia@email.it', passwordHash, 'user'],
            ['Luca', 'Verdi', 'luca@email.it', passwordHash, 'user'],
            ['Elena', 'Neri', 'elena@email.it', passwordHash, 'user'],
            ['Marco', 'Gialli', 'marco@email.it', passwordHash, 'user'],
            ['Sara', 'Viola', 'sara@email.it', passwordHash, 'user'],
            ['Alessandro', 'Marrone', 'alessandro@email.it', passwordHash, 'user'],
            ['Francesca', 'Blu', 'francesca@email.it', passwordHash, 'user'],
            ['Lorenzo', 'Rosa', 'lorenzo@email.it', passwordHash, 'user']
        ];
        await pool.query(`INSERT INTO users (name, surname, email, password_hash, role) VALUES ?`, [usersData]);

        console.log('Inserting Categories...');
        const categoriesData = [
            [1, 'Electronics', 'Smartphones, PCs, and tech gadgets', 'bi-laptop'],
            [2, 'Clothing', 'Clothes, shoes, and accessories', 'bi-bag'],
            [3, 'Home & Garden', 'Furniture, decoration, gardening', 'bi-house'],
            [4, 'Automotive', 'Cars, motorcycles, and accessories', 'bi-car-front'],
            [5, 'Sports & Leisure', 'Sports equipment and hobbies', 'bi-bicycle']
        ];
        await pool.query(`INSERT INTO categories (id, name, description, icon) VALUES ?`, [categoriesData]);

        console.log('Inserting Products...');
        const productsData = [
            // id, title, description, price, condition, seller_id, category_id, shipping, location, status
            [1, 'iPhone 13 Pro Max', 'Perfect condition, 90% battery, comes with box', 600.00, 'Like New', 2, 1, 1, 'Milan', 'active'],
            [2, 'Carbon Road Bike', 'Barely used, new tires', 850.50, 'Good Condition', 3, 5, 0, 'Rome', 'active'],
            [3, 'IKEA 3-Seater Sofa', 'Comfortable grey sofa, selling due to relocation', 120.00, 'Acceptable', 4, 3, 0, 'Florence', 'active'],
            [4, 'MacBook Air M1', 'Excellent for students, battery lasts all day', 750.00, 'Good Condition', 5, 1, 1, 'Turin', 'active'],
            [5, 'Sony PlayStation 5', 'Includes 2 controllers and 3 games', 400.00, 'Like New', 6, 1, 1, 'Naples', 'active'],
            [6, 'Vintage Denim Jacket', 'Original Levi\'s jacket from the 90s', 45.00, 'Good Condition', 7, 2, 1, 'Bologna', 'active'],
            [7, 'Yamaha Acoustic Guitar', 'Great sound, comes with carrying bag', 150.00, 'New', 8, 5, 0, 'Venice', 'active'],
            [8, 'KitchenAid Mixer', 'Used twice, looks brand new', 250.00, 'Like New', 9, 3, 1, 'Genoa', 'active'],
            [9, 'BMW Winter Tires', 'Set of 4 winter tires, used for one season', 200.00, 'Good Condition', 10, 4, 0, 'Verona', 'active'],
            [10, 'Nintendo Switch', 'Neon edition, no scratches', 180.00, 'Like New', 2, 1, 1, 'Milan', 'active'],
            [11, 'Leather Boots', 'Size 42, genuine leather', 60.00, 'New', 3, 2, 1, 'Rome', 'active'],
            [12, 'Gardening Tool Set', 'Spade, trowel, and gloves', 25.00, 'New', 4, 3, 1, 'Florence', 'active'],
            [13, 'Motorcycle Helmet', 'Size L, DOT certified', 80.00, 'Good Condition', 5, 4, 1, 'Turin', 'active'],
            [14, 'Tennis Racket', 'Professional grade, light frame', 120.00, 'Like New', 6, 5, 1, 'Naples', 'active'],
            [15, 'Samsung 4K TV', '55 inch smart TV, great picture quality', 300.00, 'Good Condition', 7, 1, 0, 'Bologna', 'active'],
            [16, 'AirPods Pro', 'Right earbud has a small scratch, works perfectly', 100.00, 'Acceptable', 8, 1, 1, 'Venice', 'active'],
            [17, 'Summer Dress', 'Floral pattern, size M', 20.00, 'New', 9, 2, 1, 'Genoa', 'active'],
            [18, 'Coffee Maker', 'Espresso machine with milk frother', 150.00, 'Like New', 10, 3, 1, 'Verona', 'active'],
            [19, 'Car Roof Box', 'Large capacity, aerodynamic design', 250.00, 'Good Condition', 2, 4, 0, 'Milan', 'active'],
            [20, 'Yoga Mat', 'Non-slip surface, eco-friendly material', 15.00, 'New', 3, 5, 1, 'Rome', 'active']
        ];
        await pool.query(`INSERT INTO products (id, title, description, price, \`condition\`, seller_id, category_id, shipping_available, pickup_location, status) VALUES ?`, [productsData]);

        console.log('Inserting Product Images...');
        const imagesData = [
            // 1: iPhone 13 Pro Max
            [1, '/uploads/products/iPhone 13 Pro Max/iphone1.png', 1],
            [1, '/uploads/products/iPhone 13 Pro Max/iphone2.png', 0],
            [1, '/uploads/products/iPhone 13 Pro Max/iphone3.png', 0],
            [1, '/uploads/products/iPhone 13 Pro Max/iphone4.png', 0],

            // 2: Carbon Road Bike
            [2, '/uploads/products/Carbon Road Bike/bike1.png', 1],
            [2, '/uploads/products/Carbon Road Bike/bike2.png', 0],
            [2, '/uploads/products/Carbon Road Bike/bike3.png', 0],
            [2, '/uploads/products/Carbon Road Bike/bike4.png', 0],
            [2, '/uploads/products/Carbon Road Bike/bike5.png', 0],

            // 3: IKEA 3-Seater Sofa
            [3, '/uploads/products/IKEA 3-Seater Sofa/sofa1.png', 1],
            [3, '/uploads/products/IKEA 3-Seater Sofa/sofa2.png', 0],
            [3, '/uploads/products/IKEA 3-Seater Sofa/sofa3.png', 0],

            // 4: MacBook Air M1
            [4, '/uploads/products/MacBook Air M1/macbook1.png', 1],
            [4, '/uploads/products/MacBook Air M1/macbook2.png', 0],
            [4, '/uploads/products/MacBook Air M1/macbook3.png', 0],

            // 5: Sony PlayStation 5
            [5, '/uploads/products/Sony PlayStation 5/playstation1.png', 1],
            [5, '/uploads/products/Sony PlayStation 5/playstation2.png', 0],
            [5, '/uploads/products/Sony PlayStation 5/playstation3.png', 0],
            [5, '/uploads/products/Sony PlayStation 5/playstation4.png', 0],

            // 6: Vintage Denim Jacket
            [6, '/uploads/products/Vintage Denim Jacket/denimjacket1.png', 1],
            [6, '/uploads/products/Vintage Denim Jacket/denimjacket2.png', 0],
            [6, '/uploads/products/Vintage Denim Jacket/denimjacket3.png', 0],
            [6, '/uploads/products/Vintage Denim Jacket/denimjacket4.png', 0],

            // 7: Yamaha Acoustic Guitar
            [7, '/uploads/products/Yamaha Acoustic Guitar/guitar1.png', 1],
            [7, '/uploads/products/Yamaha Acoustic Guitar/guitar2.png', 0],
            [7, '/uploads/products/Yamaha Acoustic Guitar/guitar3.png', 0],

            // 8: KitchenAid Mixer
            [8, '/uploads/products/KitchenAid Mixer/kitchenaid1.png', 1],
            [8, '/uploads/products/KitchenAid Mixer/kitchenaid2.png', 0],
            [8, '/uploads/products/KitchenAid Mixer/kitchenaid3.png', 0],

            // 9: BMW Winter Tires
            [9, '/uploads/products/BMW Winter Tires/tires1.png', 1],
            [9, '/uploads/products/BMW Winter Tires/tires2.png', 0],
            [9, '/uploads/products/BMW Winter Tires/tires3.png', 0],

            // 10: Nintendo Switch
            [10, '/uploads/products/Nintendo Switch/switch1.png', 1],
            [10, '/uploads/products/Nintendo Switch/switch2.png', 0],
            [10, '/uploads/products/Nintendo Switch/switch3.png', 0],

            // 11: Leather Boots
            [11, '/uploads/products/Leather Boots/leatherboots1.png', 1],
            [11, '/uploads/products/Leather Boots/leatherboots2.png', 0],
            [11, '/uploads/products/Leather Boots/leatherboots3.png', 0],

            // 12: Gardening Tool Set
            [12, '/uploads/products/Gardening Tool Set/gardeningtools1.png', 1],
            [12, '/uploads/products/Gardening Tool Set/gardeningtools2.png', 0],

            // 13: Motorcycle Helmet
            [13, '/uploads/products/Motorcycle Helmet/helmet1.png', 1],
            [13, '/uploads/products/Motorcycle Helmet/helmet2.png', 0],
            [13, '/uploads/products/Motorcycle Helmet/helmet3.png', 0],

            // 14: Tennis Racket
            [14, '/uploads/products/Tennis Racket/racket1.png', 1],
            [14, '/uploads/products/Tennis Racket/racket2.png', 0],
            [14, '/uploads/products/Tennis Racket/racket3.png', 0],

            // 15: Samsung 4K TV
            [15, '/uploads/products/Samsung 4K TV/tv1.png', 1],
            [15, '/uploads/products/Samsung 4K TV/tv2.png', 0],

            // 16: AirPods Pro
            [16, '/uploads/products/AirPods Pro/airpods1.png', 1],
            [16, '/uploads/products/AirPods Pro/airpods2.png', 0],
            [16, '/uploads/products/AirPods Pro/airpods3.png', 0],

            // 17: Summer Dress
            [17, '/uploads/products/Summer Dress/summerdress1.png', 1],
            [17, '/uploads/products/Summer Dress/summerdress2.png', 0],

            // 18: Coffee Maker
            [18, '/uploads/products/Coffee Maker/coffemaker1.png', 1],
            [18, '/uploads/products/Coffee Maker/coffemaker2.png', 0],
            [18, '/uploads/products/Coffee Maker/coffemaker3.png', 0],

            // 19: Car Roof Box
            [19, '/uploads/products/Car Roof Box/carroofbox1.png', 1],
            [19, '/uploads/products/Car Roof Box/carroofbox2.png', 0],
            [19, '/uploads/products/Car Roof Box/carroofbox3.png', 0],

            // 20: Yoga Mat
            [20, '/uploads/products/Yoga Mat/yogamat1.png', 1],
            [20, '/uploads/products/Yoga Mat/yogamat2.png', 0]
        ];
        await pool.query(`INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?`, [imagesData]);

        console.log('Inserting Transactions & Reviews...');
        const transactionsData = [
            [1, 2, 3, 850.50, 'completed'], // Bike bought by user 2 from user 3
            [2, 3, 4, 120.00, 'accepted'],  // Sofa bought by user 3 from user 4
            [3, 4, 5, 750.00, 'pending'],   // Mac bought by user 4 from user 5
            [4, 5, 6, 400.00, 'completed'], // PS5 bought by user 5 from user 6
            [5, 6, 7, 45.00, 'rejected'],   // Jacket rejected
            [6, 7, 8, 150.00, 'completed']  // Guitar bought by user 7 from user 8
        ];
        await pool.query(`INSERT INTO transactions (product_id, buyer_id, seller_id, agreed_price, status) VALUES ?`, [transactionsData]);

        // Mark products as sold if completed
        await pool.query(`UPDATE products SET status = 'sold' WHERE id IN (2, 5, 7)`);

        const reviewsData = [
            // transaction_id, reviewer_id, reviewee_id, rating, comment
            [1, 2, 3, 5, 'Great seller, item exactly as described!'],
            [4, 5, 6, 4, 'Fast shipping but item had a small scratch not mentioned.'],
            [6, 7, 8, 5, 'Perfect transaction, highly recommended.']
        ];
        await pool.query(`INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment) VALUES ?`, [reviewsData]);

        console.log('✅ Seeding completed successfully! 20 Products, 10 Users, Transactions and Reviews populated.');

    } catch (err) {
        console.error('❌ Error during seeding:', err);
    } finally {
        process.exit();
    }
}

runSeed();
