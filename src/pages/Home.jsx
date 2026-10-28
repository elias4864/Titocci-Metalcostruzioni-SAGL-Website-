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
import Git from '../assets/Git.png';
import Bauplan from '../assets/Bauplan.jfif';
import Diplom from '../assets/Diplom.jfif';
import Person from '../assets/Person.jfif';
import Werkstattbild from '../assets/Werkstatt.jfif';
import Redfacebook from "../assets/Redfacebook.jfif";
import Kreislauf from '../assets/Statistiken.jfif';
import Google from '../assets/Google.png';
import RedGoogleMaps from '../assets/RedGoogleMaps.jfif';
import Verifizierung from '../assets/Verifizierung.gif';
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
    backgroundColor: '#e62b2b',
    color: 'white',
    border: 'none',
    padding: '16px 28px',
    minWidth: '60px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
    zIndex: 10
};

const imageCaptionStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: 'white',
    padding: '10px 0',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    zIndex: 2
};

const heroOverlayStyle = {
    position: 'absolute',
    top: '50%',
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    };


    return (
        <>


            {/* Hero Slider Container über die volle Displaybreite */}
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

                    {/* Navbar über die volle Breite */}
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
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px' }}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                            <li><Link to="/aboutus" style={{color:'white',textDecoration:'none',fontWeight:'bold'}}>About Us</Link></li>
                            <li><Link to="/galeria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                            <li><Link to="/kontakte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Contatti</Link></li>
                        </ul>
                    </nav>

                    <button onClick={prevImage} style={{ ...navButtonStyle, left: '25px' }}>◀</button>

                    <img
                        src={IMAGES[currentIndex].url}
                        alt={IMAGES[currentIndex].title}
                        style={{
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'brightness(0.65)'
                        }}
                    />

                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '4.5rem',
                            fontWeight: 'bold',
                            margin: '0 0 5px 0',
                            textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
                        }}>
                            Progettazione
                        </h1>

                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: '0 0 22px 0',
                            color: '#ffffff',
                            textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                        }}>
                            <br></br>
                            Preventivi e <span style={{ color: '#e62b2b' }}>consulenze</span>
                        </h2>

                        <Link to="/contatti" style={{
                            display: 'inline-block',
                            backgroundColor: '#e62b2b',
                            color: 'white',
                            padding: '12px 28px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            pointerEvents: 'auto',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
                            margin: '0 auto'
                        }}>
                            Contattaci
                        </Link>
                    </div>

                    <p style={imageCaptionStyle}>
                        {IMAGES[currentIndex].title}
                    </p>

                    <button onClick={nextImage} style={{ ...navButtonStyle, right: '25px' }}>▶</button>
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
                <h2 className="orange-title">I NOSTRI PUNTI DI FORZA</h2>
                <div className="features-container">
                    <div className="feature-item">
                        <img className="person-img" src={Diplom} alt="Diplom" />
                        <p className="text-black"><b>Personale qualificato</b></p>
                    </div>

                    <div className="feature-item">
                        <img className="person-img" src={Person} alt="Person" />
                        <p className="text-black"><b>Tantissimi clienti soddisfatti</b></p>
                    </div>

                    <div className="feature-item">
                        <img className="person-img" src={Werkstattbild} alt="Werkstatt" />
                        <p className="text-black"><b>Officina ultra attrezzata</b></p>
                    </div>
                </div>
            </div>

            <div className="white-div">
                <h2 className="yellow-title">I NOSTRI PUNTI DI LAVORI</h2>
            </div>

            <div className="orange-div">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', width: '100%', flexWrap: 'wrap' }}>
                <img className="wirtschaft-img" src={Git} alt="Kreislauf" />

                <div className="banner-stats">
                    <StatCard value={286} suffix="+" label="Progetti realizzati" />
                    <StatCard value={286} label="Clienti soddisfatti" />
                    <StatCard value={8} label="Progetti attivi" />
                    <StatCard value={6} label="Progetti in attesa" />
                </div>
            </div>
            </div>

        </>
    );
}

export default Home;