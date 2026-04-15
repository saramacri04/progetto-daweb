const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secure_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using https in prod
}));

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars Configuration
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: {
        eq: (v1, v2) => v1 === v2
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware to inject session into Handlebars
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole
    } : null;
    next();
});

// Import Routes
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

// Routing Definition
// /api/* -> JSON Response (for React Frontend)
app.use('/api', apiRoutes);

// /* -> Render HBS (HTML Pages)
app.use('/', webRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
