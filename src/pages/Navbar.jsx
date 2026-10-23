import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Navicon.png';
import '../Styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar-overlay">
            <div className="navbar-container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '20px 50px',
                boxSizing: 'border-box'
            }}>
                {/* Logo links */}
                <div className="navbar-logo">
                    <img src={Logo} className="logo" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />
                </div>

                {/* Menüpunkte rechts */}
                <ul className="nav-menu" style={{
                    display: 'flex',
                    listStyle: 'none',
                    gap: '35px',
                    margin: 0,
                    padding: 0
                }}>
                    <li><Link to="/" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px' }}>Home</Link></li>
                    <li><Link to="/chi-siamo" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px' }}>Chi siamo</Link></li>
                    <li><Link to="/servizi" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold',borderBottom: '3px solid #e62b2b', paddingBottom: '4px' }}>Servizi</Link></li>
                    <li><Link to="/galleria" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' ,borderBottom: '3px solid #e62b2b', paddingBottom: '4px'}}>Galleria</Link></li>
                    <li><Link to="/contatti" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold',borderBottom: '3px solid #e62b2b', paddingBottom: '4px' }}>Contatti</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;