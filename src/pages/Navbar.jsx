import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Navicon.png';
import Redfacebook from '../assets/Redfacebook.jfif';
import Googlemapsimg from '../assets/RedGoogleMaps.jfif';

import '../Styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar-overlay">
            <div className="navbar-container" style={{
                position: 'relative',
                zIndex: 20, // Stellt sicher, dass Klicks nicht von Overlays blockiert werden
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '20px 50px',
                boxSizing: 'border-box',
            }}>
                {/* Logo links */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img
                            src={Logo}
                            className="logo"
                            alt="Logo"
                        />
                    </Link>
                </div>

                {/* Menüpunkte rechts */}
                <ul className="nav-menu" style={{
                    display: 'flex',
                    listStyle: 'none',
                    gap: '35px',
                    margin: 0,
                    textDecorationColor: 'blue',
                    padding: 0,
                    alignItems: 'center',
                    textDecoration: 'underline',

                }}>
                    <li className="nav-item"><Link to="/" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link></li>
                    <li className="nav-item"><Link to="/chi-siamo" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                    <li className="nav-item"><Link to="/servizi" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                    <li className="nav-item"><Link to="/galeria" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                    <li className="nav-item"><Link to="/kontakte" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' ,  transition: 'backgroundColor 0.3s ease'
                    }}>Contatti</Link></li>

                    {/* Social Icons */}
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <img className="red-facebook" src={Redfacebook} alt="Facebook" style={{ width: '24px', height: '24px' }} />
                        </a>
                    </li>
                    <li>
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                            <img className="red-google" src={Googlemapsimg} alt="Google Maps" style={{ width: '24px', height: '24px' }} />
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;