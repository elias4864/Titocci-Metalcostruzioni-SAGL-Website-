import React from 'react';
import { Link } from 'react-router-dom';

function Sitemap() {
    return (
        <div style={{ maxWidth: '800px', margin: '120px auto 60px', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#e62b2b', marginBottom: '20px' }}>Sitemap</h1>
            <ul style={{ lineHeight: '2', fontSize: '1.1rem' }}>
                <li><Link to="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link></li>
                <li><Link to="/chi-siamo" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                <li><Link to="/servizi" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                <li><Link to="/galeria" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                <li><Link to="/kontakte" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Contatti</Link></li>
                <li><Link to="/impressum" style={{ color: '#000', textDecoration: 'none' }}>Impressum</Link></li>
                <li><Link to="/privacy" style={{ color: '#000', textDecoration: 'none' }}>Privacy</Link></li>
            </ul>
        </div>
    );
}

export default Sitemap;