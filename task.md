# Progressi Sviluppo: Piattaforma Compravendita

**Stima Temporale Totale**: ~180 Ore

## Fase 1: Setup Progetto & Server base (Completata - 5%) - *Tempo stimato: 9h*
- [x] Inizializzazione Node.js ed Express.
- [x] Routing base (`/api` e `/`) e setup React nel frontend.

## Fase 2: Configurazione Database & Seed Base (Completata - 10%) - *Tempo stimato: 18h*
- [x] Schema DDL MySQL (`schema.sql`) per Entità.
- [x] Script per connessione DB (`db.js`).

## Fase 3: Back: HBS Views, Auth, Admin Dashboard (Completata - 10%) - *Tempo stimato: 18h*
- [x] Autenticazione con JWT / Cookie.
- [x] Pannello HBS Admin per gestione Utenti e Transazioni.

## Fase 4: Back: API REST complete (Prodotti, Transazioni, Review) (Completata - 15%) - *Tempo stimato: 27h*
- [x] Endpoint Catalogo Prodotti (con filtri e paginazione).
- [x] Endpoint Transazioni e Review.

## Fase 5: Front React: Architettura base, Router, Context Auth (Completata - 10%) - *Tempo stimato: 18h*
- [x] Inizializzare **React Router DOM** e definire le rotte base.
- [x] Sviluppare il **Context API per l'Auth** (`AuthContext`).
- [x] Creazione dei **servizi chiamate API** (`api.js`).
- [x] Inizializzare il file **`index.css` / `App.css`**.
- [x] Test di navigazione base delle rotte protette `PrivateRoute`.

## Fase 6: Front React: Public Views (Home, Catalogo, Dettaglio, Filtri) (Completata - 15%) - *Tempo stimato: 27h*
- [x] Creare **Navbar globale** e **Footer** (responsive).
- [x] Sviluppare la **Home Page / Catalogo** implementando CSS Grid.
- [x] Collegare i **Filtri** alle API e gestire paginazione.
- [x] Costruire la vista **Dettaglio Prodotto**.
- [x] Predisporre modale / blocco per fare un'offerta.

## Fase 7: Front React: Private Views (Dashboard, Add Prodotto, Acquisti) (Completata - 15%) - *Tempo stimato: 27h*
- [x] Costruire la **Dashboard User** con componenti Tab.
- [x] Implementare Form **Aggiungi Prodotto** con preview.
- [x] Visualizzare storico ordini in arrivo per accettarli/rifiutarli.
- [x] Permettere all'utente di rilasciare una **Review/Valutazione**.

## Fase 8: UI Premium e Pagine Mancanti (Completata - 10%) - *Tempo stimato: 18h*
- [x] Implementare pagina di **Login** interattiva.
- [x] Implementare pagina di **Registrazione** interattiva.
- [x] Completare i link del **Footer** (pagine statiche).
- [x] Perfezionare aspetti di micro-interazione: hover sui pulsanti, loading spinners (skeleton loaders per il catalogo).
- [x] Uniformare palette e font per l'aspetto **Premium**, ottimizzando bene Bootstrap + CSS Custom.

## Fase 9: Seed Finale, Test End-to-End e BugFix (In Lavorazione - 5%) - *Tempo stimato: 9h*
- [x] Popolare localmente il MySQL con un database verosimile e denso.
- [ ] Test End-to-End generale: registrazione, messa in vendita, ricerca altro utente, compravendita, valutazione.
- [ ] Risolvere eventuali errori o warning residui nella console JavaScript.

## Fase 10: Redazione Memoria e Verifica Criteri d'Esame (Da Iniziare - 5%) - *Tempo stimato: 9h*
- [ ] Ricontrollare il documento d'enunciato `Proyecto_Final_DAWeb_2026.txt` riga per riga e spuntare i requisiti.
- [x] Scrivere memoria di max 15 folios.
- [ ] Disegnare schema / diagramma software (Frontend React <-> Backend API e DB).
- [ ] Preparare la discussione orale (architettura, design pattern React e Node usati).
