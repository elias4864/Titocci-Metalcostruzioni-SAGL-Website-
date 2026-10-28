import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

// Asset Imports
import ContactBg from "../assets/Schleifen.jpg";
import "../Styles/Kontakt.css";
import Streifen from "../assets/Streifen.jfif";
import Kontakt from "../assets/Contact.jfif";
import Flieger from "../assets/Flieger.png";
import '../Styles/Servici.css';
import '../Styles/TimeLineSection.css';
import RedFacebook from "../assets/Redfacebook.jfif";
import RedGoogleMaps from "../assets/RedGoogleMaps.jfif";

const heroOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none',
};

function Contatti({ lang }) {
    // 1. Sicheres Handling der Sprache & Mapping für Google Maps Embed
    const currentLang = lang || "de";
    const mapLangMap = {
        de: "de",
        en: "en",
        it: "it",
        fr: "fr"
    };

    const form = useRef();

    const currentMapLang = mapLangMap[currentLang] || "de";
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11043.906817275687!2d8.742987830688485!3d46.21091841923832!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4785b75776b14f6b%3A0x1a856f78a38373de!2sTitocci%20Metalcostruzioni%20SAGL!5e0!3m2!1s${currentMapLang}!2sch!4v1792586980608!5m2!1s${currentMapLang}!2sch`;

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        messaggio: '',
        privacy: false
    });
    const [isHovered, setIsHovered] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);

    // Input- und Container-Refs für reibungsloses Scrollen im Browser
    const emailInputRef = useRef(null);
    const recaptchaRef = useRef(null);
    const messagioRef = useRef(null);
    const nomeInputRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToInput = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // reCAPTCHA v2 Site Key mit direktem Fallback
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Le-tQQuAAAAADd4dqSkP1Q06wIH8RyzRN5wtAzb";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleChangeCaptcha = (token) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.privacy) {
                alert('Si prega di accettare la privacy policy.');
                throw new Error("Datenschutzbestimmungen nicht akzeptiert.");
            }

            if (!captchaToken) {
                alert("Bitte akzeptiere das Google-reCAPTCHA!");
                throw new Error("reCAPTCHA nicht gelöst.");
            }

            if (!formData.nome.trim() || !formData.email.trim() || !formData.messaggio.trim()) {
                if (!formData.nome.trim() && nomeInputRef.current) {
                    nomeInputRef.current.focus();
                    scrollToInput(nomeInputRef);
                } else if (!formData.email.trim() && emailInputRef.current) {
                    emailInputRef.current.focus();
                    scrollToInput(emailInputRef);
                } else if (!formData.messaggio.trim() && messagioRef.current) {
                    messagioRef.current.focus();
                    scrollToInput(messagioRef);
                }
                alert("Bitte fülle alle Pflichtfelder aus!");
                throw new Error("Pflichtfelder fehlen.");
            }

            if (formData.nome.trim().length < 7) {
                if (nomeInputRef.current) {
                    nomeInputRef.current.focus();
                    scrollToInput(nomeInputRef);
                }
                alert("Bitte gib einen gültigen Namen ein (mindestens 7 Zeichen)!");
                throw new Error("Name zu kurz.");
            }

            if (formData.messaggio.trim().length < 10) {
                if (messagioRef.current) {
                    messagioRef.current.focus();
                    scrollToInput(messagioRef);
                }
                alert("Die Nachricht ist zu kurz (mindestens 10 Zeichen)!");
                throw new Error("Nachricht zu kurz.");
            }

            if (formData.email.trim().length < 10) {
                if (emailInputRef.current) {
                    emailInputRef.current.focus();
                    scrollToInput(emailInputRef);
                }
                alert("Bitte gib eine gültige E-Mail-Adresse ein!");
                throw new Error("E-Mail ungültig.");
            }

            const EmailJS_serviceID = 'service_n9toe59';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                from_name: formData.nome,
                from_email: formData.email,
                time: new Date().toLocaleString('it-CH'),
                message: formData.messaggio,
                privacy: formData.privacy,
                'g-recaptcha-response': captchaToken
            };

            const response = await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            console.log('SUCCESS!', response.status, response.text);
            alert('Vielen Dank! Deine Nachricht wurde erfolgreich versendet.');

            setFormData({
                nome: '',
                email: '',
                messaggio: '',
                privacy: false
            });

            setCaptchaToken(null);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }

        } catch (error) {
            console.error("Fehler beim Absenden des Formulars:", error.message);
        }
    };

    return (
        <div ref={containerRef} className="rot" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            {/* Hero Header Section */}
            <div style={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                overflow: 'hidden',
                marginTop: '0px'
            }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <nav style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 50px',
                        boxSizing: 'border-box',
                        zIndex: 20,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}></div>
                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '35px',
                            margin: 0,
                            padding: 0
                        }}>
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Servizi</Link></li>
                            <li><Link to="/galleria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Galleria</Link></li>
                            <li><Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px', fontSize: '14px' }}>Contatti</Link></li>
                        </ul>
                    </nav>

                    <img
                        src={Kontakt}
                        alt="Contatti"
                        style={{
                            width: '100vw',
                            height: '400px',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'brightness(0.5)'
                        }}
                    />

                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '3.5rem',
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
                        }}>
                            Contatti
                        </h1>
                    </div>
                </div>
            </div>

            {/* Formular & Info-Bereich */}
            <div style={{
                maxWidth: '1000px',
                margin: '60px auto',
                padding: '0 20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '60px',
                justifyContent: 'space-between',
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Linke Spalte: Formular */}
                <div style={{ flex: '1 1 500px' }}>
                    <form ref={form} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Nome*</label>
                            <input
                                type="text"
                                name="nome"
                                required
                                placeholder="Alex"
                                value={formData.nome}
                                onChange={handleChange}
                                ref={nomeInputRef}
                                onFocus={() => scrollToInput(nomeInputRef)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Email*</label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                name="email"
                                value={formData.email}
                                required
                                placeholder="alex@gmail.com"
                                onChange={handleChange}
                                onFocus={() => scrollToInput(emailInputRef)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Messaggio*</label>
                            <textarea
                                name="messaggio"
                                rows="5"
                                value={formData.messaggio}
                                onChange={handleChange}
                                onFocus={() => scrollToInput(messagioRef)}
                                ref={messagioRef}
                                placeholder="Ich möchte Auskunft über die Dienstleistungen der Titocci Metalcostruzioni SAGL erhalten..."
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                name="privacy"
                                checked={formData.privacy}
                                onChange={handleChange}
                                id="privacy-check"
                            />
                            <label htmlFor="privacy-check" style={{ fontSize: '0.85rem', color: '#555' }}>
                                Ho letto e accettato le condizioni della <Link to="/privacy" style={{ color: '#e62b2b', textDecoration: 'underline' }}>privacy policy</Link>
                            </label>
                        </div>

                        {/* Sauberes reCAPTCHA-Kästchen */}
                        <div style={{ margin: '15px 0', minHeight: '78px' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={siteKey}
                                onChange={handleChangeCaptcha}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#e62b2b',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                alignSelf: 'flex-start',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                boxSizing: 'border-box',
                                marginBottom: '40px',
                            }}
                        >
                            INVIO
                        </button>
                    </form>
                </div>

                {/* Rechte Spalte: Kontaktdaten & Einzelner Google Maps Iframe */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ color: '#000', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <span style={{ color: '#e62b2b' }}>📄</span> CONTATTI
                        </h3>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a href="tel:+41917962369" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>
                                <img className="streifen" src={Streifen} alt="Streifen Icon" /><span> Tel. +41 91 796 23 69</span>
                            </a>
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <a href="mailto:info@titocci.ch" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{
                                color: isHovered ? 'black' : '#e62b2b',
                                textDecoration: isHovered ? 'underline' : 'none',
                                transition: 'color 0.2s ease'
                            }}>
                                <img className="streifen" src={Streifen} alt="Streifen Icon" /> info@titocci.ch
                            </a>
                        </p>
                    </div>

                    <div>
                        <h3 style={{ color: '#000', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ color: '#e62b2b', display: 'flex', alignItems: 'center' }}>
                                <img className="flieger" src={Flieger} alt="Indirizzo Icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                            </span>
                            INDIRIZZO
                        </h3>
                        <p style={{ margin: '0', fontSize: '0.95rem', color: '#444', lineHeight: '1.5', textAlign: 'left', paddingLeft: '34px' }}>
                            In di Salécc 2,<br />
                            6670 Avegno
                        </p>
                    </div>

                    <div className="footer-social-icons" style={{ display: 'flex', gap: '15px', borderRadius: '50px' }}>
                        <a className="img-facebook" href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#" target="_blank" rel="noreferrer">
                            <img src={RedFacebook} alt="Facebook Icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </a>
                        <a className="img-google" href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z/data=!3m1!4b1!4m5!3m4!1s0x4785b75776b14f6b:0x1a856f78a38373de!8m2!3d46.2040504!4d8.7669132" target="_blank" rel="noreferrer">
                            <img src={RedGoogleMaps} alt="Google Maps Icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </a>
                    </div>

                    {/* Dynamische Google Maps Karte */}
                    <section className="footer-section map-section" style={{ width: '100%', marginTop: '30px', overflow: 'hidden' }}>
                        <iframe
                            src={mapUrl}
                            className="maps-full"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Google Maps Standort"
                            style={{ width: '100%', height: '400px', border: 0 }}
                        ></iframe>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Contatti;