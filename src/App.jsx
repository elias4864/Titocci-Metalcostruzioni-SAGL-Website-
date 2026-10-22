import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import Dropdown from "./assets/Dropdown.png";
import ChiSiamo from "./pages/Chi Siamo.jsx";
import './Styles/App.css';

function App() {
    // Cookie State für das Ein-/Ausblenden
    const [showBanner, setShowBanner] = useState(false);

    // Function zum Nach-oben-Scrollen
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        const cookieChoice = localStorage.getItem('cookieConsent');
        if (!cookieChoice) {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const handleDeclineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowBanner(false);
    };

    const handlePreferredCookies = () => {
        localStorage.setItem('cookieConsent', 'preferred');
        setShowBanner(false);
    };

    return (
        <>
            {/* Navbar wird geladen */}
            <Navbar />

            <main className="hero-image-wrapper">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/chi-siamo" element={<ChiSiamo />  } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </main>

            {/* Cookie Banner */}
            {showBanner && (
                <div className="cookie-banner" id="cookieBanner">
                    <div className="cookie-banner-content">
                        <p>Questo sito utilizza cookie di profilazione, propri o di altri siti. Se procedi nella navigazione acconsenti all'utilizzo dei cookie.</p>
                        <div className="cookie-banner-buttons">
                            <button onClick={handleAcceptCookies} id="cookieAccept">Accetta</button>
                            <button onClick={handleDeclineCookies} id="cookieDecline">Nega</button>
                            <button onClick={handlePreferredCookies} id="cookiePreference">Preferenze</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Bottom Bar */}
            <div className="footer-bottom">
                <p>
                    © 2026 <a href="/home" className="footer-red-link">Titocci Metalcostruzioni SAGL</a>{' '}
                    <span>|</span>{' '}
                    <a href="/impressum" className="footer-red-link">Impressum</a>{' '}
                    <span>|</span>{' '}
                    <a href="/privacy" className="footer-red-link">Privacy</a>
                </p>

                <p>
                    Web Design by{' '}
                    <a href="https://marketingmaster.ch" target="_blank" rel="noreferrer" className="footer-red-link">
                        marketingmaster.ch
                    </a>{' '}
                    with love
                </p>
            </div>

            {/* Scroll To Top Button ausserhalb des Footers platziert */}
            <button
                className="scroll-to-top"
                title="Nach oben scrollen"
                onClick={scrollToTop}
            >
                <img className="dropdown-img" src={Dropdown} alt="Nach oben" />
            </button>
        </>
    );
}

export default App;