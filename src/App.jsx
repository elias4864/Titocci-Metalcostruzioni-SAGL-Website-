import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import Dropdown from "./assets/Dropdown.png";
import ChisiamoPage from "./pages/Chi Siamo.jsx";
import Galeria from "./pages/Galeria.jsx";
import Servizi from "./pages/Servici.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Kontakte from "./pages/Kontakt.jsx";
import Sitemap from "./pages/Sitemap.jsx";
import './Styles/App.css';
import LanguageSwitcher from "./pages/LanguageDropwdon.jsx";
import Imobiliacalculatori from "./pages/ImobiliaCalculatori.jsx";

import Facebook from "./assets/Facebook.png";
import Privacy from "./pages/Privacy.jsx";
import Instagram from "./assets/Insagram.jfif";
import Google from "./assets/Google.png";
import Verifizierungbild from "./assets/Verifizierung.gif";
import Impressumpage from "./pages/Impressum.jsx";
import emailjs from "@emailjs/browser";

// Innere Komponente, die Zugriff auf den Router-Kontext (useNavigate) hat
function MainContent() {
    const [showBanner, setShowBanner] = useState(false);
    const [language, setLanguage] = useState("de");
    const navigate = useNavigate();

    // Refs für Newsletter-Formular
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const messageInputRef = useRef(null);

    // Funktion zum Nach-oben-Scrollen
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    /**
     * ScrolltoInput Ref
     * @param inputRef
     */
    const scrollToInput = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });



    useEffect(() => {
        const cookieChoice = localStorage.getItem('cookieConsent');
        if (!cookieChoice) {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        alert("Die Cookies wurden akzeptiert");
        setShowBanner(false);
    };

    const handleDeclineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        alert("Die Cookies wurden abgelehnt!");
        setShowBanner(false);
    };

    const handlePreferredCookies = () => {
        localStorage.setItem('cookieConsent', 'preferred');
        setShowBanner(false);
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        alert("Nachricht wurde erfolgreich gesendet an die Titocci Metalconstruzione SAGL");


        if(formData.email.length<8) {
            alert("Bitte eine gültige E-Mail eingeben");
        }
        navigate('/kontakte');

        try {
            const EmailJS_serviceID = 'service_n9toe59';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                from_name: "Newsletter Abonnent",
                from_email: "info@titocci.ch",

            };

            const response = await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            console.log('SUCCESS!', response.status, response.text);
            alert('Vielen Dank! Deine Nachricht wurde erfolgreich versendet.');

        } catch (error) {
            console.error("Fehler beim Absenden des Formulars:", error.message);
        }
    };



    const translations = {
        de: {
            navHome: "Home",
            navCarrosserie: "Carrosserie",
            navAufbereitung: "Autoaufbereitung",
            navAufbereitungTitle:"Aufbereitung",
            navKontakt: "Kontakt",
            navLackierei: "Autolackiererei",
            navAnfrage: "Anfrage",
            navChatbot: "Chatbot",
            navTermin: "Termin",

            navLackierereititle:"Lackierei",
            navDatenschutzerklärung: "Datenschutzerklärung",
            navPrivacyPolicy: "Datenschutzerklärung öffnen",
            wikiText:"Wiki",

            navAutolackieren: "Auto lackieren",
            newsletterTitle: " Unser Newsletter abonnieren",
            navKontakt2:"Kontakt aufnehmen",
            newsletterDesc: "Abonnieren Sie unseren Newsletter für aktuelle Angebote und News.",
            newsletterEmailPlaceholder: "Ihre E-Mail-Adresse",
            newsletterSubmit: "Abonnieren",
            newsletterSuccess: "Vielen Dank für Ihre Anmeldung!",
            navSpenglerei: "Spenglerei",
            navGalerie: "Galerie",
            navSpengler: "Spengler",
            navAutopflege: "Autopflege",
            navFahrzeugaufbereitung: "Fahrzeugaufbereitung",
            modalTitle: "Nehmen Sie jetzt Kontakt mit uns auf",
            phoneLabel: "Telefon:",
            callBtn: "Jetzt anrufen",
            closeBtn: "Schliessen",
            contactTitle: "Kontakt",
            hoursTitle: "Öffnungszeiten",
            hoursWeek: "Mo – Do: 07.30 – 12.00 Uhr | 13.00 – 17.30 Uhr",
            hoursFri: "Fr: 07.30 – 12.00 Uhr | 13.00 – 16.30 Uhr",
            socialText: "Folgen Sie uns jetzt auf unseren Social Media Kanälen:",
            companyTitle: "Carrosserie Örlike TL AG",
            companyOwners: "Duje Antonina / Michael Nufer",
            companyAddress: "Fabrikstrasse 17, 8102 Oberengstringen",
            metaTitle: "Carrosserie Örlike TL AG | Carrosserie, Lackiererei & Spenglerei in Oberengstringen",
            metaDesc: "Professionelle Carrosseriearbeiten, Unfallinstandsetzung, Lackiererei, Spenglerei und Fahrzeugaufbereitung in Oberengstringen / Zürich.",
        },
        en: {
            navHome: "Home",
            navCarrosserie: "Body Shop",
            navAufbereitung: "Car Detailing",
            navAufbereitungTitle:"Processing",
            navDatenschutzerklärung: "Privacy Policy",
            navAnfrage: "Inquiry",
            wikiText:"Wiki",
            navChatbot: "AI chatbot",

            navKontakt2: "make contact",
            navKontakt: "Contact",
            navSpenglerei: "Sheet Metal Work",
            navFahrzeugaufbereitung: "Vehicle detailing",
            navAutopflege: "Car Care",
            navSpengler: "Spengler",
            modalTitle: "Get in touch with us now",
            navLackierei: "Auto Body and Paint Shop",
            navAutolackieren: "Car painting",
            navLackierereititle:"paint shop",
            newsletterTitle: "Subscribe to our Newsletter",
            newsletterDesc: "Subscribe to our newsletter for the latest offers and news.",
            newsletterEmailPlaceholder: "Your email address",
            newsletterSubmit: "Subscribe",
            newsletterSuccess: "Thank you for subscribing!",
            navPrivacyPolicy:"Privacy Policy",
            navGalerie: "Gallery",
            navTermin:"Appointment",
            phoneLabel: "Phone:",
            callBtn: "Call now",
            closeBtn: "Close",
            contactTitle: "Contact",
            hoursTitle: "Opening Hours",
            hoursWeek: "Mon – Thu: 07.30 – 12.00 | 13.00 – 17.30",
            hoursFri: "Fri: 07.30 – 12.00 | 13.00 – 16.30",
            socialText: "Follow us now on our social media channels:",
            companyTitle: "Carrosserie Örlike TL AG",
            companyOwners: "Duje Antonina / Michael Nufer",
            companyAddress: "Fabrikstrasse 17, 8102 Oberengstringen",
            metaTitle: "Carrosserie Örlike TL AG | Body & Paint Shop Oberengstringen",
            metaDesc: "Professional body shop, paint shop, sheet metal work, and car detailing in Oberengstringen, Zurich."
        },
        it: {
            navHome: "Home",
            navCarrosserie: "Carrozzeria",
            navAufbereitung: "Preparazione auto",
            navAufbereitungTitle:"Trattamento",
            navKontakt: "Contatti",
            navDatenschutzerklärung:"Informativa sulla privacy",
            navPrivacyPolicy:"Informativa sulla privacy",
            wikiText:"Wiki",
            navTermin:"Appuntamento",
            navChatbot:"sull'IA",
            navAnfrage: "Richiesta",
            navKontakt2:"make contact",
            navLackierei: "Carrozzeria (verniciatura auto)",
            navAutolackieren: "Verniciare l'auto",
            navLackierereititle:"Reparto verniciatura",
            newsletterTitle: "Iscriviti alla nostro Newsletter",
            newsletterDesc: "Iscriviti alla nostra newsletter per ricevere le ultime offerte e novità.",
            newsletterEmailPlaceholder: "Il tuo indirizzo e-mail",
            newsletterSubmit: "Iscriviti",
            newsletterSuccess: "Grazie per l'iscrizione!",

            navAutopflege: "Cura dell'auto",
            navSpenglerei: "Lattoneria",
            navSpengler: "Lattoniere",
            navGalerie: "Galleria",
            modalTitle: "Mettetevi in contatto con noi ora",
            phoneLabel: "Telefono:",
            callBtn: "Chiama ora",
            closeBtn: "Chiudi",
            contactTitle: "Contatto",
            hoursTitle: "Orari di apertura",
            hoursWeek: "Lun – Gio: 07.30 – 12.00 | 13.00 – 17.30",
            hoursFri: "Ven: 07.30 – 12.00 | 13.00 – 16.30",
            socialText: "Seguiteci ora sui nostri canali social:",
            companyTitle: "Carrozzeria Örlike TL AG",
            companyOwners: "Duje Antonina / Michael Nufer",
            companyAddress: "Fabrikstrasse 17, 8102 Oberengstringen",
            metaTitle: "Carrozzeria Örlike TL AG | Carrozzeria e Verniciatura Oberengstringen",
            metaDesc: "Servizi professionali di carrozzeria, verniciatura, lattoneria e preparazione auto a Oberengstringen / Zurigo.",

        },
        fr: {
            navHome: "Accueil",
            navCarrosserie: "Carrosserie",
            navAufbereitung: "Préparation automobile",
            navAufbereitungTitle:"Traitement",
            navKontakt: "Contact",
            navGalerie: "Galerie",
            wikiText: "Wiki",
            navAnfrage: "Demande",
            navChatbot: "Chatbot IA",
            navLackierei: "Atelier de peinture automobile",
            navDatenschutzerklärung:"Déclaration de protection des données",
            navPrivacyPolicy:"Déclaration de protection des données",
            navLackierereititle:"atelier de peinture",
            navAutolackieren: "Peindre une voiture",
            navKontakt2:"Prendre contact",
            navFahrzeugaufbereitung: "Préparation esthétique de véhicules",
            navAutopflege: "Entretien automobile",
            newsletterTitle: "S'abonner à notre Newsletter",
            newsletterDesc: "Abonnez-vous à notre newsletter pour recevoir nos dernières offres et actualités.",
            newsletterEmailPlaceholder: "Votre adresse e-mail",
            newsletterSubmit: "S'abonner",
            newsletterSuccess: "Merci für votre inscription!",
            navSpenglerei: "Zinguerie",
            navSpengler: "Spengler",
            modalTitle: "Contactez-nous dès maintenant",
            phoneLabel: "Téléphone:",
            navTermin: "Rendez-vous",
            callBtn: "Appeler maintenant",
            closeBtn: "Fermer",
            contactTitle: "Contact",
            hoursTitle: "Heures d'ouverture",
            hoursWeek: "Lun – Jeu: 07h30 – 12h00 | 13h00 – 17h30",
            hoursFri: "Ven: 07h30 – 12h00 | 13h00 – 16h30",
            socialText: "Suivez-nous dès maintenant sur nos réseaux sociaux:",
            companyTitle: "Carrosserie Örlike TL AG",
            companyOwners: "Duje Antonina / Michael Nufer",
            companyAddress: "Fabrikstrasse 17, 8102 Oberengstringen",
            metaTitle: "Carrosserie Örlike TL AG | Carrosserie & Peinture à Oberengstringen",
            metaDesc: "Services professionnels de carrosserie, peinture, zinguerie et préparation automobile à Oberengstringen / Zurich."
        }
    };


    return (
        <>
            {/* Navbar links */}
            <div className="top-bar">
                {/* Navbar rechts */}
                <div className="navbar-right">
                    <Navbar />
                </div>
            </div>

            <div style={{ padding: '10px 20px', backgroundColor: '#222', display: 'flex', justifyContent: 'flex-end', color: 'orange' }}>
                <LanguageSwitcher lang={language} onLanguageChange={setLanguage} />
            </div>

            <main className="hero-image-wrapper">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home lang={language} />} />
                        <Route path="/home" element={<Home lang={language} />} />
                        <Route path="/servizi" element={<Servizi lang={language} />} />
                        <Route path="/chi-siamo" element={<ChisiamoPage lang={language} />} />
                        <Route path="/galeria" element={<Galeria lang={language} />} />
                        <Route path="/aboutus" element={<AboutUs lang={language} />} />
                        <Route path="/sitemap" element={<Sitemap />} />
                        <Route path="/calculatori" element={<Imobiliacalculatori />} />
                        <Route path="/kontakte" element={<Kontakte lang={language} />} />
                        <Route path="/impressum" element={<Impressumpage lang={language} />} />
                        <Route path="/privacy" element={<Privacy lang={language} />} />
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

            <button
                className="scroll-to-top"
                title="Nach oben scrollen"
                onClick={scrollToTop}
            >
                <img className="dropdown-img" src={Dropdown} alt="Nach oben" />
            </button>

            <footer className="footer-div">
                <section className="footer-section section-center">
                    <h1 className="text-footer">CHI SIAMO</h1>
                    <p className="white-footer">
                        Dal 1973 creiamo cancelli per giardino, cancellate in ferro, parapetti, ringhiere, e tutti i servizi di fabbro per i nostri clienti ad Avegno e zone limitrofe.
                    </p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#" target="_blank" rel="noreferrer">
                            <img className="img-icon" src={Facebook} alt="Facebook" />
                        </a>
                        <a href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z" target="_blank" rel="noreferrer">
                            <img className="img-icon" src={Google} alt="Google" />
                        </a>
                        <a href="https://www.instagram.com/costruzionimetalliche_sagl/" target="_blank" rel="noreferrer">
                            <img className="instagram" src={Instagram} alt="Instagram" />
                        </a>
                    </div>
                </section>

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

                <div>
                    <h2 className="newsletter"><marquee>Aboniere jetzt unseren Newsletter </marquee></h2>

                    <form className="formular">
                        <span><label><b>Nome:*</b></label></span>
                        <input type="text" id="name" placeholder="Elias" name="name" ref={nameInputRef} onFocus={() => scrollToInput(nameInputRef)}
                        />
                        <span><label><b>E-Mail-Adresse*</b></label></span>
                        <input type="email" id="email" name="email"  required placeholder="elias.kaiser@gmx.ch" onFocus={()=>scrollToInput(emailInputRef)} ref={emailInputRef} />

                        <span><label><b>Nachricht:*</b></label>
                            <textarea id="message" name="message" ref={messageInputRef} onFocus={()=>scrollToInput(messageInputRef)} rows="10" cols="100">

                            </textarea>

                        </span>
                    </form>

                    <button onClick={sendEmail} className="red-btn">
                        Newsletter abonnieren
                    </button>
                </div>

                <div className="footer-bottom">
                    <p>
                        © 2026 <Link to="/home" className="footer-links">Titocci Metalcostruzioni SAGL</Link>{' '}
                        <span>|</span>{' '}
                        <Link to="/impressum" className="footer-links">Impressum</Link>{' '}
                        <span>|</span>{' '}
                        <Link to="/privacy" className="footer-links">Privacy</Link>
                    </p>
                    <p className="footer-copyright">
                        Web Design by{' '}
                        <a href="https://marketingmaster.ch" target="_blank" rel="noreferrer" className="footer-links">
                            marketingmaster.ch
                        </a>{' '}
                        with love
                    </p>
                </div>
            </footer>
        </>
    );
}

function App() {
    return (
        <BrowserRouter basename="/Titocci-Metalcostruzioni-SAGL-Website-">
            <MainContent />
        </BrowserRouter>
    );
}

export default App;