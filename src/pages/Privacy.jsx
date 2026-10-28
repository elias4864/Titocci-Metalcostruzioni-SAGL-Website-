import { Link } from "react-router-dom";
import React from "react";
import Impressumbild from "../assets/Impressum.jpg";
import '../Styles/Privacy.css';

const navButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#e62b2b',
    color: 'white',
    border: 'none',
    padding: '16px 28px',
    minWidth: '60px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
    zIndex: 10
};

const imageCaptionStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: 'white',
    padding: '10px 0',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    zIndex: 2
};

const heroOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none'
};

function Privacy({lang}) {
    return (
        <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            overflow: 'hidden',
            marginTop: '0px',
            backgroundColor: '#fff'
        }}>
            <div style={{ position: 'relative', width: '100%' }}>

                {/* Navbar */}
                <nav style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 50px',
                    boxSizing: 'border-box',
                    zIndex: 20,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    </div>

                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '35px',
                        margin: 0,
                        padding: 0
                    }}>
                        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Home</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Chi siamo</Link></li>
                        <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Servizi</Link></li>
                        <li><Link to="/galeria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Galleria</Link></li>
                        <li><Link to="/kontakte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Contatti</Link></li>
                    </ul>
                </nav>

                {/* Bild */}
                <img
                    src={Impressumbild}
                    alt="Privacy Header"
                    style={{
                        width: '100vw',
                        height: '60vh',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />

                {/* Dunkler Layer */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 2
                }} />

                {/* Text Overlay */}
                <div style={heroOverlayStyle}>
                    <h1 style={{
                        color: '#e62b2b',
                        fontSize: '40px',
                        fontWeight: 'bold',
                        margin: 0,
                        textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                    }}>
                        Privacy
                    </h1>
                </div>
            </div>

            {/* Inhaltsbereich (Mittig zentriert) */}
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '60px 20px',
                textAlign: 'left',
                color: '#333',
                lineHeight: '1.6'
            }}>
                <h1 className="black-text" style={{ fontSize: '28px', marginBottom: '20px' }}>Privacy e Cookie Policy per titocci.ch</h1>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Informazioni generali</b>
                </h2>
                <p style={{ margin: '10px 0', color: '#666' }}>Data ultima modifica: 04/06/2021</p>
                <p style={{ margin: '10px 0' }}>Titocci.ch (di seguito “il sito web”) raccoglie alcuni dati personali degli utenti che vi navigano.</p>

                <div className="section-text" style={{ margin: '10px 0', color: '#666' }}>
                    In base all’articolo 13 della Costituzione federale svizzera e alle disposizioni federali sulla protezione dei dati (Legge sulla protezione dei dati, DSG), ogni persona ha diritto alla protezione della propria privacy e alla protezione dall’uso improprio dei propri dati personali. Gli operatori di questo sito web prendono molto sul serio la protezione dei tuoi dati personali. Trattiamo i vostri dati personali in modo confidenziale e in conformità con le norme di legge sulla protezione dei dati e la presente dichiarazione sulla protezione dei dati.
                </div>

                <p style={{ margin: '15px 0', color: '#666' }}>Questa informativa riguarda esclusivamente il sito web, dove non diversamente specificato.</p>
                <p style={{ margin: '15px 0', color: '#666' }}>Il sito web <span style={{ textDecoration: 'underline' }}>non fornisce servizi a minori di 18 anni.</span> In caso di richieste effettuate per o da minori deve essere il genitore, o chi detiene la patria potestà, a compilare le richieste dati.</p>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Modifiche a questa Privacy Policy</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il titolare ha il diritto di modificare questo documento avvisando gli utenti su questa stessa pagina oppure, se previsto e possibile, tramite i contatti di cui è in possesso. L’utente è quindi invitato a consultare periodicamente questa pagina. Per conferma sull’effettiva modifica consultare la data di ultima modifica indicata in fondo alla pagina.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il titolare si occuperà di raccogliere nuovamente il consenso degli utenti nel caso in cui le modifiche a questo documento riguardino trattamenti di dati per i quali è necessario il consenso.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Dichiarazione sulla protezione dei dati per la crittografia SSL / TLS</b>
                </h2>
                <div className="section-text" style={{ margin: '15px 0' }}>
                    Questo sito web utilizza la crittografia SSL / TLS per motivi di sicurezza e per proteggere la trasmissione di contenuti riservati, come le richieste che ci invii come operatore del sito web. È possibile riconoscere una connessione crittografata dal fatto che la riga dell’indirizzo del browser cambia da “http: //” a “https: //” e dal simbolo del lucchetto nella riga del browser.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Se la crittografia SSL o TLS è attivata, i dati che ci trasmetti non possono essere letti da terzi.
                </div>

                <h1 className="black-text" style={{ fontSize: '25px', marginTop: '40px', marginBottom: '20px' }}>Modalità, luoghi e tempi del trattamento dei dati acquisiti</h1>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Titolare e responsabile del trattamento dei dati personali</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Marco Titocci, Zona Industriale 2 – 6670 Avegno, Tel. <a className="highlight-red" href="tel:+41917962369">+41 91 796 23 69</a>, <a className="highlight-red" href="mailto:info@titocci.ch">E-mail: info@titocci.ch</a>
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Luoghi di mantenimento dei dati acquisiti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    I dati personali degli utenti sono mantenuti e trattati nella sede operativa e amministrativa del titolare, nonché nelle webfarm dove risiedono i server che ospitano il sito web, o sui server che ne effettuano le copie di sicurezza. I dati personali dell’utente risiedono in Svizzera.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Tempi di mantenimento dei dati acquisiti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Nel caso di dati acquisiti direttamente tramite il sito web i dati vengono conservati per 24 mesi successivi al completamento del servizio. Oppure fino a quando non ne venga revocato il consenso.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Nel caso in cui il titolare fosse obbligato a conservare i dati personali in ottemperanza di un obbligo di legge o per ordine di autorità, il titolare può conservare i dati per un tempo maggiore, necessario agli obblighi.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Al termine del periodo di conservazione i dati personali saranno cancellati. Dopo il termine, non sarà più possibile accedere ai propri dati, richiederne la cancellazione e la portabilità.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Modalità di trattamento dei dati acquisiti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il titolare ha progettato un sistema informatico opportuno a garantire misure di sicurezza ritenute adatte ad impedire l’accesso, la divulgazione, la modifica, la cancellazione non autorizzata, la perdita, l’uso improprio o la falsificazione di dati personali.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il trattamento avviene, da parte del nostro personale autorizzato, mediante strumenti automatizzati nel rispetto della normativa vigente ed in conformità ai principi di correttezza, liceità, trasparenza, tutela della riservatezza dell’utente e dei suoi diritti, per il tempo strettamente necessario all’utilizzo del servizio. Il nostro sistema informatico è strutturato in modo da prevenire la perdita dei dati, usi illeciti o non corretti ed accessi non autorizzati.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente ha diritto a ottenere informazioni in merito alle misure di sicurezza adottate dal titolare per proteggere i dati.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Vorremmo sottolineare che la trasmissione di dati su Internet (ad es. Quando si comunica tramite e-mail) può avere lacune di sicurezza. Non è possibile una protezione completa dei dati contro l’accesso da parte di terzi.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Accessi ai dati oltre al titolare</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Hanno accesso ai dati personali raccolti da <span><a className="highlight-red" href="/">https://titocci.ch</a></span> solamente il titolare e/o soggetti esterni (quali ad esempio fornitori di servizi informatici terzi, webfarm, agenzie di comunicazione, fornitori di servizi complementari). Se necessario tali strutture sono nominate dal titolare responsabili del trattamento.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente può richiedere in qualsiasi momento al titolare del trattamento, l’elenco aggiornato dei responsabili del trattamento.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Comunicazione di eventuali accessi indesiderati al Garante della Privacy</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il nostro sistema informatico è monitorato e controllato da tecnici e sistemisti. Ciò non toglie che, anche se ritenuta possibilità remota, ci possa essere un accesso indesiderato. Nel caso in cui questo si verifichi il titolare si impegna, come da GDPR ad effettuarne comunicazione al Garante della Privacy entro i termini previsti dalla legge.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Tipi di dati acquisiti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il sito Web raccoglie dati degli utenti direttamente o tramite terze parti. Maggiori dettagli sul tipo di dati raccolti per ogni servizio sono specificati nelle sezioni dedicate di questa privacy policy. Le tipologie di dati raccolti automaticamente sono:
                </div>

                <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
                    <li>Indirizzo IP (in forma anonima)</li>
                    <li>Browser usato e tipo di dispositivo usato per la connessione</li>
                    <li>Pagina web di arrivo (o provenienza), lista delle pagine visitate, percorso seguito, tempo di visita di ciascuna pagina e pagina di uscita</li>
                    <li>Data e ora della visita</li>
                    <li>In generale, i dati tecnici di navigazione</li>
                </ul>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Questi ultimi sono raccolti in forma aggregata e anonima.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il sito web utilizza strumenti di statistica per il tracciamento della navigazione degli utenti, l’analisi avviene tramite log. Non utilizza direttamente cookie ma può utilizzare cookie includendo servizi di terzi.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    I dati personali che potrebbero eventualmente, deliberatamente, volontariamente e in modo facoltativo essere forniti dall’utente tramite la compilazione di form includono (ma la lista non è esaustiva):
                </div>

                <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
                    <li>nome, cognome</li>
                    <li>numero di telefono</li>
                    <li>Indirizzo Email</li>
                    <li>Tutti i dati che saranno immessi nella casella di testo dei form di contatto</li>
                </ul>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’uso del/dei form di contatto per contattare il titolare del sito web non è obbligatorio ai fini della navigazione sul sito ma il suo uso implica in modo esplicito l’accordo ad essere ricontattati. Nel caso in cui l’utente preferisca non comunicare questi dati, il servizio sarà fornito ugualmente dal sito web.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’invio di posta elettronica, chiamate telefoniche o qualsiasi contatto avvenga fra l’utente e il titolare del sito web tramite dati del sito web sono facoltative ma comportano la successiva acquisizione e trattamento dei dati personali forniti. Questi rapporti non sono più regolati da questa dichiarazione ma secondo le politiche aziendali del titolare.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Prima di inserire dati di terze persone nel sito web l’utente deve verificare di averne i permessi e la base legale. Il sito non può essere responsabile per tali tipi di abusi.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Ciascun utilizzo di cookie viene dettagliato nella <span><a className="highlight-red" href="https://titocci.ch/politica-dei-cookie-ue/">Cookie Policy</a></span>
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Finalità del trattamento dei dati acquisiti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    I dati dell’utente sono raccolti dal titolare per le seguenti finalità:
                </div>

                <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
                    <li>fornire informazioni tecniche e commerciali</li>
                    <li>fornire preventivi agli utenti</li>
                    <li>adempiere eventuali obblighi di legge</li>
                    <li>rispondere ad azioni legali</li>
                    <li>individuare e proteggersi da abusi sul sito web (come ad esempio protezione dallo spam)</li>
                    <li>statistiche e analisi dei comportamenti degli utenti</li>
                </ul>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente può richiedere in qualsiasi momento al titolare del trattamento, chiarimenti sulle finalità di ciascun trattamento.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Base giuridica del trattamento</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Il trattamento si rende necessario:
                </div>

                <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
                    <li>se l’utente ha deliberatamente accettato il trattamento per una o più finalità</li>
                    <li>Per rapporti precontrattuali come, ad esempio, fornire un preventivo o sottoporre un contratto all’utente</li>
                    <li>per fornire un servizio all’utente</li>
                    <li>Affinché il titolare possa adempiere ad un compito di interesse pubblico</li>
                    <li>Affinché il titolare possa adempiere ad un esercizio di pubblici poteri</li>
                    <li>Per l’obbligo, da parte del titolare, dell’esecuzione di compiti di pubblico interesse</li>
                    <li>perché il titolare o terzi possano perseguire i propri legittimi interessi.</li>
                </ul>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente può richiedere in qualsiasi momento al titolare del trattamento, chiarimenti sulla base giuridica di ciascun trattamento.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Dettagli specifici sull’acquisizione e uso dei dati personali</b>
                </h2>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Per contattare l’utente</b>
                </h2>

                <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>
                    <i>Moduli di contatto</i>
                </h3>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Fornitore del servizio: Il sito web
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Finalità</b> del servizio: L’utente può compilare il/i moduli di contatto/richiesta informazioni, inserendo i propri dati, acconsentendo così in modo esplicito al loro uso per rispondere alle richieste di natura indicata nella intestazione del modulo.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Dati personali che potrebbero essere raccolti: nome, cognome, email, numero di telefono e qualunque altro dato l’utente scelga di inserire nella caselle. L’inserimento di qualunque dato nel/i moduli di contatto rappresenta esplicito consenso al suo trattamento.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Luogo del trattamento</b>: Germania.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Google fonts</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Fornitore del servizio</b>: Google, Inc.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Finalità del servizio</b>: Visualizzazione di font (stili di caratteri) diversi da quelli standard del browser.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Dati raccolti</b>: dati di utilizzo e quelli specificati nella privacy policy Google.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Luogo del trattamento</b>: Olanda o Stati uniti (a seconda del paese da cui ci si collega al sito web).
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Privacy Policy</b>: <a className="highlight-red" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">https://policies.google.com/privacy</a>
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Utilizzo di Google Maps</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Questo sito web utilizza l’offerta di Google Maps. Questo ci consente di mostrarti mappe interattive direttamente sul sito web e ti consente di utilizzare comodamente la funzione mappa. Quando visiti il sito Web, Google registra la tua visita alla pagina del sito Web. Ciò accade indipendentemente dal fatto che tu abbia un account utente a cui hai effettuato l’accesso o che non sia presente un account utente Google. Se hai effettuato l’accesso a Google, i tuoi dati verranno assegnati direttamente al tuo account. Se non desideri essere collegato al tuo profilo su Google, devi disconnetterti prima di usare le mappe. Google salva i tuoi dati come profilo di utilizzo e li utilizza per pubblicità, ricerche di mercato e / o progettazione del proprio sito in base alle esigenze. Tale valutazione avviene in particolare (anche per gli utenti che non hanno effettuato l’accesso) per fornire pubblicità basata sulle esigenze e per informare gli altri utenti del social network sulle vostre attività sul nostro sito web. Hai il diritto di opporti alla creazione di questi profili utente, anche se devi contattare Google per esercitare questo diritto.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    Per statistiche
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Questi servizi sono utilizzati dal titolare del trattamento e da terzi per analizzare il traffico effettuato dagli utenti sul sito web.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    I dati acquisiti e l’utilizzo degli stessi da parte di servizi terzi sono regolamentati dalle rispettive Privacy Policy alle quali si prega di fare riferimento.
                </div>

                <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>
                    <i>Google Analytics</i>
                </h3>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Fornitore del servizio</b>: Google, Inc.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Finalità del servizio:</b> servizio di analisi web. Questo servizio raccoglie i dati dell’utente (in forma anonima grazie all’anonimizzazione dell’IP) per monitorare e analizzare l’utilizzo del sito web, generare report e utilizzarli anche per gli altri servizi di Google.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Diritti dell’utente</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente possiede tutti i diritti previsti dall’art. 12 del EU GDPR, il diritto di controllare, modificare e integrare (rettificare), cancellare i propri dati personali contattando il titolare o nel caso di servizi di terzi accedendo ai loro siti internet come da elenco.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    Nello specifico ha il diritto di:
                </div>

                <ul style={{ paddingLeft: '20px', margin: '15px 0' }}>
                    <li><b>Accesso</b>: sapere se il titolare detiene dati personali relativi l’utente e quali siano questi dati (art. 15 Diritto all’accesso)</li>
                    <li><b>Modificare, integrare o rettificare</b> i dati personali inesatti o incompleti (Art. 16 Diritto di rettifica)</li>
                    <li><b>Richiedere la cancellazione</b> di uno o parte dei dati personali mantenuti se sussiste uno dei motivi previsti dal GDPR (Diritto alla Cancellazione, 17)</li>
                    <li><b>Revocare</b> in qualsiasi momento il proprio consenso</li>
                    <li><b>Limitare il trattamento</b> solo a parte dei dati personali, o revocarne completamente il consenso al trattamento, se sussiste uno dei motivi previsti dal Regolamento (Art. 18 Diritto alla limitazione del trattamento)</li>
                    <li><b>Ricevere o far trasferire</b> ad altro titolare copia di tutti i dati personali in possesso del titolare, in formato di uso comune organizzato, e leggibili anche da dispositivo automatico (Art. 20, Diritto alla Portabilità)</li>
                    <li><b>Opporsi</b> in tutto o in parte al trattamento dei dati se questo è avvenuto per motivi diversi dal consenso esplicito (art. 21 Diritto di opposizione)</li>
                    <li><b>Opporsi al trattamento dei dati</b> in modalità automatica o meno per finalità di profilazione (c.d. Consenso). Si fa presente agli utenti che possono opporsi al trattamento dei dati utilizzati per scopo pubblicitario, senza fornire alcuna motivazione</li>
                    <li><b>Proporre reclamo</b> all’autorità di controllo o agire in sede giudiziale</li>
                </ul>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Come un utente può esercitare i propri diritti</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente può esercitare i propri diritti sopra esposti comunicandone richiesta al titolare del trattamento.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    La richiesta di esercitare un proprio diritto non ha nessun costo. Il titolare si impegna ad evadere le richieste nel minor tempo possibile, e comunque entro un mese.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    L’utente ha il diritto di proporre reclamo all’Autorità Garante per la Protezione dei dati Personali.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Informazioni aggiuntive sul trattamento dei dati</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Difesa in giudizio</b><br />
                    Nel caso di ricorso al tribunale per abuso da parte dell’utente nell’utilizzo del sito Web o dei servizi a esso collegati, il titolare ha la facoltà di rivelare i dati personali dell’utente. È inoltre obbligato a fornire i suddetti dati su richiesta delle autorità pubbliche.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Richiesta di informative specifiche</b><br />
                    L’utente ha diritto di richiedere al titolare del trattamento informative specifiche sui servizi presenti sul sito web e/o la raccolta e l’utilizzo dei dati personali.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Raccolta dati per log di sistema e manutenzione</b><br />
                    Il sito web e/o i servizi di terze parti possono raccogliere i dati personali dell’utente, come ad esempio l’indirizzo IP, sotto forma di log di sistema. La raccolta di questi dati è legata al funzionamento e alla manutenzione del sito web.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Informazioni non contenute in questa policy</b><br />
                    L’utente ha diritto di richiedere in ogni momento al titolare del trattamento dei dati le informazioni aggiuntive non presenti in questa Policy riguardanti il trattamento dei dati personali. Il titolare potrà essere contattato tramite gli estremi di contatto.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Richieste “Do Not Track”</b><br />
                    Le richieste “Do Not Track” non sono supportate dal sito web.<br />
                    L’utente è invitato a consultare le Privacy Policy dei servizi terzi sopra elencati per scoprire quali supportano questo tipo di richieste.
                </div>

                <h2 className="black-header" style={{ fontSize: '20px', marginTop: '30px', marginBottom: '10px' }}>
                    <b>Definizioni</b>
                </h2>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Dati personali (o dati, o dati dell’utente)</b><br />
                    Sono dati personali le informazioni che identificano o rendono identificabile, direttamente o indirettamente, una persona e che possono fornire informazioni sulle sue caratteristiche, le sue abitudini, il suo stile di vita, le sue relazioni personali, il suo stato di salute, la sua situazione economica, ecc..
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Dati di utilizzo</b><br />
                    Sono dati di utilizzo le informazioni che vengono raccolte in automatico durante la navigazione del sito web, sia da sito web stesso che dalle applicazioni di terzi incluse nel sito. Sono esempi di dati di utilizzo l’indirizzo IP e i dettagli del dispositivo e del browser (compresi la localizzazione geografica) che l’utente utilizza per navigare sul sito, gli indirizzi in notazione URI, i codici di risposta del server, le pagine visualizzate e la durata della permanenza dell’utente sulle singole pagine.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Utente</b><br />
                    Il soggetto che fa uso del sito web.<br />
                    Coincide con l’interessato, salvo dove diversamente specificato.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Interessato</b><br />
                    Interessato è la persona fisica al quale si riferiscono i dati personali. Quindi, se un trattamento riguarda, ad esempio, l’indirizzo o altri dati di Mario Rossi, questa persona è l’interessato (articolo 4, paragrafo 1, punto 1), del <span className="highlight-red">Regolamento UE 2016/679.</span>
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Responsabile del trattamento (o responsabile)</b><br />
                    Responsabile è la persona fisica o giuridica o pubblica amministrazione al quale il titolare affida, anche all’esterno della sua struttura organizzativa, specifici e definiti compiti di gestione e controllo per suo conto del trattamento dei dati (articolo 4, paragrafo 1, punto 8), del<span className="highlight-red"> Regolamento UE 2016/679.</span> Il Regolamento medesimo ha introdotto la possibilità che un responsabile possa, a sua volta e secondo determinate condizioni, designare un altro soggetto c.d. “sub-responsabile” (articolo 28, paragrafo 2).
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Titolare del trattamento (o titolare)</b><br />
                    Titolare è la persona fisica, l’autorità pubblica, l’impresa, l’ente pubblico o privato, l’associazione, o persona giuridica ecc., che adotta le decisioni sugli scopi, le finalità, le modalità e i mezzi del trattamento (articolo 4, paragrafo 1, punto 7), del<span className="highlight-red">Regolamento UE 2016/679.</span>
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Sito web</b><br />
                    Il sito web mediante il quale sono raccolti e trattati i dati personali degli utenti. In questo caso titocci.ch
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Servizio</b><br />
                    Il servizio offerto dal sito web come indicato nei relativi termini.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Comunità Europea (o UE)</b><br />
                    Ogni riferimento relativo alla comunità Europea si estende a tutti gli attuali stati membri dell’Unione Europea e dello Spazio Economico Europeo, salvo dove diversamente specificato.
                </div>

                <div className="section-text" style={{ margin: '15px 0' }}>
                    <b>Cookie</b><br />
                    I Cookies sono Strumenti di Tracciamento che consistono in piccole porzioni di dati conservate all’interno del browser dell’Utente.
                </div>

                <div className="section-text" style={{ margin: '20px 0' }}>
                    Visualizza la <a className="highlight-red" href="https://titocci.ch/politica-dei-cookie-ue/">Cookie policy</a>
                </div>

                <p style={{ margin: '20px 0', color: '#666' }}>Data ultima modifica: 04/06/2021</p>

            </div>

        </div>
    );
}

export default Privacy;