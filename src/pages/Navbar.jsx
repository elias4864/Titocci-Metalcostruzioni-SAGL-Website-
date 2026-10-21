
import React, { useState } from 'react';
import '../pages/Navbar.jsx';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
        { name: 'Home', path: 'https://titocci.ch/' },
        { name: 'Chi siamo', path: 'https://titocci.ch/titocci-fabbro-chi-siamo/' },
        { name: 'Servizi', path: 'https://titocci.ch/il-fabbro-artigiano-servizi/' },
        { name: 'Galleria', path: 'https://titocci.ch/galleria/' },
        { name: 'Contatti', path: 'https://titocci.ch/contatti/' },


    ];
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="logo">MySite</h1>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a href={link.path} onClick={() => setIsOpen(false)}>
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <div className={isOpen ? 'bar rotate-bar1' : 'bar'}></div>
                    <div className={isOpen ? 'bar hide-bar2' : 'bar'}></div>
                    <div className={isOpen ? 'bar rotate-bar3' : 'bar'}></div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;