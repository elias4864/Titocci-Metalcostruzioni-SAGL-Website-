import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/Icon.jpg';
import Zeit from '../assets/Zeit.png';
import Email from '../assets/Email.jpg';
import PC from '../assets/PC.jpg';
import Zangen from '../assets/Zangen.jpg';
import Schleifbild from '../assets/Schleifen.jpg';
import Bauplan from '../assets/Baubplan.jpg';
import Diplom from '../assets/Diplom.jpg';
import Person from '../assets/Person.jpg';
import Werkstattbild from '../assets/Werkstatt.jpg';
import Kreislauf  from '../assets/Schwankungen.jpg';
import '../Styles/Home.css';

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

// Caption unten im Bild (Bildtitel)
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

// Text-Overlay zentriert im Bild
const heroOverlayStyle = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none' // Damit Buttons anklickbar bleiben
};

function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    };

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
                </div>

                <div className="info-row">
                    <img src={Email} alt="Kontakt" className="header-img" />
                    <p><b>
                        Contatti: info@titocci.ch<br />
                        Tel. +41 91 796 23 69
                    </b></p>
                </div>
            </header>

            <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'center' }}>

                {/* Hauptbild mit integriertem Text-Overlay */}
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', justifyContent: 'space-between' }}>
                    <button onClick={prevImage} style={{ ...navButtonStyle, left: '10px' }}>◀</button>

                    <img
                        src={IMAGES[currentIndex].url}
                        alt={IMAGES[currentIndex].title}
                        style={{
                            width: '100%',
                            height: '380px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            display: 'block',
                            filter: 'brightness(0.7)' // Leicht abgedunkelt, damit der Text perfekt lesbar ist
                        }}
                    />

                    {/* Der Text DIREKT IM BILD */}
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
                            borderRadius: '4px',
                            fontSize: '0.95rem',
                            pointerEvents: 'auto', // Button wieder klickbar machen
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                            Contattaci
                        </Link>
                    </div>

                    {/* Bildbezeichnung ganz unten im Bild */}
                    <p style={imageCaptionStyle}>
                        {IMAGES[currentIndex].title}
                    </p>

                    <button onClick={nextImage} style={{ ...navButtonStyle, right: '10px' }}>▶</button>
                </div>




                {/* Vorschaubilder (Thumbnails) */}
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
                       <img  className="section-img" src={PC}></img>
                       <h2 className="section-title">Progettazione
                       </h2>
                   </div>

                <div className="grey-section">
                    <img  className="section-img" src={Schleifbild}></img>
                    <h2 className="section-title">Costruzione</h2>
                </div>


                <div className="orange-section">
                    <img  className="section-img" src={Bauplan}></img>
                    <h2 className="section-title">Montaggio
                    </h2>
                </div>

                <div className="grey-section">
                    <img  className="section-img" src={Zangen}></img>
                    <h2 className="section-title">Assistenza
                    </h2>
                </div>

            </div>

            <div className="orange-div">
                <h2 className="text-red">I NOSTRI PUNTI DI FORZA
                </h2>
                <img  className="diplom-img" src={Diplom}></img>
                <p><b>Personale qualificato</b></p>


                <img  className="person-img" src={Person}></img>
                <p><b>Tantissimi clienti soddisfatti
                </b></p>

                <img className="werkstatt-img" src={Werkstattbild}/><img/>
                <p><b>Officina ultra attrezzata</b></p>
            </div>


            <div className="white-div">
                <h2 className="text-white">I NOSTRI PUNTI DI LAVORI</h2>
            </div>



            <div className="orange-div">
                <h2 className="text-white"> </h2>
                <img  className="wirtschaft-img" src={Kreislauf}></img>


            {/* Die 4 Statistik-Blöcke nebeneinander */}
            <div className="banner-stats">
                <div className="stat-item">
                    <span className="stat-number">+286</span>
                    <span className="stat-text">Progetti<br />realizzati</span>
                </div>

                <div className="stat-item">
                    <span className="stat-number">286</span>
                    <span className="stat-text">Clienti<br />soddisfatti</span>
                </div>

                <div className="stat-item">
                    <span className="stat-number">8</span>
                    <span className="stat-text">Progetti<br />attivi</span>
                </div>

                <div className="stat-item">
                    <span className="stat-number">6</span>
                    <span className="stat-text">Progetti<br />in attesa</span>
                </div>

            </div>

            </div>





        </>
    );
}

export default Home;