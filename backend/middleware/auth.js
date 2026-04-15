// Middleware to protect private routes
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    // If not authorized, redirect to login
    res.redirect('/login');
};

// Middleware to protect admin routes
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'admin') {
        return next();
    }
    // If not an administrator, deny access
    res.status(403).send("Access denied: administrator privileges required.");
};
