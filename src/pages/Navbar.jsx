
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="logo">MySite</h1>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-links">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/servizi" className="nav-links">Servizi</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/lavori" className="nav-links">Lavori</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contatti" className="nav-links">Contatti</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;