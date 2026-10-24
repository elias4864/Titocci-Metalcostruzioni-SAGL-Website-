import React, {useState, useEffect,useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import Dropdown from "./assets/Dropdown.png";
import ChiSiamo from "./pages/Chi Siamo.jsx";
import Galeria from "./pages/Galeria.jsx";
import Servizi from "./pages/Servici.jsx";
import Kontakte from "./pages/Kontakt.jsx";
import './Styles/App.css';
import Facebook from "./assets/Facebook.png";
import Google from "./assets/Google.png";
import Verifizierungbild from "./assets/Verifizierung.gif";

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
                        <Route path="/servizi" element={<Servizi />}/>
                        <Route path="/chi-siamo" element={<ChiSiamo />  } />
                        <Route path="/galeria" element={<Galeria />} />
                        <Route path="/kontakte" element={<Kontakte />} />
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




            {/* Scroll To Top Button ausserhalb des Footers platziert */}
            <button
                className="scroll-to-top"
                title="Nach oben scrollen"
                onClick={scrollToTop}
            >
                <img className="dropdown-img" src={Dropdown} alt="Nach oben" />
            </button>


            <footer className="footer-div">
                {/* Colonna 1: CHI SIAMO */}
                <section className="footer-section section-center">
                    <h1 className="text-footer">CHI SIAMO</h1>
                    <p className="white-footer">
                        Dal 1973 creiamo cancelli per giardino, cancellate in ferro, parapetti, ringhiere, e tutti i servizi di fabbro per i nostri clienti ad Avegno e zone limitrofe.
                    </p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#" target="_blank" rel="noreferrer">
                            <img src={Facebook} alt="Facebook" />
                        </a>
                        <a href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z" target="_blank" rel="noreferrer">
                            <img src={Google} alt="Google" />
                        </a>
                    </div>
                </section>

                {/* Colonna 2: SERVIZI */}
                <section className="footer-section section-center">
                    <h1 className="text-footer">SERVIZI</h1>
                    <p className="text-column">Progettazione</p>
                    <p className="text-column">Costruzione</p>
                    <p className="text-column">Montaggio</p>
                    <p className="text-column">Assistenza</p>
                    <p className="text-column title-aree">Aree</p>
                    <div className="aree-row">
                        <span><a className="footer-red-link" href="https://titocci.ch/a/locarno/">Locarno</a></span>
                        <span><a className="footer-red-link" href="https://titocci.ch/a/avegno/">Avegno</a></span>
                    </div>
                </section>

                {/* Colonna 3: CONTATTI */}
                <section className="footer-section section-center">
                    <h1 className="text-footer">CONTATTI</h1>
                    <p className="text-column">In di Salécc 2,</p>
                    <p className="text-column">6670 Avegno</p>

                    <a className="highlight-red" href="mailto:info@titocci.ch">info@titocci.ch</a>
                    <a className="highlight-red" href="tel:+41917962369">Tel. +41 91 796 23 69</a>

                    <div className="badge-container">
                        <img src={Verifizierungbild} alt="Azienda Formatrice" className="badge-img" />
                    </div>
                </section>

                {/* Colonna 4: MAPPA */}
                <section className="footer-section map-section">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11043.906817275687!2d8.742987830688485!3d46.21091841923832!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4785b75776b14f6b%3A0x1a856f78a38373de!2sTitocci%20Metalcostruzioni%20SAGL!5e0!3m2!1sde!2sus!4v1792586980608!5m2!1sde!2sus"
                        className="map-iframe"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Google Maps Standort"
                    ></iframe>
                </section>


            </footer>

            <div className="footer-bottom">
                <p>
                    © 2026 <a href="/home" className="footer-links">Titocci Metalcostruzioni SAGL</a>{' '}
                    <span>|</span>{' '}
                    <a href="/impressum" className="footer-links">Impressum</a>{' '}
                    <span>|</span>{' '}
                    <a href="/privacy" className="footer-links">Privacy</a>
                </p>

                <p>
                    Web Design by{' '}
                    <a href="https://marketingmaster.ch" target="_blank" rel="noreferrer" className="footer-links">
                        marketingmaster.ch
                    </a>{' '}
                    with love
                </p>
            </div>
        </>
    );
}

export default App;