import React, {useState} from 'react';
import { Link} from 'react-router-dom';

import Logo from '../assets/Navicon.png';
import Redfacebook from '../assets/Redfacebook.jfif';
import Googlemapsimg from '../assets/RedGoogleMaps.jfif';
import Zeit from '../assets/Zeit.png';
import Standort from '../assets/Standort.jfif';
import Email from '../assets/Email.png';

import '../Styles/Navbar.css';

function Navbar() {

    const[isOpen, setIsOpen] = useState(false);

    const toggleMenu =()=>{
        setIsOpen(!isOpen);
    };

    const  closeMenu=()=>{
        setIsOpen(false);
    }
    return (
        <header style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'relative',
            zIndex: 20
        }}>
            <div style={{
                maxWidth: '1450px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px',
                flexWrap: 'nowrap',
                gap: '15px'
            }}>
                {/* 1. Logo links */}
                <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <Link to="/">
                        <img
                            src={Logo}
                            className="logo"
                            alt="Logo"
                            style={{ height: '80px', width: '85px', objectFit: 'contain' }}
                        />
                    </Link>
                </div>

                {/* 2. Kompakte Info-Daten in der Mitte */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '0.75rem',
                    color: '#333',
                    flex: '1 1 auto',       /* Erlaubt dynamische Anpassung */
                    minWidth: 0,            /* Verhindert Flexbox-Überlauf */
                    justifyContent: 'center'
                }}>
                    {/* Adresse */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                        <img src={Standort} alt="Standort" style={{ width: '14px', height: '14px', fontSize:'20px', objectFit: 'contain' }} />
                        <span><b>In di Salécc 2, 6670 Avegno</b></span>
                    </div>

                    {/* Öffnungszeiten (kompakter formatiert) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 1, overflow: 'hidden' }}>
                        <img src={Zeit} alt="Orari" style={{ width: '14px', height: '14px', objectFit: 'contain', flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', fontSize: '1.2rem',textWrap:'nowrap' }}>
        <b>Lunedì - Venerdì: 7:30 - 12:00 / 13:15 - 17:00;​
Sabato / Domenica: Chiuso</b>
    </span>
                    </div>

                    {/* Kontakt */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                        <img src={Email} alt="Kontakt" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <a href="mailto:info@titocci.ch" style={{ color: '#e62b2b', textDecoration: 'none' }}>
        info@titocci.ch
    </a>
    <span style={{ color: '#ccc' }}>|</span>
    <a href="tel:+41917962369" style={{ color: '#333', textDecoration: 'none', fontWeight: 'bold' }}>
        +41 91 796 23 69
    </a>
</span>
                    </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#e62b2b' }}>
                    Titocci Metalcostruzioni
                </div>

                {/* Hamburger Button für mobile/kleine Ansichten */}
                <button
                    onClick={toggleMenu}
                    aria-label="Toggle NavBar"
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'red',
                        padding: '5px'

                    }}
                >
                    {isOpen ? '✕' : '☰'}
                </button>
                {/* 3. Menüpunkte rechts */}
                <div  className={`nav-dropdown ${isOpen ? 'open' : ''}`} style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    opacity: isOpen ? 1 : 0,
                    width: '100%',
                    backgroundColor:'green'
                }}>
                    <ul className="nav-menu" style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '12px',         /* Abstand zwischen Links leicht reduziert */
                        margin: 0,
                        padding: 0,
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        textDecoration:'underline',
                        color:'blue',


                    }}>
                        <li><Link to="/" onClick={closeMenu} style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }} onClick>Home</Link></li>
                        <li><Link to="/chi-siamo" onClick={closeMenu} style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                        <li><Link to="/servizi" onClick={closeMenu} style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                        <li><Link to="/galeria"  onClick={closeMenu} style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                        <li><Link to="/kontakte" onClick={closeMenu}style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Contatti</Link></li>
                    </ul>
                </div>


                    {/* Social Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #ddd', paddingLeft: '12px' }}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <img src={Redfacebook} alt="Facebook" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        </a>
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                            <img src={Googlemapsimg} alt="Google Maps" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        </a>
                    </div>
                </div>

        </header>
    );
}

export default Navbar;