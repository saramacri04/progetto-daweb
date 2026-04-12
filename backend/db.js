const mysql = require('mysql2/promise');
require('dotenv').config();

// Configurazione Pool di connessioni
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eco_market',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test della connessione al DB
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connesso al database MySQL con successo!');
        connection.release();
    } catch (err) {
        console.error('Errore durante la connessione al database:', err.message);
    }
})();

module.exports = pool;
