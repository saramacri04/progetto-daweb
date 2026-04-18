# Progressi Sviluppo: Piattaforma Compravendita

**Stima Temporale Totale**: ~105 Ore

## Fase 1: Setup Progetto & Server base (Completata - 5%) - *Tempo stimato: 5h*
- [x] Inizializzazione Node.js ed Express.
- [x] Routing base (`/api` e `/`) e setup React nel frontend.

## Fase 2: Configurazione Database & Seed Base (Completata - 10%) - *Tempo stimato: 10h*
- [x] Schema DDL MySQL (`schema.sql`) per Entità.
- [x] Script per connessione DB (`db.js`).

## Fase 3: Back: HBS Views, Auth, Admin Dashboard (Completata - 15%) - *Tempo stimato: 15h*
- [x] Autenticazione con JWT / Cookie.
- [x] Pannello HBS Admin per gestione Utenti e Transazioni.

## Fase 4: Back: API REST complete (Prodotti, Transazioni, Review) (Completata - 15%) - *Tempo stimato: 15h*
- [x] Endpoint Catalogo Prodotti (con filtri e paginazione).
- [x] Endpoint Transazioni e Review.

## Fase 5: Front React: Architettura base, Router, Context Auth (In Corso - 10%) - *Tempo stimato: 10h*
- [x] Inizializzare **React Router DOM** e definire le rotte base (Main Layout, Auth, e rotte d'errore).
- [ ] Sviluppare il **Context API per l'Auth** (`AuthContext`) per mantenere lo stato dell'utente connesso, richiamando l'endpoint di verifica sessione o token login.
- [ ] Creazione dei **servizi chiamate API** (`api.js` o simili con Fetch/Axios) configurati per usare `/api` e scambiare le credenziali se presenti.
- [ ] Inizializzare il file **`index.css` / `App.css`**, impostando colori root, tipografia e griglia Bootstrap base.
- [ ] Test di navigazione base delle rotte protette `PrivateRoute`.

## Fase 6: Front React: Public Views (Home, Catalogo, Dettaglio, Filtri) (Da Iniziare - 20%) - *Tempo stimato: 20h*
- [ ] Creare **Navbar globale** e **Footer** (responsive).
- [ ] Sviluppare la **Home Page / Catalogo** implementando CSS Grid per la lista prodotti.
- [ ] Collegare i **Filtri** (categoria, prezzo max, orderBy) della UI alle API e gestire la paginazione interattiva.
- [ ] Costruire la vista **Dettaglio Prodotto** che preleva dati completi dall'ID prodotto (incluso carousel foto e info venditore).
- [ ] Predisporre modale / blocco per fare un'offerta (se utente loggato) o rimandare al login.

## Fase 7: Front React: Private Views (Dashboard, Add Prodotto, Acquisti) (Da Iniziare - 15%) - *Tempo stimato: 15h*
- [ ] Costruire la **Dashboard User** con componenti Tab per separare Vetrina, Venduti e Acquisti effettuati.
- [ ] Implementare Form **Aggiungi Prodotto**, curando gli input (Dropdown Categorie, Condizione) con preview dell'immagine prima del caricamento.
- [ ] Visualizzare storico ordini in arrivo per accettarli/rifiutarli.
- [ ] Permettere all'utente di rilasciare una **Review/Valutazione** per una transazione andata a buon fine.

## Fase 8: UI Premium e Test Finale: CSS Grid, Refinishing, Seed testati (Da Iniziare - 5%) - *Tempo stimato: 5h*
- [ ] Perfezionare aspetti di micro-interazione: hover sui pulsanti, loading spinners (skeleton loaders per il catalogo).
- [ ] Uniformare palette e font per l'aspetto **Premium**, ottimizzando bene Bootstrap + CSS Custom.
- [ ] Popolare localmente il MySQL con un database verosimile e denso.
- [ ] Test End-to-End generale: registrazione, messa in vendita, ricerca altro utente, compravendita, valuzione.
- [ ] BugFix console JavaScript.

## Fase 9: Redazione Memoria e Verifica Criteri d'Esame (Da Iniziare - 5%) - *Tempo stimato: 10h*
- [ ] Ricontrollare il documento d'enunciato `Proyecto_Final_DAWeb_2026.txt` riga per riga e spuntare i requisiti.
- [ ] Scrivere memoria di max 15 folios.
- [ ] Disegnare schema / diagramma software (Frontend React <-> Backend API e DB).
- [ ] Preparare la discussione orale (architettura, design pattern React e Node usati).
