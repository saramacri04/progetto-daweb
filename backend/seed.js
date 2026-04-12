const pool = require('./db');
const bcrypt = require('bcrypt');

async function runSeed() {
    console.log('🌱 Inizio il seeding del database...');
    
    try {
        // Drop existing tables in reverse order of foreign keys
        // Attenzione: lo script schema.sql crea tabelle, ma non le cancella.
        // Qui ci assicuriamo che il DB sia pronto, ma diamo per scontato che 
        // le tabelle siano state create (eseguendo prima schema.sql)

        // Password comune per gli account di test
        const passwordHash = await bcrypt.hash('password123', 10);

        // 1. Popolamento Users
        console.log('Inserimento Utenti...');
        const [users] = await pool.query(`INSERT INTO users (name, surname, email, password_hash, role) VALUES 
            ('Admin', 'Super', 'admin@ecomarket.it', ?, 'admin'),
            ('Mario', 'Rossi', 'mario@email.it', ?, 'user'),
            ('Giulia', 'Bianchi', 'giulia@email.it', ?, 'user')
            ON DUPLICATE KEY UPDATE id=id`, [passwordHash, passwordHash, passwordHash]);
            
        // 2. Popolamento Categories
        console.log('Inserimento Categorie...');
        await pool.query(`INSERT IGNORE INTO categories (id, name, description, icon) VALUES 
            (1, 'Elettronica', 'Smartphone, PC, e gadget tech', 'bi-laptop'),
            (2, 'Abbigliamento', 'Vestiti, scarpe e accessori', 'bi-bag'),
            (3, 'Casa e Giardino', 'Mobili, decorazione, giardinaggio', 'bi-house'),
            (4, 'Motori', 'Auto, moto e accessori', 'bi-car-front'),
            (5, 'Sport e Tempo Libero', 'Attrezzatura sportiva e hobby', 'bi-bicycle')`);

        // 3. Popolamento Products
        // Recuperiamo gli ID utente (assumendo che le chiavi siano 1, 2, 3 per semplicità o selezionandole)
        console.log('Inserimento Prodotti...');
        await pool.query(`INSERT IGNORE INTO products (id, title, description, price, condition, seller_id, category_id, shipping_available, pickup_location) VALUES 
            (1, 'iPhone 13 Pro Max', 'Tenuto perfettamente, batteria al 90%, completo di scatola', 600.00, 'Come nuovo', 2, 1, 1, 'Milano'),
            (2, 'Bici da Corsa in Carbonio', 'Usata pochissimo, pneumatici nuovi', 850.50, 'Buono stato', 3, 5, 0, 'Roma'),
            (3, 'Divano 3 Posti IKEA', 'Comodo divano grigio sfoderabile, vendo per trasloco', 120.00, 'Accettabile', 2, 3, 0, 'Firenze')`);

        // 4. Popolamento Immagini
        console.log('Inserimento Immagini Prodotti...');
        await pool.query(`INSERT IGNORE INTO product_images (product_id, image_url, is_primary) VALUES 
            (1, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400', 1),
            (2, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400', 1),
            (3, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400', 1)`);

        console.log('✅ Seeding completato con successo!');
        
    } catch (err) {
        console.error('❌ Errore durante il seeding:', err);
    } finally {
        process.exit();
    }
}

runSeed();
