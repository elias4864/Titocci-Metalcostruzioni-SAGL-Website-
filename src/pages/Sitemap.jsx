import React from 'react';
import { Link } from 'react-router-dom';
import   '../Styles/Sitemap.css';

function Sitemap() {
    return (
        <div style={{ maxWidth: '900px', margin: '120px auto 60px', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header mit modernem SVG-Symbol */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>

                <div>
                    <h1 style={{ color: '#e62b2b', margin: 0, fontSize: '2.5rem',textShadow:' 2px 2px gold' }}>Sitemap</h1>
                    <hr className="divider"></hr>
                    <br></br>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.95rem' }}>
                        Panoramica completa di tutte le pagine del sito web di Titocci Metalcostruzioni SAGL.
                    </p>
                </div>
            </div>


            {/* Strukturierte Liste für Nutzer und SEO-Crawler */}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', color:'brown', flexDirection: 'column', gap: '15px' }}>
                <div style={{padding: '12px 15px', color:'brown',backgroundColor: '#f9f9f9', borderRadius: '6px', }}>
                <li style={{ padding: '12px 15px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderLeft: '4px solid #e62b2b' }}>
                    <Link to="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>
                        🏠 Home
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginTop: '3px' }}>
                        Pagina principale con panoramica dei nostri servizi di carpenteria metallica e lavorazione del ferro.
                    </span>
                </li>

                <li style={{ padding: '12px 15px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderLeft: '4px solid #e62b2b' }}>
                    <Link to="/chi-siamo" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>
                        📖 Chi siamo
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginTop: '3px' }}>
                        La storia della nostra azienda dal 1973 a Ponte Brolla e Avegno, tramandata da generazione in generazione.
                    </span>
                </li>

                <li style={{ padding: '12px 15px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderLeft: '4px solid #e62b2b' }}>
                    <Link to="/servizi" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>
                        🛠️ Servizi
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginTop: '3px' }}>
                        I nostri lavori specializzati: cancelli, ringhiere, scale, acciaio inox e strutture in ferro battuto.
                    </span>
                </li>

                <li style={{ padding: '12px 15px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderLeft: '4px solid #e62b2b' }}>
                    <Link to="/galeria" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>
                        🖼️ Galleria
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginTop: '3px' }}>
                        Una selezione fotografica delle nostre creazioni artigianali realizzate su misura per i clienti.
                    </span>
                </li>

                <li style={{ padding: '12px 15px', backgroundColor: '#f9f9f9', borderRadius: '6px', borderLeft: '4px solid #e62b2b' }}>
                    <Link to="/kontakte" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>
                        📞 Contatti
                    </Link>
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginTop: '3px' }}>
                        Mettiti in contatto con noi tramite il modulo online, telefono o visita la nostra sede ad Avegno.
                    </span>
                </li>

                <li style={{ padding: '10px 15px' }}>
                    <Link to="/impressum" style={{ color: '#444', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>
                        📄 Impressum
                    </Link>
                </li>

                <li style={{ padding: '10px 15px' }}>
                    <Link to="/privacy" style={{ color: '#444', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>
                        🔒 Privacy Policy
                    </Link>
                </li>
                </div>
            </ul>
        </div>
    );
}

export default Sitemap;