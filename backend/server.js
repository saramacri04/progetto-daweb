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
    secret: process.env.SESSION_SECRET || 'segreto_super_sicuro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // metti a true se usi https in prod
}));

// Servire file statici (CSS, JS, Immagini)
app.use(express.static(path.join(__dirname, 'public')));

// Configurazione Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Importazione Routes
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

// Definizione del Routing
// /api/* -> JSON Response (per il Frontend React)
app.use('/api', apiRoutes);

// /* -> Render HBS (Pagine HTML)
app.use('/', webRoutes);

// Avvio Server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
