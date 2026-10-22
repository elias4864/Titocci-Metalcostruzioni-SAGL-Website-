import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/Icon.jpg';
import Zeit from '../assets/Zeit.png';
import NavIcon from '../assets/Navicon.png';
import StatCard from '../pages/StatCard';
import Email from '../assets/Email.png';
import PC from '../assets/PC.png';
import Facebook from '../assets/Facebook.png';
import Zangen from '../assets/Zangen.jfif';
import Schleifen from '../assets/Schleifen.jpg';
import Bauplan from '../assets/Bauplan.jfif';
import Diplom from '../assets/Diplom.jfif';
import Person from '../assets/Person.jfif';
import Werkstattbild from '../assets/Werkstatt.jfif';
import Kreislauf from '../assets/Statistiken.jfif';
import Google from '../assets/Google.png';
import RedGoogleMaps from '../assets/RedGoogleMaps.jfif';
import Verifizierung from '../assets/Verifizierung.gif';
import '../Styles/Home.css';
import RedFacebook from "../assets/Redfacebook.jfif";

const IMAGES = [
    { id: 1, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVirl6neqny0T2cnyJFMtcaUhsAXd1M7DOrKlXOmUmA&s=10', title: 'Holzkonstrukt' },
    { id: 2, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSyFwelmj0lWPHop-VgH0r1glCcIqcnEkaeevl0MTyGw&s=10', title: 'Verranda Holz' },
    { id: 3, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBaznEf847qP7ZInEym9tGqMevvKi37uEgjnNr56jCjuzOuJEHfEYSEbZo&s=10', title: 'Treppe Holzbau' },
    { id: 4, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXYGuJJ3Q4UY5DPdIhw6YTVdNPx_cdmms6o8hXfSdVPrMxoqnj3O7Xus0&s=10', title: 'Metallgiter Haus' }
];

const navButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    zIndex: 10
};

const imageCaptionStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: 'white',
    padding: '8px 0',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    boxSizing: 'border-box',
    zIndex: 2
};

const heroOverlayStyle = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none'
};

function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    };

    if (!isOpen) return null;

    return (
        <>
            <header className="App-header">
                <div className="info-row">
                    <img src={Icon} alt="Standort" className="header-img" />
                    <p><b>In di Salécc 2, 6670 Avegno</b></p>
                </div>

                <div className="info-row">
                    <img src={Zeit} alt="Öffnungszeiten" className="header-img" />
                    <p><b>
                        Lunedì - Venerdì: 7:30 - 12:00 / 13:15 - 17:00;<br />
                        Sabato / Domenica: Chiuso
                    </b></p>

                    <div className="footer-social-icons">
                        <a className="img-facebook" href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#" target="_blank" rel="noreferrer">
                            <img src={RedFacebook} alt="Facebook Icon" />
                        </a>
                        <a className="img-google" href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z/data=!3m1!4b1!4m5!3m4!1s0x4785b75776b14f6b:0x1a856f78a38373de!8m2!3d46.2040504!4d8.7669132" target="_blank" rel="noreferrer">
                            <img src={RedGoogleMaps} alt="Google Maps Icon" />
                        </a>
                    </div>
                </div>

                <div className="info-row">
                    <img src={Email} alt="Kontakt" className="header-img" />
                    <p className="contact"><b>
                        Contatti: info@titocci.ch<br />
                        Tel. +41 91 796 23 69
                    </b></p>
                </div>
            </header>

            {/* Slider & Navbar Container */}
            <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>

                    {/* HIER INTEGRIERT: Die Navbar exakt über die volle Breite des Bildes */}
                    <nav style={{
                        position: 'absolute',
                        top: 0,


                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 25px',
                        boxSizing: 'border-box',
                        zIndex: 20
                    }}>
                        {/* Logo links im Bild */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={Icon} alt="Logo" style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>

                        {/* Menüpunkte rechts im Bild */}
                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '25px',
                            margin: 0,
                            padding: 0
                        }}>
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                            <li><Link to="/galleria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                            <li><Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Contatti</Link></li>
                        </ul>
                    </nav>

                    <button onClick={prevImage} style={{ ...navButtonStyle, left: '10px' }}>◀</button>

                    <img
                        src={IMAGES[currentIndex].url}
                        alt={IMAGES[currentIndex].title}
                        style={{
                            width: '100vw',
                            height: '550px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            display: 'block',
                            filter: 'brightness(0.7)'
                        }}
                    />

                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            margin: '0 0 5px 0',
                            textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
                        }}>
                            Progettazione
                        </h1>

                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            margin: '0 0 18px 0',
                            color: '#ffffff',
                            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                        }}>
                            Preventivi e <span style={{ color: '#e62b2b' }}>consulenze</span>
                        </h2>

                        <Link to="/contatti" style={{
                            display: 'inline-block',
                            backgroundColor: '#e62b2b',
                            color: 'white',
                            padding: '10px 24px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderRadius: '1px',
                            fontSize: '0.95rem',
                            pointerEvents: 'auto',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                            Contattaci
                        </Link>
                    </div>

                    <p style={imageCaptionStyle}>
                        {IMAGES[currentIndex].title}
                    </p>

                    <button onClick={nextImage} style={{ ...navButtonStyle, right: '10px' }}>▶</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
                    {IMAGES.map((image, index) => (
                        <img
                            key={image.id}
                            src={image.url}
                            alt={image.title}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: '80px',
                                height: '50px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                border: currentIndex === index ? '3px solid #e62b2b' : '3px solid transparent',
                                opacity: currentIndex === index ? 1 : 0.6,
                                transition: 'all 0.2s ease'
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="div-white">
                <div className="orange-section">
                    <img className="section-img" src={PC} alt="Progettazione" />
                    <h2 className="section-title">Progettazione</h2>
                </div>

                <div className="grey-section">
                    <img className="section-img" src={Schleifen} alt="Costruzione" />
                    <h2 className="section-title">Costruzione</h2>
                </div>

                <div className="orange-section">
                    <img className="section-img" src={Bauplan} alt="Montaggio" />
                    <h2 className="section-title">Montaggio</h2>
                </div>

                <div className="grey-section">
                    <img className="section-img" src={Zangen} alt="Assistenza" />
                    <h2 className="section-title">Assistenza</h2>
                </div>
            </div>

            <div className="orange-div">
                <span><h2 className="person-img">I NOSTRI PUNTI DI FORZA</h2></span>
                <img className="person-img" src={Diplom} alt="Diplom" />
                <p className="text-black"><b>Personale qualificato</b></p>

                <img className="person-img" src={Person} alt="Person" />
                <p className="text-black"><b>Tantissimi clienti soddisfatti</b></p>

                <img className="person-img" src={Werkstattbild} alt="Werkstatt" />
                <p className="text-black"><b>Officina ultra attrezzata</b></p>
            </div>

            <div className="white-div">
                <h2 className="text-white">I NOSTRI PUNTI DI LAVORI</h2>
            </div>

            <div className="orange-div">
                <h2 className="text-white"> </h2>
                <img className="wirtschaft-img" src={Kreislauf} alt="Kreislauf" />

                <div className="banner-stats">
                    <StatCard value={286} suffix="+" label="Progetti realizzati" />
                    <StatCard value={286} label="Clienti soddisfatti" />
                    <StatCard value={8} label="Progetti attivi" />
                    <StatCard value={6} label="Progetti in attesa" />
                </div>
            </div>

            <footer className="footer-div">
                <section>
                    <h1 className="text-footer">CHI SIAMO</h1>
                    <p className="white-footer">
                        Dal 1973 creiamo cancelli per giardino, cancellate in ferro, parapetti, ringhiere, e tutti i servizi di fabbro per i nostri clienti ad Avegno e zone limitrofe.
                    </p>

                    <div className="footer-social-icons">
                        <a className="img-facebook" href="https://www.facebook.com/people/Titocci-Metalcostruzioni-Sagl/100063745770320/#" target="_blank" rel="noreferrer">
                            <img src={Facebook} alt="Facebook Icon" />
                        </a>
                        <a className="img-google" href="https://www.google.com/maps/place/Titocci+Metalcostruzioni+SAGL/@46.2040504,8.7647245,17z/data=!3m1!4b1!4m5!3m4!1s0x4785b75776b14f6b:0x1a856f78a38373de!8m2!3d46.2040504!4d8.7669132" target="_blank" rel="noreferrer">
                            <img src={Google} alt="Google Maps Icon" />
                        </a>
                    </div>
                </section>

                <section>
                    <p className="white-footer">SERVIZI</p>
                    <p className="text-column">Progettazione</p>
                    <p className="text-column">Costruzione</p>
                    <p className="text-column">Montaggio</p>
                    <p className="text-column">Assistenza</p>
                </section>

                <p className="text-column"><b>Aree</b></p>
                <div className="links-container">
                    <span className="links-row">Locarno</span>
                    <span className="links-row">Avegno</span>
                </div>

                <section>
                    <h1 className="text-footer">CONTATTI</h1>
                    <p className="text-column">In di Salécc 2, 6670 Avegno</p>

                    <a className="highlight-red" href="mailto:info@titocci.ch">info@titocci.ch</a>
                    <a className="highlight-red" href="tel:+41917962369">Tel. +41 91 796 23 69</a>

                    <img src={Verifizierung} className="verification-img" alt="Verifizierung" />

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11043.906817275687!2d8.742987830688485!3d46.21091841923832!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4785b75776b14f6b%3A0x1a856f78a38373de!2sTitocci+Metalcostruzioni+SAGL!5e0!3m2!1sde!2sus!4v1792586980608!5m2!1sde!2sus"
                        width="300"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Google Maps Standort"
                    ></iframe>
                </section>
            </footer>
        </>
    );
}

export default Home;