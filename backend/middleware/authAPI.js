const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Autenticazione mancante o formato token invalido.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_super_sicuro');
        
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        console.error('API Auth Middleware Error:', err);
        return res.status(403).json({ success: false, message: 'Token non valido o scaduto.' });
    }
};
