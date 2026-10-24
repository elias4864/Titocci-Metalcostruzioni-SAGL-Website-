import React from 'react';
import NavIcon from '../assets/Navicon.png';
import Schleifbild from '../assets/Schleifpapier.jpg';
import Schleifen from '../assets/Schleifbild.jpg';
import "../Styles/ChiSiamo.css";
import "../Styles/TimeLineSection.css";

const heroOverlayStyle = {
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    color: 'white'
};

const textOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    zIndex: 5
};

export const TimelineSection = () => {
    return (
        <div>
            {/* Hero Section */}
            <div style={heroOverlayStyle}>
                <img
                    src={Schleifbild}
                    alt="Schleifbild"
                    style={{ width: '100%', height: '450px', objectFit: 'cover', display: 'block' }}
                />
                <div style={textOverlayStyle}>
                    <h1 style={{
                        color: '#e62b2b',
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        margin: 0,
                        textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                        borderRadius: '5px',
                        padding: '10px',
                        gap: '20px',
                    }}>
                        Il Fabbro: <br />
                        creazioni personalizzate
                    </h1>
                </div>
            </div>

            {/* Timeline & Inhaltsbereich */}
            <div className="timeline-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
                <h1 className="yellow-title">Presentazione</h1>
                <div className="yellow-divider"></div>

                <div className="timeline-wrapper">
                    {/* Vertikale Linie in der Mitte */}
                    <div className="timeline-line"></div>

                    {/* --- 1973 --- */}
                    <div className="timeline-year">
                        <span>1973</span>
                    </div>

                    {/* 1973: Fondazione (Rechts) */}
                    <div className="timeline-item right">
                        <div className="timeline-content-left">
                            <span className="left-label">Titocci Metalcostruzioni SAGL</span>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right">
                            <div className="timeline-box">
                                <h2 className="box-title">Fondazione</h2>
                                <img src={NavIcon} alt="Titocci Logo" className="box-logo" />
                                <p className="box-text">
                                    La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                                    ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Zwischenschritt: Officina più grande (Links) */}
                    <div className="timeline-item left">
                        <div className="timeline-content-left">
                            <div className="timeline-box">
                                <p className="box-text">
                                    Passato qualche anno, visto il costante aumento della mole di lavoro e
                                    l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                                </p>
                            </div>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right"></div>
                    </div>

                    {/* --- 1982 --- */}
                    <div className="timeline-year">
                        <span>1982</span>
                    </div>

                    {/* 1982: Capannone Avegno (Rechts) */}
                    <div className="timeline-item right">
                        <div className="timeline-content-left"></div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right">
                            <div className="timeline-box">
                                <p className="box-text">
                                    Nel 1982 viene costruito il capannone presso la zona industriale di Avegno.
                                    Qui la ditta trova la sua sede ideale ed è qui che tuttora continua la sua attività.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- 1995 --- */}
                    <div className="timeline-year">
                        <span>1995</span>
                    </div>

                    {/* 1995: Figlio Marco (Links) */}
                    <div className="timeline-item left">
                        <div className="timeline-content-left">
                            <div className="timeline-box">
                                <p className="box-text">
                                    Nel 1995 entra in azienda il figlio Marco.
                                </p>
                            </div>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right"></div>
                    </div>

                    {/* --- 2012 --- */}
                    <div className="timeline-year">
                        <span>2012</span>
                    </div>

                    {/* 2012: Marco Subentra (Rechts) */}
                    <div className="timeline-item right">
                        <div className="timeline-content-left"></div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right">
                            <div className="timeline-box">
                                <p className="box-text">
                                    Dopo quattro anni di apprendistato e ulteriori 13 anni di esperienza come
                                    operaio, nel 2012 Marco Titocci subentra come titolare.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- 2017 --- */}
                    <div className="timeline-year">
                        <span>2017</span>
                    </div>

                    {/* 2017: SAGL (Links) */}
                    <div className="timeline-item left">
                        <div className="timeline-content-left">
                            <div className="timeline-box">
                                <p className="box-text">
                                    A partire da gennaio 2017 la nostra azienda viene tramutata in Sagl e con
                                    questa nuova formula potremo stare sempre a passo con i tempi, continuando
                                    a offrire i nostri servizi con passione e professionalità e costante evoluzione.
                                </p>
                            </div>
                        </div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content-right"></div>
                    </div>
                    <div className="yellow-divider"></div>

                </div>

                {/* Beschreibungstext unter der Timeline */}
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333', marginTop: '40px' }}>
                    Il <b>maestro</b> <span style={{ color: '#e62b2b' }}>fabbro</span> è un esperto nella lavorazione di vari metalli come ferro battuto, acciaio inox e alluminio, è il cuore pulsante di creazioni uniche e funzionali. La ditta <b>Titocci Metalcostruzioni</b> incarna questa tradizione, offrendo una gamma completa di servizi su misura per la lavorazione e creazione di opere in metallo di ringhiere di ogni tipo, scale, serramenti, cancelli manuali o automatizzati, porte garage, cassette postali, recinzioni, ecc. Eseguiamo anche riparazioni, lavorazione di lamiere, taglio, piegatura, saldatura di acciaio inox e alluminio, verniciatura semplice, ecc. Visita la pagina CONTATTI per ottenere ulteriori informazioni e per richiedere un preventivo senza impegno.
                </div>

                {/* Unteres Bild */}
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <img
                        src={Schleifen}
                        alt="Lavorazione"
                        style={{ width: '100%', maxWidth: '700px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                </div>

                {/* Zusätzliche Textabschnitte */}
                <section style={{ marginTop: '40px' }}>
                    <h1 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                        Il giusto equilibrio fra tradizione ed evoluzione
                    </h1>

                    <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                        <b>La storia del fabbro</b> si intreccia con le leggende e i miti dell’antichità. L’immagine di Efesto, il fabbro divino della mitologia greca, incarna il connubio tra l’arte del fuoco e la lavorazione dei metalli. Le prime menti creative adottarono il fuoco come loro compagno, imparando a fondere e modellare i metalli per creare utensili e oggetti che avrebbero rivoluzionato il modo in cui l’umanità viveva e lavorava. Da allora, la figura del fabbro si è evoluta, integrando tecniche avanzate e materiali innovativi, diventando un pilastro dell’industria metallurgica moderna.
                    </p>

                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                            Funzionalità e personalizzazione
                        </h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                            Un <b>fabbro moderno è un artista</b>,  un <p style={{color:'red'}}>artigiano </p> e un tecnico. Grazie alla vasta esperienza e a un’ampia gamma di strumenti specializzati, come fucine, incudini e martelli, trasforma materie prime in elementi funzionali. L’abilità di forgiare, saldare e rifinire il metallo è solo il punto di partenza. La vera magia risiede nella creazione di pezzi unici che coniugano estetica e utilità. Ogni cancellata, ogni ringhiera, ogni scala, o qualsiasi altro prodotto realizzato da Titocci Metalcostruzioni, è un elemento personalizzato in base alle tue richieste ed esigenze, un elemento unico che porta la firma distintiva del maestro fabbro.
                        </p>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                            Conoscenza dei materiali
                        </h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                            La <b>conoscenza dei metalli è fondamentale per il fabbro</b>. La scelta del tipo di metallo dipende dalla funzione dell’oggetto e dalla sua estetica. L’acciaio al carbonio, con la sua robustezza, trova impiego in molteplici contesti. L’acciaio inossidabile, grazie alla sua resistenza alla corrosione, trova spazio in ambienti soggetti all’umidità. L’alluminio, leggero ma resistente, è una scelta popolare per strutture esterne. La maestria del fabbro risiede nella selezione e nell’utilizzo sapiente di questi materiali per creare opere durature e affascinanti.
                        </p>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                            L'Arte del Ferro Battuto
                        </h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                            Una delle abilità più ammirate di un fabbro è l’arte del ferro battuto. Con passione e perizia, trasformiamo semplici barre di ferro in vere e proprie opere d’arte. Questa tecnica millenaria richiede pazienza e abilità, poiché il metallo viene riscaldato fino a diventare incandescente e quindi plasmato su un’incudine. Le forme, le curve e i dettagli prendono vita sotto il martello esperto del fabbro, dando vita a cancelli elaborati, ringhiere eleganti e decorazioni uniche.
                        </p>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>
                            Fabbro: custode della tradizione e promotore dell’innovazione
                        </h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                            Titocci Metalcostruzioni incarna la fusione tra la tradizione artigianale e l’innovazione moderna. Con un patrimonio di cinque decenni di esperienza, la ditta continua a preservare l’arte del fabbro, rinnovandola con tecniche all’avanguardia e materiali moderni. Dall’ideazione alla realizzazione, offriamo servizi di progettazione, costruzione e montaggio di una vasta gamma di strutture metalliche, dal classico al contemporaneo.
                            <br /><br />
                            Il fabbro artigiano rimane un custode della tradizione ma, cosciente dei vantaggi delle nuove tecnologie, è anche un promotore dell’innovazione. Con abilità senza pari, trasformiamo il metallo in elementi funzionali e belli, creando un connubio tra creatività e competenza tecnica. Lavoriamo con passione e dedizione, offrendoti soluzioni su misura che soddisfano le tue richieste e valorizzano la tua proprietà.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TimelineSection;