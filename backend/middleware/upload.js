const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Verifica e crea la cartella di upload se non esiste
const uploadDir = path.join(__dirname, '../public/uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nome file univoco per evitare sovrascritture
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Il file caricato non è un\'immagine valida!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite 5MB
    }
});

module.exports = upload;
