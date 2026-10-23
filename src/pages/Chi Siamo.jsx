import React from 'react';
import { Link } from "react-router-dom";
import NavIcon from '../assets/Navicon.png';
import Schleifbild from '../assets/Schleifen.jpg';
import '../Styles/TimeLineSection.css';
import '../Styles/ChiSiamo.css';

export const TimelineSection = () => {
    return (
        <div className="chi-siamo-container">
            {/* Hero Section */}
            <div className="image-container" style={{ position: 'relative', width: '100%' }}>
                <img className="schleifen-img" src={Schleifbild} alt="Schleifbild" />
                <img src={NavIcon} className="label" alt="NavIcon" />

                <div className="text-overlay">Il Fabbro: creazioni personalizzate</div>

                <nav style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 25px',
                    boxSizing: 'border-box',
                    zIndex: 20
                }}>
                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '25px',
                        margin: 0,
                        marginLeft: 'auto',
                        padding: 0,
                    }}>
                        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Home</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Chi siamo</Link></li>
                        <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Servizi</Link></li>
                        <li><Link to="/galleria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Galleria</Link></li>
                        <li><Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Contatti</Link></li>
                    </ul>
                </nav>
            </div>

            {/* Timeline Section */}
            <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '0 20px' }}>
                <h1 className="header-text">Presentazione</h1>

                <div className="custom-timeline">
                    {/* Badge 1973 */}
                    <div className="timeline-year-badge">1973</div>

                    {/* Item 1 */}
                    <div className="timeline-item left">
                        <div className="timeline-badge-title">Titocci Metalcostruzioni SAGL</div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-card">
                            <h2 className="card-title">Fondazione</h2>
                            <img src={NavIcon} alt="Titocci Logo" className="card-logo" />
                            <p className="card-text">
                                La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                                ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                            </p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="timeline-item right">
                        <div className="timeline-dot"></div>
                        <div className="timeline-card">
                            <p className="card-text">
                                Passato qualche anno, visto il costante aumento della mole di lavoro e
                                l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                            </p>
                        </div>
                    </div>

                    {/* Badges 1982 & 1985 */}
                    <div className="timeline-year-badge">1982</div>
                    <div className="timeline-year-badge">1985</div>
                </div>
            </div>

            <section style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
                <div>
                    <span>
                        Il <b>maestro</b> <span className="highlight-red" style={{ color: 'red' }}>fabbro</span> è un esperto nella lavorazione di vari metalli come ferro battuto, acciaio inox e alluminio, è il cuore pulsante di creazioni uniche e funzionali. La ditta <b>Titocci Metalcostruzioni</b> incarna questa tradizione, offrendo una gamma completa di servizi su misura per la lavorazione e creazione di opere in metallo di ringhiere di ogni tipo, scale, serramenti, cancelli manuali o automatizzati, porte garage, cassette postali, recinzioni, ecc. Eseguiamo anche riparazioni, lavorazione di lamiere, taglio, piegatura, saldatura di acciaio inox e alluminio, verniciatura semplice, ecc. Visita la pagina CONTATTI per ottenere ulteriori informazioni e per richiedere un preventivo senza impegno.
                    </span>
                </div>
            </section>

            <img className="schleifen-img" src={Schleifbild} alt="Schleifbild" />

            <section>
                <h2>
                    Presentazione
                </h2>
            </section>
        </div>
    );
};

export default TimelineSection;