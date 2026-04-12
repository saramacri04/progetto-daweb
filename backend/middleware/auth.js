// Middleware per proteggere le rotte private
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    // Se non autorizzato, rinvialo al login
    res.redirect('/login');
};

// Middleware per proteggere le rotte admin
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'admin') {
        return next();
    }
    // Se non amministratore, rimanda alla home o mostra errore
    res.status(403).send("Accesso negato: richiesti privilegi di amministratore.");
};
