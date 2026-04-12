const bcrypt = require('bcrypt');
const pool = require('../db');

// Autenticazione (Logica login)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.render('login', { title: 'Accedi - EcoMarket', error: 'Email non trovata o non valida.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', { title: 'Accedi - EcoMarket', error: 'Password non corretta.' });
        }

        // Login su sessione
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userName = user.name;
        
        return res.redirect('/');
    } catch (err) {
        console.error("Errore login:", err);
        return res.render('login', { title: 'Accedi - EcoMarket', error: 'Errore interno al server.' });
    }
};

// Registrazione
exports.registerUser = async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;

    try {
        // Controllo se esiste già l'email
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.render('register', { title: 'Registrati - EcoMarket', error: 'L\'indirizzo email è già in uso.' });
        }

        // Hashing della password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Inserimento utente (i campi db sono name, surname)
        await pool.query(
            'INSERT INTO users (name, surname, email, password_hash) VALUES (?, ?, ?, ?)',
            [nombre, apellidos, email, hashedPassword]
        );

        // Volendo possiamo autologgarlo o direzionarlo al login
        return res.redirect('/login?registered=true');
    } catch (err) {
        console.error("Errore registrazione:", err);
        return res.render('register', { title: 'Registrati - EcoMarket', error: 'Errore durante la registrazione.' });
    }
};

// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
             console.error("Logout error", err);
        }
        res.redirect('/');
    });
};
