const mysql = require('mysql2/promise');
require('dotenv').config();

// Connection Pool Configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eco_market',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// DB Connection Test
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database!');
        connection.release();
    } catch (err) {
        console.error('Error during database connection:', err.message);
    }
})();

module.exports = pool;
