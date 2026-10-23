import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

// Asset Imports
import Schleifbild from '../assets/Schleifen.jpg';
import Bauplan from '../assets/Bauplan.jfif';
import PC from '../assets/PC.jpg';
import Icon from "../assets/Icon.jpg";

import '../Styles/TimeLineSection.css';

const IMAGES = [
    { id: 1, url: Schleifbild, title: 'Schleifarbeiten' },
    { id: 2, url: Bauplan, title: 'Werkstatt' },
    { id: 3, url: PC, title: 'PC' },
];

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
    textAlign: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none'
};

function Servizi() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    };

    if (!isOpen) return null;

    return (
        <div className="rot">
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

                    {/* Navbar über die volle Breite */}
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
                            <img src={Icon} alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>

                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '35px',
                            margin: 0,
                            padding: 0
                        }}>
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px', fontSize: '14px' }}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Servizi</Link></li>
                            <li><Link to="/galleria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Galleria</Link></li>
                            <li><Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Contatti</Link></li>
                        </ul>
                    </nav>

                    {/* Navigation Button Links */}
                    <button onClick={prevImage} style={{ ...navButtonStyle, left: '25px' }}>◀</button>

                    {/* Bild */}
                    <img
                        src={IMAGES[currentIndex].url}
                        alt={IMAGES[currentIndex].title}
                        style={{
                            width: '100vw',
                            height: '550px',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'brightness(0.65)'
                        }}
                    />

                    {/* Hero Text & Button Overlay */}
                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            margin: '0 0 15px 0',
                            zIndex: 10,
                            textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
                        }}>
                            Servizi<br />
                            Fabbro artigiano
                        </h1>

                        <Link to="/contatti" style={{
                            display: 'inline-block',
                            backgroundColor: '#e62b2b',
                            color: 'white',
                            padding: '12px 28px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            pointerEvents: 'auto',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
                            margin: '0 auto'
                        }}>
                            Contattaci
                        </Link>
                    </div>

                    {/* Bildunterschrift */}
                    <p style={imageCaptionStyle}>
                        {IMAGES[currentIndex].title}
                    </p>

                    {/* Navigation Button Rechts */}
                    <button onClick={nextImage} style={{ ...navButtonStyle, right: '25px' }}>▶</button>
                </div>
            </div>
        </div>
    );
}

export default Servizi;