import { Link } from "react-router-dom";
import Schleifbild from "../assets/Schleifen3.jpg";
import React from "react";

const heroOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none'
};

function Avegno({ lang = "de" }) {
    const translations = {
        de: {
            home: "Home",
            chiSiamo: "Über uns",
            servizi: "Leistungen",
            galeria: "Galerie",
            kontakte: "Kontakt",
            aboutUs: "Über uns",
            calculatori: "Online Preisrechner",
            title: "Avegno "
        },
        en: {
            home: "Home",
            chiSiamo: "About Us",
            servizi: "Services",
            galeria: "Gallery",
            kontakte: "Contact",
            aboutUs: "About Us",
            calculatori: "Online Calculator",
            title: "Avegno & Gallery"
        },
        it: {
            home: "Home",
            chiSiamo: "Chi siamo",
            servizi: "Servizi",
            galeria: "Galleria",
            kontakte: "Contatti",
            aboutUs: "Chi siamo",
            calculatori: "Calcolatore online",
            title: "Avegno e Galleria"
        },
        fr: {
            home: "Accueil",
            chiSiamo: "À propos",
            servizi: "Services",
            galeria: "Galerie",
            kontakte: "Contact",
            aboutUs: "À propos",
            calculatori: "Calculateur en ligne",
            title: "Avegno & Galerie"
        }
    };

    const t = translations[lang] || translations.de;

    return (
        <div className="rot">
            {/* Hero Banner Section */}
            <div style={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                overflow: 'hidden',
                marginTop: '0px'
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
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.home}</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.chiSiamo}</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.servizi}</Link></li>
                            <li><Link to="/galeria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px', fontSize: '14px' }}>{t.galeria}</Link></li>
                            <li><Link to="/kontakte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.kontakte}</Link></li>
                            <li><Link to="/aboutus" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.aboutUs}</Link></li>
                            <li><Link to="/calculatori" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.calculatori}</Link></li>
                        </ul>
                    </nav>

                    <img
                        src={Schleifbild}
                        alt="Schleifbild"
                        style={{
                            width: '100vw',
                            height: '450px',
                            objectFit: 'cover',
                            display: 'block',
                            imageRendering: '-webkit-optimize-contrast',
                            filter: 'contrast(108%) saturate(102%)',
                        }}
                    />

                    {/* Dunkler Layer */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 2
                    }} />

                    {/* Text Overlay */}
                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '4.5rem',
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
                        }}>
                            {t.title}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Avegno;