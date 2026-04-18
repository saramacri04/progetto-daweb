const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../db');

// Check Current Session Status
router.get('/me', async (req, res) => {
    if (req.session && req.session.userId) {
        // Return user info
        return res.json({
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            }
        });
    }
    return res.status(401).json({ message: 'No active session' });
});

// JSON Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Email not found or invalid' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userName = user.name;

        return res.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error("API Login error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// JSON Register
router.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email address already in use' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            'INSERT INTO users (name, surname, email, password_hash) VALUES (?, ?, ?, ?)',
            [name || '', surname || '', email, hashedPassword]
        );

        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.insertId, name: name, role: 'user' }
        });
    } catch (err) {
        console.error("API Register error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// JSON Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Logout error' });
        res.clearCookie('connect.sid'); // Assuming default session cookie name
        return res.json({ message: 'Logged out' });
    });
});

module.exports = router;
