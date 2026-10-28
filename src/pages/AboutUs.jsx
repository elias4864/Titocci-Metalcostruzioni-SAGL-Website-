import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from '@marsidev/react-turnstile';

import Impressumbild from "../assets/Impressum.jpg";
import UseAnimations from 'react-useanimations';
import lock from 'react-useanimations/lib/lock';

import "../Styles/AboutUs.css";
import emailjs from "@emailjs/browser";

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
    pointerEvents: 'none'
};

function AboutUsPage({ lang }) {
    const [formData, setFormData] = useState({
        message: '',
        turnstileToken: ''
    });

    const messagioRef = useRef(null);

    const scrollToInput = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        try {
            // 1. Validierung der Nachrichtenlänge
            if (!formData.message || formData.message.trim().length < 10) {
                if (messagioRef.current) {
                    messagioRef.current.focus();
                    scrollToInput(messagioRef);
                }
                alert("Die Nachricht ist zu kurz (mindestens 10 Zeichen)!");
                return;
            }

            // 2. Turnstile-Prüfung
            if (!formData.turnstileToken) {
                alert("Bitte bestätige, dass du kein Roboter bist (Turnstile).");
                return;
            }

            const EmailJS_serviceID = 'service_qa3r1ej';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                message: formData.message,
                'g-recaptcha-response': formData.turnstileToken
            };

            const response = await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            console.log('SUCCESS!', response.status, response.text);
            alert('Vielen Dank! Deine Nachricht wurde erfolgreich versendet.');

            // Formular zurücksetzen
            setFormData({
                message: '',
                turnstileToken: ''
            });

        } catch (error) {
            console.error("Fehler beim Absenden des Formulars:", error.message);
            alert("Fehler beim Senden der Nachricht.");
        }
    };

    return (
        <div className="rot" style={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff' }}>
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

                    {/* Navbar */}
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
                            <li><Link to="/galeria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Galleria</Link></li>
                            <li><Link to="/kontakte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Contatti</Link></li>
                            <li><Link to="/privacy" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Contatti</Link></li>

                        </ul>
                    </nav>

                    <img
                        src={Impressumbild}
                        alt="Galleria"
                        style={{
                            width: '100vw',
                            height: '450px',
                            objectFit: 'cover',
                            display: 'block',
                            imageRendering: '-webkit-optimize-contrast',
                            filter: 'contrast(108%) saturate(102%)',
                        }}
                    />

                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 2
                    }} />

                </div>
            </div>

            {/* Untere Sektion */}
            <div style={{ maxWidth: '1000px', margin: '60px auto 40px auto', padding: '0 20px', textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{
                    fontSize: '2rem',
                    color: '#f59e0b',
                    fontWeight: 'bold',
                    margin: '0 0 20px 0',
                    textAlign: 'center'
                }}>
                    Alcuni dei nostri lavori & Storia
                </h1>

                {/* Integriertes E-MailJS Formular mit Turnstile */}
                <form onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '30px 0', padding: '25px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: 0, color: '#e62b2b' }}>Invia un messaggio</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="message" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Messaggio (min. 10 caratteri)*:</label>
                        <textarea
                            id="message"
                            ref={messagioRef}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows="5"
                            placeholder="Scrivi qui il tuo messaggio..."
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ margin: '10px 0' }}>
                        <Turnstile
                            siteKey="0x4AAAAAAFpm7ahS6lg9KOLG"
                            onSuccess={(token) => {
                                setFormData(prev => ({ ...prev, turnstileToken: token }));
                            }}
                            onError={() => {
                                console.error("Turnstile Fehler");
                            }}
                            onExpire={() => {
                                setFormData(prev => ({ ...prev, turnstileToken: '' }));
                            }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#e62b2b', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
                        Invia Messaggio
                    </button>
                </form>

                <h2 className="about-us" style={{ color: '#e62b2b', fontSize: '1.5rem', marginBottom: '10px' }}>
                    Titocci Metalcostruzioni SAGL
                </h2>

                <section style={{ lineHeight: '1.6', color: '#333', fontSize: '1rem' }}>
                    <p>
                        Dal <b>1973</b> la nostra azienda è sinonimo di qualità e passione nella lavorazione del metallo e nella carpenteria metallica. Fondata da Titocci Giovanni a Ponte Brolla, l'azienda si è trasferita nel <b>1982</b> ad Avegno, dove tuttora risiede la nostra officina principale.
                    </p>

                    <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #e62b2b' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#111' }}>Dati Aziendali</h3>
                        <p style={{ margin: '5px 0' }}><b>Ragione Sociale:</b> Titocci Metalcostruzioni SAGL</p>
                        <p style={{ margin: '5px 0' }}><b>Anno di Fondazione:</b> 1973 (SAGL dal 2017)</p>
                        <p style={{ margin: '5px 0' }}><b>Indirizzo:</b> In di Salécc 2, 6670 Avegno</p>
                        <p style={{ margin: '5px 0' }}><b>Paese:</b> Svizzera (Ticino)</p>
                        <p style={{ margin: '5px 0' }}><b>Titolare:</b> Marco Titocci (dal 2012)</p>
                        <p style={{ margin: '5px 0' }}>
                            <b>Telefono:</b> <a href="tel:+41917962369" style={{ color: '#e62b2b', textDecoration: 'underline', fontWeight: 'bold' }}>+41 91 796 23 69</a>
                        </p>
                        <p style={{ margin: '5px 0', fontSize:'25px' }}>
                            <b>E-Mail:</b> <a href="mailto:info@titocci.ch" style={{ color: '#e62b2b', textDecoration: 'underline', fontWeight: 'bold' }}>info@titocci.ch</a>
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                        <h3 style={{ fontSize: '1.3rem', margin: 0, color:'gold' }}>Protezione dei Dati (nDSG / DSGVO)</h3>
                        <UseAnimations animation={lock} size={50} strokeColor="#e62b2b" />
                    </div>

                    <p style={{ marginTop: '10px' }}>
                        Titocci Metalcostruzioni SAGL garantisce il rispetto della legge federale sulla protezione dei dati (<b>nDSG</b>) in Svizzera e del regolamento europeo <b>DSGVO</b>. I dati personali inviati tramite i moduli di contatto (nome, e-mail, messaggio) vengono utilizzati unicamente per elaborare le richieste dei clienti e non vengono mai ceduti a terzi senza previo consenso espresso.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default AboutUsPage;