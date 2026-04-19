# Istruzioni di Avvio Progetto

Questo progetto completo è diviso in due parti separate che devono comunicare tra loro: **Backend** (Server Node.js ed Express) e **Frontend** (Client React con Vite).

Per far funzionare correttamente la piattaforma in locale sul tuo computer, dovrai tenere sempre aperti **due terminali in parallelo**, partendo dalla cartella principale in cui ti trovi (`/progetto-daweb`).

---

## 🟢 Terminale 1: Avviare il Server Backend

Questo terminale serve a tenere attive le API REST e le funzionalità del pannello amministrativo (Handlebars). Di logica, il server Node.js girerà sulla porta `3000`.

Inserisci uno alla volta questi comandi:

```bash
# 1. Entra nella cartella del backend
cd backend

# 2. Installa le librerie necessarie (Fallo solo la prima volta o se ci sono stati aggiornamenti)
npm install

# 3. Avvia il server 
node server.js
```
✅ **Esito corretto:** Il terminale ti restituirà la frase `Server started on http://localhost:3000`. 
❌ *Non chiudere questo terminale finché stai programmando.*

---

## 🔵 Terminale 2: Avviare il Client Frontend

Questo terminale va aperto a parte e serve a compilare l'interfaccia React in tempo reale mentre apportiamo modifiche al codice. Di default si aprirà sulla porta `5173`.

Dopo aver aperto un **nuovo pannello terminale** parallelo nella cartella root:

```bash
# 1. Entra nella cartella del frontend
cd frontend

# 2. Installa le librerie React necessarie (Fallo solo la prima volta)
npm install

# 3. Mettiti in "ascolto" per compilare in tempo reale
npm run dev
```
✅ **Esito corretto:** Il terminale stamperà il logo di Vite in verde e blu fornendoti il link per visualizzare il sito (`http://localhost:5173/`).

---

### 💡 Due promemoria essenziali:
1. **Verificare Database MySQL:** Prima di accendere il Terminale 1, assicurati che il server logico del database (es. XAMPP e MySQL) sia regolarmente acceso e attivo, altrimenti il Backend fallirà la connessione dando errore.
2. **Setup DB iniziale:** Se non lo hai ancora fatto in precedenza da XAMPP/MySQL Workbench, la primissima volta ricordati di importare o lanciare lo schema di strutturazione database che si trova in `backend/schema.sql` per far esistere le tabelle, e lanciare un veloce `node seed.js` da dentro la cartella `backend` se vuoi auto-generare degli utenti utente e prodotti di prova per testare la grafica.
