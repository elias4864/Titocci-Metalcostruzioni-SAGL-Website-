import { Link } from "react-router-dom";
import Schleifbild from "../assets/Schleifen3.jpg";
import Impressumbild from "../assets/Impressum.jpg";
import Holztreppe from "../assets/Holztreppe.jpg";
import Seitengitter from "../assets/Seitengitter.jpg";
import Gitter4 from "../assets/Gitter4.jpg";
import '../Styles/Locarno.css';
import {useNavigate} from 'react-router-dom';
import React from "react";

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

function Locarno({ lang = "de" }) {
    const translations = {
        de: {
            home: "Home",
            chiSiamo: "Über uns",
            servizi: "Leistungen",
            galeria: "Galerie",
            kontakte: "Kontakt",
            aboutUs: "Über uns",
            calculatori: "Online Preisrechner",
            title: "Locarno "
        },
        en: {
            home: "Home",
            chiSiamo: "About Us",
            servizi: "Services",
            galeria: "Gallery",
            kontakte: "Contact",
            aboutUs: "About Us",
            calculatori: "Online Calculator",
            title: "Locarno & Gallery"
        },
        it: {
            home: "Home",
            chiSiamo: "Chi siamo",
            servizi: "Servizi",
            galeria: "Galleria",
            kontakte: "Contatti",
            aboutUs: "Chi siamo",
            calculatori: "Calcolatore online",
            title: "Locarno e Galleria"
        },
        fr: {
            home: "Accueil",
            chiSiamo: "À propos",
            servizi: "Services",
            galeria: "Galerie",
            kontakte: "Contact",
            aboutUs: "À propos",
            calculatori: "Calculateur en ligne",
            title: "Locarno & Galerie"
        }
    };

    const t = translations[lang] || translations.de;



    const handleSubmit1=(e)=>{
        e.preventDefault();
        window.location.href='https://titocci.ch/a/locarno/parapetti-a-locarno/';

    }

    const handleSubmit2=(e)=>{
        e.preventDefault();
        window.location.href='https://titocci.ch/a/locarno/ringhiere-a-locarno/';

    }

    const handleSubmit3=(e)=>{
        e.preventDefault();
        window.location.href='https://titocci.ch/a/locarno/cancellate-in-ferro-a-locarno/';

    }

    const handleSubmit4=(e)=>{
        e.preventDefault();
        window.location.href='https://titocci.ch/a/locarno/cancellate-per-giardino-a-locarno/';

    }








    return (
        <div className="rot">
            {/* Hero Banner Section */}
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
                            <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.home}</Link></li>
                            <li><Link to="/chi-siamo" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.chiSiamo}</Link></li>
                            <li><Link to="/servizi" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.servizi}</Link></li>
                            <li><Link to="/galeria" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px', fontSize: '14px' }}>{t.galeria}</Link></li>
                            <li><Link to="/kontakte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.kontakte}</Link></li>
                            <li><Link to="/aboutus" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.aboutUs}</Link></li>
                            <li><Link to="/calculatori" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>{t.calculatori}</Link></li>
                        </ul>
                    </nav>

                    <img
                        src={Schleifbild}
                        alt="Schleifbild"
                        style={{
                            width: '100vw',
                            height: '800px',
                            objectFit: 'cover',
                            display: 'block',
                            imageRendering: '-webkit-optimize-contrast',
                            filter: 'contrast(108%) saturate(102%)',
                        }}
                    />

                    {/* Dunkler Layer */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 2
                    }} />

                    {/* Text Overlay */}
                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '4.5rem',
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
                        }}>
                            {t.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="sections">

                <div className="impressum-card">
                    <img alt="Parapetti" className="impressum-img" src={Impressumbild}/>
                    <div className="overlay-content">
                        <h1  onClick={handleSubmit1} className="impressum-title">Parapetti a Locarno</h1>
                        <p  onClick={handleSubmit1} className="impressum-text">I parapetti sono componenti architettonici essenziali che conferiscono un tocco di stile agli edifici, definiscono gli spazi e creano un'estetica piacevole ma, al tempo stesso, svolgono anche un ruolo fondamentale per la sicurezza fungendo da barriera protettiva per la prevenzione di cadute accidentali.</p>
                    </div>
                </div>

                <div className="impressum-card">
                    <img alt="Ringhiere" className="impressum-img" src={Holztreppe}/>
                    <div className="overlay-content">
                        <h1 onClick={handleSubmit2}  className="impressum-title">Ringhiere a Locarno</h1>
                        <p onClick={handleSubmit2}  className="impressum-text">Le ringhiere sono sistemi di protezione che si trovano nella maggioranza degli edifici. Oltre ad essere componenti importanti per la sicurezza, le ringhiere diventano parte integrante dell’architettura aggiungendo un tocco di stile e carattere per creare un ambiente che rifletta i tuoi gusti e la tua personalità.</p>
                    </div>
                </div>

                <div className="impressum-card">
                    <img alt="Cancellate in ferro" className="impressum-img" src={Gitter4}/>
                    <div className="overlay-content">
                        <h1 onClick={handleSubmit3} className="impressum-title">Cancellate in ferro a Locarno</h1>

                        <p  onClick={handleSubmit3} className="impressum-text">Le migliori soluzioni per le tue cancellate in ferro ad Avegno sono quelle che uniscono funzionalità e design. Scegli una soluzione personalizzata, creata su misura per la tua proprietà, una soluzione che fonde robustezza, garanzia di protezione e sicurezza, e stile. Scopri la gamma completa dei nostri servizi e lasciati ispirare dalla bellezza e dalla qualità delle nostre creazioni in ferro.</p>
                    </div>
                </div>

                <div className="impressum-card">
                    <img alt="Cancellate per giardino" className="impressum-img" src={Seitengitter}/>
                    <div className="overlay-content">
                        <h1 onClick={handleSubmit4} className="impressum-title">Cancellate per giardino a Locarno</h1>

                        <p  onClick={handleSubmit4} className="impressum-text">Proteggi la tua casa e il tuo giardino con stile installando le cancellate per giardino ad Avegno. Potrai limitare l’accesso degli estranei e tenere al sicuro la tua famiglia e i tuoi animali domestici. Esiste un’ampia varietà di tipologie e di stili di cancelli. L’artigiano realizza cancelli personalizzati e unici che si adattano allo stile del tuo giardino e che rispondono alle tue aspettative.</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Locarno;