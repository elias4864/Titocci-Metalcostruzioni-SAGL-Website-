import React from 'react';
import NavIcon from '../assets/Navicon.png';
import Schleifbild from '../assets/Schleifbild.jpg';
import '../Styles/TimeLineSection.css';

import "../Styles/ChiSiamo.css";
export const TimelineSection = () => {
    return (
        <div className="timeline-container">
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
                    <div className="timeline-box">
                        <div className="box-arrow left-arrow"></div>
                        <h2 className="box-title">Fondazione</h2>
                        <img src={NavIcon} alt="Titocci Logo" className="box-logo" />
                        <p className="box-text">
                            La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                            ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                        </p>
                    </div>
                </div>

                {/* Zwischenschritt: Officina più grande (Links) */}
                <div className="timeline-item left">
                    <div className="timeline-box">
                        <div className="box-arrow right-arrow"></div>
                        <p className="box-text">
                            Passato qualche anno, visto il costante aumento della mole di lavoro e
                            l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                        </p>
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
                    <div className="timeline-box">
                        <div className="box-arrow left-arrow"></div>
                        <p className="box-text">
                            Nel 1982 viene costruito il capannone presso la zona industriale di Avegno.
                            Qui la ditta trova la sua sede ideale ed è qui che tuttora continua la sua attività.
                        </p>
                    </div>
                </div>

                {/* --- 1995 --- */}
                <div className="timeline-year">
                    <span>1995</span>
                </div>

                {/* 1995: Figlio Marco (Links) */}
                <div className="timeline-item left">
                    <div className="timeline-box">
                        <div className="box-arrow right-arrow"></div>
                        <p className="box-text">
                            Nel 1995 entra in azienda il figlio Marco.
                        </p>
                    </div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content-right"></div>
                </div>

                {/* --- 2012 --- */}
                <div className="timeline-year">
                    <span>2012</span>
                </div>

                {/* 2012: Esperienza (Rechts) */}
                <div className="timeline-item right">
                    <div className="timeline-content-left"></div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-box">
                        <div className="box-arrow left-arrow"></div>
                        <p className="box-text">
                            Dopo quattro anni di apprendistato e ulteriori 13 anni di esperienza come dipendente...
                        </p>a
                    </div>
                </div>

                {/* --- 2017 --- */}
                <div className="timeline-year">
                    <span>2017</span>
                </div>

                <div className="timeline-item left">
                    <div className="timeline-box">
                        <div className="box-arrow right-arrow"></div>
                        <p className="box-text">
                            La ditta individuale viene trasformata in SAGL.
                        </p>
                    </div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content-right"></div>
                </div>
            </div>

            {/* Unteres Bild */}
            <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <img
                    src={Schleifbild}
                    alt="Lavorazione"
                    style={{ width: '100%', maxWidth: '700px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
            </div>
            <div style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                Il <b>maestro</b> <span className="highlight-red">fabbro</span> è un esperto nella lavorazione di vari metalli come ferro battuto, acciaio inox e alluminio, è il cuore pulsante di creazioni uniche e funzionali. La ditta <b>Titocci Metalcostruzioni</b> incarna questa tradizione, offrendo una gamma completa di servizi su misura per la lavorazione e creazione di opere in metallo di ringhiere di ogni tipo, scale, serramenti, cancelli manuali o automatizzati, porte garage, cassette postali, recinzioni, ecc. Eseguiamo anche riparazioni, lavorazione di lamiere, taglio, piegatura, saldalura di acciaio inox e alluminio, verniciatura semplice, ecc. Visita la pagina CONTATTI per ottenere ulteriori informazioni e per richiedere un preventivo senza impegno.
            </div>

            <section>
                <h1>Il giusto equilibrio fra tradizione ed evoluzione
                </h1>

                <p><b>La storia del fabbro</b> si intreccia con le leggende e i miti dell’antichità. L’immagine di Efesto, il fabbro divino della mitologia greca, incarna il connubio tra l’arte del fuoco e la lavorazione dei metalli. Le prime menti creative adottarono il fuoco come loro compagno, imparando a fondere e modellare i metalli per creare utensili e oggetti che avrebbero rivoluzionato il modo in cui l’umanità viveva e lavorava. Da allora, la figura del fabbro si è evoluta, integrando tecniche avanzate e materiali innovativi, diventando un pilastro dell’industria metallurgica moderna.
                </p>



                <div>
                    <h1 style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        Funzionalità e personalizzazione
                    </h1>
                    <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                        Un <b>fabbro moderno è un artista</b>, un artigiano e un tecnico. Grazie alla vasta esperienza e a un’ampia gamma di strumenti specializzati, come fucine, incudini e martelli, trasforma materie prime in elementi funzionali. L’abilità di forgiare, saldare e rifinire il metallo è solo il punto di partenza. La vera magia risiede nella creazione di pezzi unici che coniugano estetica e utilità. Ogni cancellata, ogni ringhiera, ogni scala, o qualsiasi altro prodotto realizzato da Titocci Metalcostruzioni, è un elemento personalizzato in base alle tue richieste ed esigenze, un elemento unico che porta la firma distintiva del maestro fabbro.
                    </p>
                </div>
                <p>L'Arte del Ferro Battuto</p>

            </section>
        </div>
    );
};

export default TimelineSection;