import React, { createContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";

import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import Dropdown from "./assets/Dropdown.png";
import ChisiamoPage from "./pages/Chi Siamo.jsx";
import Galeria from "./pages/Galeria.jsx";
import Servizi from "./pages/Servici.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Kontakte from "./pages/Kontakt.jsx";
import Sitemap from "./pages/Sitemap.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Calculator from "./pages/Calculator.jsx";
import LanguageSwitcher from "./pages/LanguageDropwdon.jsx";
import Imobiliacalculatori from "./pages/ImobiliaCalculatori.jsx";
import Privacy from "./pages/Privacy.jsx";
import Impressumpage from "./pages/Impressum.jsx";
import Avegno from "./pages/Avegno.jsx";

import Locarno from "./pages/Locarno.jsx";
import SEO from './pages/SEO.jsx';
import Customers from './pages/Kundenansicht.jsx';
import ImobiliaPortale from "./pages/ImobiliaPortale.jsx";

import Facebook from "./assets/Facebook.png";
import Instagram from "./assets/Insagram.jfif";
import Google from "./assets/Google.png";
import Verifizierungbild from "./assets/Verifizierung.gif";

import './Styles/App.css';
import ChatInput from "./pages/ChatInput.jsx";
import ChatMessages from "./pages/ChatMessages.jsx";
import Kundenansicht from "./pages/Kundenansicht.jsx";

export const ThemeContext = createContext();

const COOKIE_TEXTS = {
    it: {
        title: "Impostazioni cookie e privacy",
        bannerText:
            "Questo sito utilizza cookie tecnici e, previo consenso, cookie statistici e di profilazione per migliorare l'esperienza di navigazione.",
        privacyLink: "Informativa sulla privacy",
        acceptAll: "Accetta tutti",
        declineAll: "Solo necessari",
        preferences: "Preferenze",
        modalTitle: "Gestisci preferenze cookie",
        modalSubtitle: "Seleziona le categorie di cookie che desideri attivare:",
        necessaryTitle: "Cookie necessari",
        necessaryDesc: "Sempre attivi per il funzionamento essenziale del sito.",
        analyticsTitle: "Statistiche e analisi",
        analyticsDesc: "Ci aiutano a capire come i visitatori interagiscono con il sito.",
        marketingTitle: "Marketing e profilazione",
        marketingDesc: "Utilizzati per mostrare contenuti e comunicazioni pertinenti.",
        cancel: "Annulla",
        save: "Salva preferenze",
        acceptedAlert: "Tutti i cookie sono stati accettati.",
        declinedAlert: "Sono stati salvati solo i cookie necessari.",
        savedAlert: "Le preferenze dei cookie sono state salvate."
    },
    de: {
        title: "Cookie- & Datenschutzeinstellungen",
        bannerText:
            "Diese Website verwendet technisch notwendige Cookies sowie nach Ihrer Zustimmung Statistik- und Marketing-Cookies.",
        privacyLink: "Datenschutzerklärung",
        acceptAll: "Alle akzeptieren",
        declineAll: "Nur notwendige",
        preferences: "Einstellungen",
        modalTitle: "Cookie-Einstellungen anpassen",
        modalSubtitle: "Wählen Sie aus, welche Cookie-Kategorien erlaubt sein sollen:",
        necessaryTitle: "Notwendige Cookies",
        necessaryDesc: "Für die Grundfunktionen der Website immer aktiv.",
        analyticsTitle: "Statistik & Analyse",
        analyticsDesc: "Hilft uns zu verstehen, wie die Website genutzt wird.",
        marketingTitle: "Marketing & Profilierung",
        marketingDesc: "Für relevante Inhalte und Angebote.",
        cancel: "Abbrechen",
        save: "Auswahl speichern",
        acceptedAlert: "Die Cookies wurden erfolgreich akzeptiert.",
        declinedAlert: "Es wurden nur notwendige Cookies aktiviert.",
        savedAlert: "Ihre Cookie-Einstellungen wurden gespeichert."
    }
};

function MainContent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [cookiePrefs, setCookiePrefs] = useState({
        necessary: true,
        analytics: false,
        marketing: false
    });
    const [language, setLanguage] = useState("de");
    const navigate = useNavigate();

    const ct = COOKIE_TEXTS[language] || COOKIE_TEXTS.it;

    // Refs für Newsletter-Formular
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const messageInputRef = useRef(null);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const scrollToInput = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const [focusedField, setFocusedField] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const getInputStyle = (fieldName) => ({
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        borderRadius: '6px',
        border: focusedField === fieldName ? '2px solid #e62b2b' : '1px solid #ccc',
        outline: 'none',
        boxShadow: focusedField === fieldName ? '0 0 8px rgba(230, 43, 43, 0.4)' : 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxSizing: 'border-box'
    });

    useEffect(() => {
        const cookieChoice = localStorage.getItem('cookieConsent');
        const savedPrefs = localStorage.getItem('cookiePreferences');
        if (savedPrefs) {
            try {
                const parsed = JSON.parse(savedPrefs);
                setCookiePrefs({
                    necessary: true,
                    analytics: Boolean(parsed.analytics),
                    marketing: Boolean(parsed.marketing)
                });
            } catch {
                // ignore malformed stored prefs
            }
        }
        if (!cookieChoice) {
            setShowBanner(true);
        }
    }, []);

    const saveCookieSettings = (choiceLabel, prefs) => {
        localStorage.setItem('cookieConsent', choiceLabel);
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
        setCookiePrefs(prefs);
        setShowPreferencesModal(false);
        setShowBanner(false);
    };

    const handleAcceptCookies = () => {
        const allAccepted = { necessary: true, analytics: true, marketing: true };
        saveCookieSettings('accepted', allAccepted);
        alert(ct.acceptedAlert);
    };

    const handleDeclineCookies = () => {
        const onlyNecessary = { necessary: true, analytics: false, marketing: false };
        saveCookieSettings('declined', onlyNecessary);
        alert(ct.declinedAlert);
    };

    const handlePreferredCookies = () => {
        setShowPreferencesModal(true);
    };

    const handleSavePreferences = (e) => {
        e.preventDefault();
        saveCookieSettings('preferred', { ...cookiePrefs, necessary: true });
        alert(ct.savedAlert);
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        if (formData.email.length < 8) {
            alert("Bitte eine gültige E-Mail eingeben");
            return;
        }

        if (formData.name.length < 7) {
            alert("Bitte einen gültigen Namen eingeben");
            return;
        }

        if (formData.message.length < 7) {
            alert("Bitte eine gültige Nachricht eingeben");
            return;
        }

        try {
            const EmailJS_serviceID = 'service_n9toe59';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                subject: "Neue Newsletter-Anmeldung",
                from_name: formData.name || "Newsletter-Abonnent",
                from_email: formData.email,
                message: formData.message || "Interesse an News und Angeboten",
                to_email: "info@titocci.ch",
                signup_date: new Date().toLocaleDateString('de-CH'),
                language: language
            };

            await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            alert('Vielen Dank! Deine Nachricht wurde erfolgreich versendet.');
            navigate('/calculator');

        } catch (error) {
            console.error("Fehler beim Absenden des Formulars:", error.message);
        }
    };

    return (
        <>
            {/* Top Bar / Navigation */}
            <div className="top-bar">
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
                        <Route path="/sitemap" element={<Sitemap lang={language} />} />
                        <Route path="/calculatori" element={<Imobiliacalculatori lang={language} />} />
                        <Route path="/kontakte" element={<Kontakte lang={language} />} />
                        <Route path="/impressum" element={<Impressumpage lang={language} />} />
                        <Route path="/privacy" element={<Privacy lang={language} />} />
                        <Route path="/avegno" element={<Avegno lang={language} />} />
                        <Route path="/locarno" element={<Locarno lang={language} />} />
                        <Route path="/chatbot" element={<Chatbot lang={language} />} />
                        <Route path="/calculator" element={<Calculator lang={language} />} />
                        <Route path="/chatinput" element={<ChatInput lang={language} />} />
                        <Route path="/chatmessage" element={<ChatMessages lang={language} />} />
                        <Route path="/seo" element={<SEO lang={language} />} />
                        <Route path="/imobiliaportale" element={<ImobiliaPortale lang={language} />}/>
                        <Route path="/customers" element={<Customers lang={language} />}/>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </main>

            {/* Verbesserte Cookie Banner Ansicht */}
            {showBanner && (
                <div
                    className="cookie-banner"
                    id="cookieBanner"
                    role="region"
                    aria-label={ct.title}
                    style={{
                        position: 'fixed',
                        left: '16px',
                        right: '16px',
                        bottom: '16px',
                        zIndex: 9990,
                        backgroundColor: 'rgba(20, 20, 22, 0.96)',
                        color: '#ffffff',
                        border: '1px solid #38383e',
                        borderTop: '3px solid #e62b2b',
                        borderRadius: '12px',
                        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.55)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px 22px'
                    }}
                >
                    <div
                        className="cookie-banner-content"
                        style={{
                            maxWidth: '1240px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '20px',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={{ flex: '1 1 420px' }}>
                            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                                {ct.title}
                            </div>
                            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, color: '#d4d4d8' }}>
                                {ct.bannerText}{' '}
                                <Link
                                    to="/privacy"
                                    onClick={() => setShowBanner(false)}
                                    style={{ color: '#ff6b6b', textDecoration: 'underline', fontWeight: 600 }}
                                >
                                    {ct.privacyLink}
                                </Link>
                            </p>
                        </div>

                        <div
                            className="cookie-banner-buttons"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleDeclineCookies}
                                id="cookieDecline"
                                style={{
                                    padding: '9px 14px',
                                    borderRadius: '7px',
                                    border: '1px solid #52525b',
                                    backgroundColor: '#27272a',
                                    color: '#f4f4f5',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {ct.declineAll}
                            </button>
                            <button
                                type="button"
                                onClick={handlePreferredCookies}
                                id="cookiePreference"
                                style={{
                                    padding: '9px 14px',
                                    borderRadius: '7px',
                                    border: '1px solid #71717a',
                                    backgroundColor: 'transparent',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {ct.preferences}
                            </button>
                            <button
                                type="button"
                                onClick={handleAcceptCookies}
                                id="cookieAccept"
                                style={{
                                    padding: '9px 16px',
                                    borderRadius: '7px',
                                    border: 'none',
                                    backgroundColor: '#e62b2b',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                {ct.acceptAll}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verbessertes Cookie Preferenze Modal */}
            {showPreferencesModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cookiePrefsTitle"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.78)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px'
                    }}
                >
                    <form
                        onSubmit={handleSavePreferences}
                        style={{
                            backgroundColor: '#18181b',
                            color: '#ffffff',
                            border: '1px solid #38383e',
                            borderTop: '3px solid #e62b2b',
                            borderRadius: '12px',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                            maxWidth: '500px',
                            width: '100%',
                            padding: '24px',
                            display: 'grid',
                            gap: '14px'
                        }}
                    >
                        <div>
                            <h3 id="cookiePrefsTitle" style={{ margin: '0 0 6px', fontSize: '18px' }}>
                                {ct.modalTitle}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13.5px', color: '#a1a1aa' }}>
                                {ct.modalSubtitle}
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '12px 14px',
                                borderRadius: '8px',
                                backgroundColor: '#222226',
                                border: '1px solid #323238'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{ct.necessaryTitle}</div>
                                <div style={{ fontSize: '12.5px', color: '#b4b4bc', marginTop: '2px' }}>
                                    {ct.necessaryDesc}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked
                                disabled
                                style={{ width: '18px', height: '18px', accentColor: '#e62b2b', cursor: 'not-allowed' }}
                            />
                        </div>

                        <label
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '12px 14px',
                                borderRadius: '8px',
                                backgroundColor: '#222226',
                                border: '1px solid #323238',
                                cursor: 'pointer'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{ct.analyticsTitle}</div>
                                <div style={{ fontSize: '12.5px', color: '#b4b4bc', marginTop: '2px' }}>
                                    {ct.analyticsDesc}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={cookiePrefs.analytics}
                                onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                                style={{ width: '18px', height: '18px', accentColor: '#e62b2b', cursor: 'pointer' }}
                            />
                        </label>

                        <label
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '12px 14px',
                                borderRadius: '8px',
                                backgroundColor: '#222226',
                                border: '1px solid #323238',
                                cursor: 'pointer'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{ct.marketingTitle}</div>
                                <div style={{ fontSize: '12.5px', color: '#b4b4bc', marginTop: '2px' }}>
                                    {ct.marketingDesc}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={cookiePrefs.marketing}
                                onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                                style={{ width: '18px', height: '18px', accentColor: '#e62b2b', cursor: 'pointer' }}
                            />
                        </label>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setShowPreferencesModal(false)}
                                style={{
                                    padding: '9px 15px',
                                    borderRadius: '7px',
                                    border: '1px solid #52525b',
                                    backgroundColor: '#27272a',
                                    color: '#f4f4f5',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {ct.cancel}
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '9px 16px',
                                    borderRadius: '7px',
                                    border: 'none',
                                    backgroundColor: '#e62b2b',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                {ct.save}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Eingebundener Chatbot (nutzt seine eigene funktionierende Logik) */}
            <Chatbot lang={language} />

            <button
                className="scroll-to-top"
                title="Nach oben scrollen"
                onClick={scrollToTop}
            >
                <img className="dropdown-img" src={Dropdown} alt="Nach oben" />
            </button>

            {/* Footer */}
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
                        <span><a className="footer-red-link" href="/locarno">Locarno</a></span>
                        <span><a className="footer-red-link" href="/avegno">Avegno</a></span>
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
                    <h2 className="newsletter"><marquee>Abonniere jetzt unseren Newsletter</marquee></h2>
                    <form className="formular">
                        <span ><label><b>Nome:*</b></label></span>
                        <input
                            type="text"
                            id="name"
                            placeholder="Elias"
                            name="name"
                            ref={nameInputRef}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={() => {
                                setFocusedField('name');
                                scrollToInput(nameInputRef);
                            }}
                            onBlur={() => setFocusedField('name')}
                            required={true}
                            style={getInputStyle('name')}
                        />
                        <span><label><b>E-Mail-Adresse*</b></label></span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="elias.kaiser@gmx.ch"
                            ref={emailInputRef}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => {
                                setFocusedField('email');
                                scrollToInput(emailInputRef);
                            }}
                            onBlur={() => setFocusedField(null)}
                            style={getInputStyle('email')}
                        />
                        <span><label><b>Nachricht:*</b></label>
                            <textarea
                                id="message"
                                name="message"
                                ref={messageInputRef}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => {
                                    setFocusedField('message');
                                    scrollToInput(messageInputRef);
                                }}
                                onBlur={() => setFocusedField('message')}
                                style={getInputStyle('message')}
                                rows="10"
                                cols="100"
                                required={true}
                                placeholder="Bitte eine Nachricht eingeben"
                            />

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
        <BrowserRouter
            basename={import.meta.env.BASE_URL}
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <MainContent />
        </BrowserRouter>
    );
}

export default App;