import React from 'react';

export const AboutUs = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">Chi Siamo</h1>
        <p className="lead text-secondary">EcoMarket è la piattaforma leader per la compravendita di oggetti di seconda mano, con una forte vocazione per la sostenibilità.</p>
        <p>Crediamo in un mondo in cui ogni oggetto merita una seconda vita. Oltre a ridurre gli sprechi e l'impatto ambientale, la nostra piattaforma permette a chiunque di guadagnare da ciò che non usa più e di trovare grandi affari su prodotti di qualità.</p>
        <p>Il nostro team è composto da appassionati di tecnologia ed ecologia, uniti dalla missione di rendere l'economia circolare accessibile a tutti, in modo sicuro e conveniente.</p>
    </div>
);

export const Contact = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">Contattaci</h1>
        <p className="lead text-secondary">Siamo qui per aiutarti. Se hai domande, suggerimenti o hai bisogno di assistenza, non esitare a contattarci.</p>
        <div className="card border-0 bg-light p-4 mt-4 rounded-4">
            <ul className="list-unstyled mb-0">
                <li className="mb-3"><i className="bi bi-envelope-fill text-success me-2"></i> <strong>Email:</strong> support@ecomarket.com</li>
                <li className="mb-3"><i className="bi bi-telephone-fill text-success me-2"></i> <strong>Telefono:</strong> +39 012 345 6789</li>
                <li><i className="bi bi-geo-alt-fill text-success me-2"></i> <strong>Indirizzo:</strong> Via Roma 1, 00100 Roma, Italia</li>
            </ul>
        </div>
        <p className="mt-4 text-muted">Il nostro servizio clienti è attivo dal Lunedì al Venerdì, dalle 9:00 alle 18:00.</p>
    </div>
);

export const Terms = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold mb-4 text-success">Termini di Servizio & Privacy</h1>
        
        <h4 className="mt-4">1. Accettazione dei Termini</h4>
        <p className="text-secondary">Utilizzando EcoMarket, accetti di essere vincolato da questi termini. Se non sei d'accordo, ti invitiamo a non utilizzare la piattaforma.</p>
        
        <h4 className="mt-4">2. Responsabilità degli Utenti</h4>
        <p className="text-secondary">Gli utenti sono responsabili per i contenuti pubblicati e per la veridicità delle informazioni fornite. EcoMarket agisce solo come intermediario tecnologico.</p>
        
        <h4 className="mt-4">3. Privacy Policy</h4>
        <p className="text-secondary">Rispettiamo la tua privacy. I tuoi dati personali sono trattati in conformità con il GDPR. Non venderemo mai i tuoi dati a terzi per scopi di marketing senza il tuo esplicito consenso.</p>
        
        <h4 className="mt-4">4. Transazioni</h4>
        <p className="text-secondary">EcoMarket non è responsabile per l'esito delle compravendite tra privati. Raccomandiamo sempre l'uso del buon senso, lo scambio a mano in luoghi pubblici o metodi di pagamento sicuri.</p>
    </div>
);

export const HowItWorks = () => (
    <div className="container py-5 my-5">
        <h1 className="fw-bold text-center mb-5 text-success">Come Funziona EcoMarket</h1>
        <div className="row mt-5">
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-camera text-success" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">1. Pubblica</h3>
                <p className="text-secondary">Scatta qualche foto al tuo oggetto, descrivilo accuratamente e imposta un prezzo. Ci vorranno meno di due minuti.</p>
            </div>
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-chat-dots text-success" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">2. Accordati</h3>
                <p className="text-secondary">Ricevi offerte dai compratori, accetta quelle migliori e mettetevi d'accordo tramite email per la spedizione o il ritiro a mano.</p>
            </div>
            <div className="col-md-4 mb-4 text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                    <i className="bi bi-star text-success" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="fw-bold">3. Valuta</h3>
                <p className="text-secondary">Una volta concluso l'affare, lascia una recensione al venditore per aiutare la community a crescere in modo sicuro e trasparente.</p>
            </div>
        </div>
    </div>
);
