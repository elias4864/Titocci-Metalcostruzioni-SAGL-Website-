import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import '../Styles/Chi Siamo.css';
import NavIcon from '../assets/Navicon.png';
import Schleifen from '../assets/Schleifbild.jpg';
import { Link } from "react-router-dom";
import Schleifbild from '../assets/Schleifen.jpg';

/**
 * Timeline Section Function
 * @returns {JSX.Element}
 * @constructor
 */
export const TimelineSection = () => {
    return (
        <div className="chi-siamo-container">
            {/* Hero Section mit Bild, Text-Overlay und integrierter Navbar */}
            <div className="image-container" style={{ position: 'relative', width: '100%' }}>
                <img className="schleifen-img" src={Schleifen} alt="Schleifbild" />
                <img src={NavIcon} className="label" alt="NavIcon" />

                <div className="text-overlay">Il Fabbro: creazioni personalizzate</div>

                {/* Navbar exakt über dem Bild */}
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
                    {/* Menüpunkte */}
                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '25px',
                        margin: 0,
                        float: 'right',
                        marginLeft: 'auto', // Schiebt die Liste ganz nach rechts
                        padding: 0,
                    }}>

                        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Home</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold',borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Chi siamo</Link></li>
                        <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' ,borderBottom: '2px solid #e62b2b', paddingBottom: '3px'}}>Servizi</Link></li>
                        <li><Link to="/galleria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' ,borderBottom: '2px solid #e62b2b', paddingBottom: '3px'}}>Galleria</Link></li>
                        <li><Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold',borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Contatti</Link></li>
                    </ul>
                </nav>
            </div>

            {/* Hauptinhalt & Timeline */}
            <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
                <h1 className="header-text">Presentazione</h1>

                <Timeline position="alternate">
                    {/* 1973 Badge */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot className="timeline-badge-year">1973</TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent />
                    </TimelineItem>

                    {/* Item 1: Fondazione */}
                    <TimelineItem>
                        <TimelineOppositeContent className="timeline-title-left">
                            Titocci Metalcostruzioni SAGL
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot className="timeline-dot-yellow" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className="timeline-card">
                                <h2 className="card-title">Fondazione</h2>
                                <img src={NavIcon} alt="Titocci Logo" className="card-logo" />
                                <p className="card-text">
                                    La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                                    ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                                </p>
                            </div>
                        </TimelineContent>
                    </TimelineItem>

                    {/* Item 2: Trasferimento */}
                    <TimelineItem>
                        <TimelineContent>
                            <div className="timeline-card">
                                <p className="card-text">
                                    Passato qualche anno, visto il costante aumento della mole di lavoro e
                                    l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                                </p>
                            </div>
                        </TimelineContent>
                        <TimelineSeparator>
                            <TimelineDot className="timeline-dot-yellow" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineOppositeContent />
                    </TimelineItem>

                    {/* 1982 Badge */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot className="timeline-badge-year">1982</TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent />
                    </TimelineItem>
                </Timeline>
            </div>

            <section>
                <div>
                    <span>Il <b>maestro</b> <p className="highlight-red">fabbro</p>  è un esperto nella lavorazione di vari metalli come ferro battuto, acciaio inox e alluminio, è il cuore pulsante di creazioni uniche e funzionali. La ditta <b>Titocci Metalcostruzioni</b>incarna questa tradizione, offrendo una gamma completa di servizi su misura per la lavorazione e creazione di opere in metallo di ringhiere di ogni tipo, scale, serramenti, cancelli manuali o automatizzati, porte garage, cassette postali, recinzioni, ecc. Eseguiamo anche riparazioni, lavorazione di lamiere, taglio, piegatura, saldatura di acciaio inox e alluminio, verniciatura semplice, ecc. Visita la pagina CONTATTI per ottenere ulteriori informazioni e per richiedere un preventivo senza impegno. </span>
                </div>
            </section>

            <img className="schleifen-img" src={Schleifbild}></img>
        </div>




    );
};

export default TimelineSection;