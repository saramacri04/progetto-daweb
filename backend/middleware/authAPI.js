module.exports = (req, res, next) => {
    // Il login nel backend usa express-session (req.session), non JWT.
    // Dobbiamo verificare se l'utente è loggato tramite la sessione.
    if (req.session && req.session.userId) {
        req.user = {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.userRole
        };
        next();
    } else {
        return res.status(401).json({ success: false, message: 'Missing authentication or invalid session.' });
    }
};
