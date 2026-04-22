# Istruzioni di Avvio Progetto

Questo progetto è diviso in due parti: **Backend** (Node.js + Express) e **Frontend** (React + Vite).  
Per farlo funzionare in locale servono **tre terminali**: uno per MySQL, uno per il backend, uno per il frontend.

---

## ⚙️ PREREQUISITO — Solo la primissima volta

Prima di tutto, devi preparare il database. Fallo **una sola volta** alla prima installazione.

### 1. Avvia MySQL
```bash
brew services start mysql
```

### 2. Importa la struttura del database
```bash
cd ~/Desktop/progettodaweb/progetto-daweb/backend
mysql -u root eco_market < schema.sql
```

> ⚠️ Se compare l'errore `Unknown database 'eco_market'`, crealo prima:
> ```bash
> mysql -u root -e "CREATE DATABASE IF NOT EXISTS eco_market;"
> mysql -u root eco_market < schema.sql
> ```

### 3. Carica i dati di prova (opzionale)
```bash
node seed.js
```

> ⚠️ Se `seed.js` dà errore SQL sulla parola `condition`, è un bug del file seed — puoi saltare questo passaggio e procedere comunque. Il sito funzionerà, ma sarà vuoto di prodotti di prova.

---

## 🟢 Terminale 1 — Avviare il Backend

Apri un terminale e inserisci questi comandi **uno alla volta**, partendo sempre dalla cartella root del progetto:

```bash
# 1. Entra nella cartella backend
cd ~/Desktop/progettodaweb/progetto-daweb/backend

# 2. Installa le dipendenze (solo la prima volta)
npm install

# 3. Avvia il server
node server.js
```

✅ **Esito corretto:**
```
Server started on http://localhost:3000
Successfully connected to MySQL database!
```

❌ *Non chiudere questo terminale mentre stai lavorando.*

---

## 🔵 Terminale 2 — Avviare il Frontend

Apri un **secondo terminale separato** e inserisci:

```bash
# 1. Entra nella cartella frontend
cd ~/Desktop/progettodaweb/progetto-daweb/frontend

# 2. Installa le dipendenze (solo la prima volta)
npm install

# 3. Avvia il server di sviluppo
npm run dev
```

✅ **Esito corretto:** Vite mostrerà il link → apri **http://localhost:5173** nel browser.

❌ *Non chiudere questo terminale mentre stai lavorando.*

---

## 💡 Promemoria per ogni sessione di lavoro

Ogni volta che riaccendi il computer, prima di avviare backend e frontend:

```bash
brew services start mysql
```

Per fermarlo quando hai finito:
```bash
brew services stop mysql
```

---

## 🗂️ Struttura cartelle di riferimento

```
progetto-daweb/
├── backend/
│   ├── .env          ← variabili d'ambiente (DB, JWT, ecc.)
│   ├── server.js     ← punto di avvio del server
│   ├── schema.sql    ← struttura del database
│   ├── seed.js       ← dati di prova
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── views/
└── frontend/
    └── src/          ← codice React
```
