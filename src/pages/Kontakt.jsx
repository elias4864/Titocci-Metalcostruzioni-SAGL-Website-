import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Asset Imports
import Icon from "../assets/Icon.jpg";
import ContactBg from "../assets/Schleifen.jpg";
import "../Styles/Kontakt.css";

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
    pointerEvents: 'none'
};

function Contatti() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        messaggio: '',
        privacy: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Messaggio inviato con successo!');
    };

    return (
        <div className="rot" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        </div>

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
                        src={ContactBg}
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

            {/* Kontaktformular & Info Bereich */}
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
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
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
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Messaggio</label>
                            <textarea
                                name="messaggio"
                                rows="5"
                                value={formData.messaggio}
                                onChange={handleChange}
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
                                Ho letto e accettato le condizioni della <Link to="/privacy" style={{ color: '#e62b2b', textDecoration: 'none' }}>privacy policy</Link>
                            </label>
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
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            INVIO
                        </button>
                    </form>
                </div>

                {/* Rechte Spalte: Kontaktdaten */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div>
                        <h3 style={{
                            color: '#000',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '15px'
                        }}>
                            <span style={{ color: '#e62b2b' }}>📄</span> CONTATTI
                        </h3>
                        <p style={{
                            margin: '5px 0',
                            fontSize: '0.95rem',
                            color: '#444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#e62b2b' }}>📞</span> Tel. +41 91 796 23 69
                        </p>
                        <p style={{
                            margin: '5px 0',
                            fontSize: '0.95rem',
                            color: '#444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#e62b2b' }}>✉️</span> info@titocci.ch
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            color: '#000',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '15px'
                        }}>
                            <span style={{ color: '#e62b2b' }}>📍</span> INDIRIZZO
                        </h3>
                        <p style={{
                            margin: '5px 0',
                            fontSize: '0.95rem',
                            color: '#444',
                            lineHeight: '1.5'
                        }}>
                            In di Salécc 2,<br />
                            6670 Avegno
                        </p>
                    </div>

                    <div className="footer-social-icons" style={{ display: 'flex', gap: '15px' }}>
                        <a className="img-facebook"
                           href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#"
                           target="_blank" rel="noreferrer">
                            <img src={RedFacebook} alt="Facebook Icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </a>
                        <a className="img-google"
                           href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z/data=!3m1!4b1!4m5!3m4!1s0x4785b75776b14f6b:0x1a856f78a38373de!8m2!3d46.2040504!4d8.7669132"
                           target="_blank" rel="noreferrer">
                            <img src={RedGoogleMaps} alt="Google Maps Icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </a>
                    </div>

                    <iframe
                        className="maps-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.964782838872!2d8.740326876315036!3d46.211155571096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4785b75776b14f6b%3A0x1a856f78a38373de!2sTitocci%20Metalcostruzioni%20SAGL!5e0!3m2!1sde!2sch!4v1792763434793!5m2!1sde!2sch"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default Contatti;