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
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); //parameterized query to prevent SQL injection. if no user is found, returns HTTP 401
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Email not found or invalid' });
        }

        const match = await bcrypt.compare(password, user.password_hash); //password verification. bcrybt.compare hashes the plain-text password with the same salt stored in password_hash
        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        
        //session creation. creates a server side session record and sens a httpOnly set-cookie (connect.sid) to the browser with the session id.
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userName = user.name;

        //JSON response
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
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]); //check if email already exists. 
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email address already in use' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); //hash the password with bcrypt 

        const [result] = await pool.query(
            'INSERT INTO users (name, surname, email, password_hash) VALUES (?, ?, ?, ?)', //insert new user into database
            [name || '', surname || '', email, hashedPassword]
        );

        return res.status(201).json({ //JSON response
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
    req.session.destroy((err) => { //deletes the session from the server-side store
        if (err) return res.status(500).json({ message: 'Logout error' });
        res.clearCookie('connect.sid'); // instructs the browser to delete the session cookie; assuming default session cookie name
        return res.json({ message: 'Logged out' });
    });
});

module.exports = router;
