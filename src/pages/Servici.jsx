import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

// Asset Imports
import Schleifbild from '../assets/Schleifen.jpg';
import Wand from '../assets/Wand.jfif';
import Fenster from '../assets/Fenster.jfif';
import Gitter from '../assets/Gitter.jfif';
import Bauplan from '../assets/Bauplan.jfif';
import Eingang from '../assets/Eingang.jfif';
import PC from '../assets/PC.jpg';
import Briefkasten from '../assets/Briefkasten.png';
import Schraubenzieherbild from '../assets/Schraubenzieher.jfif';
import Locarno from '../assets/Locarno.jfif';
import Gitter3 from '../assets/Gitter3.jpg';
import Gitter7 from '../assets/Gitter7.jpg';

import Holztreppe  from '../assets/Holztreppe.jpg';
import Steingarten from '../assets/Steingarten.jfif';
import Stock from '../assets/Stock.jpg';
import Pflanzen from '../assets/Pflanzen.jpg';
import Steinhaus from '../assets/Steinhaus.jfif';
import Dachterasse  from '../assets/Dachterasse.jpg';
import Gitter2 from '../assets/Gitter2.jfif';
import Weiss from '../assets/Weiss.png';
import Gitter4 from '../assets/Gitter4.jpg';
import Gitter5 from '../assets/Gitter5.jpg';
import Gitter6 from '../assets/Gitter6.jpg';
import Innenhof from '../assets/Innenhof.jpg';

import '../Styles/Servici.css';
import '../Styles/TimeLineSection.css';

const IMAGES = [
    { id: 1, url: Schleifbild, title: 'Schleifarbeiten', description: 'Lavorazione e finitura di alta precisione.' },
    { id: 2, url: Bauplan, title: 'Werkstatt', description: 'Progettazione e produzione artigianale.' },
    { id: 3, url: PC, title: 'PC & Design', description: 'Pianificazione CAD e modellazione 3D.' },
    { id: 4, url: Schraubenzieherbild, title: 'Schraubenzieher', description: 'Strumenti di precisione.' }
];

const SERVICE_CARDS = [
    {
        id: 'cancellate-giardino',
        titleLocarno: 'Cancellate per giardino a Locarno',
        titleAvegno: 'Cancellate per giardino ad Avegno',
        slugLocarno: 'cancellate-per-giardino-a-locarno',
        slugAvegno: 'cancellate-per-giardino-ad-avegno',
        image: Gitter,
        textLocarno: 'Proteggi la tua casa e il tuo giardino con stile installando le cancellate per giardino. Potrai limitare l’accesso degli estranei e tenere al sicuro la tua famiglia e i tuoi animali domestici.',
        textAvegno: 'Proteggi la tua casa e il tuo giardino con stile installando le cancellate per giardino ad Avegno. Potrai limitare l’accesso degli estranei e tenere al sicuro la tua famiglia e i tuoi animali domestici.'
    },
    {
        id: 'cancellate-ferro',
        titleLocarno: 'Cancellate in ferro a Locarno',
        titleAvegno: 'Cancellate in ferro ad Avegno',
        slugLocarno: 'cancellate-in-ferro-a-locarno',
        slugAvegno: 'cancellate-in-ferro-ad-avegno',
        image: Fenster,
        textLocarno: 'Le migliori soluzioni per le tue cancellate in ferro sono quelle che uniscono funzionalità e design. Scegli una soluzione personalizzata, creata su misura per la tua proprietà.',
        textAvegno: 'Le migliori soluzioni per le tue cancellate in ferro ad Avegno sono quelle che uniscono funzionalità e design. Scegli una soluzione personalizzata, creata su misura per la tua proprietà.'
    },
    {
        id: 'ringhiere',
        titleLocarno: 'Ringhiere a Locarno',
        titleAvegno: 'Ringhiere ad Avegno',
        slugLocarno: 'ringhiere-a-locarno',
        slugAvegno: 'ringhiere-ad-avegno',
        image: Wand,
        textLocarno: 'Le ringhiere sono sistemi di protezione che si trovano nella maggioranza degli edifici. Oltre ad essere componenti importanti per la sicurezza, le ringhiere diventano parte integrante dell’architettura.',
        textAvegno: 'Le ringhiere sono sistemi di protezione che si trovano nella maggioranza degli edifici. Oltre ad essere componenti importanti per la sicurezza, le ringhiere diventano parte integrante dell’architettura.'
    },
    {
        id: 'parapetti',
        titleLocarno: 'Parapetti a Locarno',
        titleAvegno: 'Parapetti ad Avegno',
        slugLocarno: 'parapetti-a-locarno',
        slugAvegno: 'parapetti-ad-avegno',
        image: Locarno,
        textLocarno: 'I parapetti sono componenti architettonici essenziali che conferiscono un tocco di stile agli edifici, definiscono gli spazi e creano un’estetica piacevole.',
        textAvegno: 'I parapetti sono componenti architettonici essenziali che conferiscono un tocco di stile agli edifici, definiscono gli spazi e creano un’estetica piacevole.'
    }
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

const sliderArrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    zIndex: 5,
    borderRadius: '4px'
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
    textAlign: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white',
    zIndex: 5,
    pointerEvents: 'none'
};

const cardImageStyle = {
    width: '50%',
    height: '220px',
    objectFit: 'cover',
    display: 'block'
};

const redButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#e62b2b',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '15px'
};

function Servizi() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [indexParapetti, setIndexParapetti] = useState(0);
    const [indexCancelli, setIndexCancelli] = useState(0);

    // State für den Suchfilter
    const [searchTerm, setSearchTerm] = useState("");

    // States für die beiden unteren Slider getrennt steuerbar
    const [sliderIndex1, setSliderIndex1] = useState(0);
    const [sliderIndex2, setSliderIndex2] = useState(0);

    const navigate = useNavigate();

    const imagesParapetti = [Gitter, Wand];
    const imagesCancelli = [Fenster, Eingang];

    // Gefilterte Bilder basierend auf dem Suchbegriff im Titel/Beschreibung
    const filteredImages = IMAGES.filter(img =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
    };

    if (!isOpen) return null;

    const handleClick = () => {
        window.location.href = 'https://titocci.ch/a/locarno/cancellate-per-giardino-a-locarno/';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.href = 'https://it.wikipedia.org/wiki/Arte';
    };

    return (
        <div className="rot">
            {/* Hero Slider Section */}
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
                <div style={{position: 'relative', width: '100%'}}>

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

                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '35px',
                            margin: 0,
                            padding: 0
                        }}>
                            <li><Link to="/" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', borderBottom: '3px solid #e62b2b', paddingBottom: '4px', fontSize: '14px'}}>Servizi</Link></li>
                            <li><Link to="/galeria" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>Galleria</Link></li>
                            <li><Link to="/aboutus" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}></Link></li>
                            <li><Link to="/kontakte" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>Contatti</Link></li>

                        </ul>
                    </nav>

                    <button onClick={prevImage} style={{...navButtonStyle, left: '25px'}}>◀</button>

                    <img
                        src={IMAGES[currentIndex].url}
                        alt={IMAGES[currentIndex].title}
                        style={{
                            width: '100vw',
                            height: '550px',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'brightness(0.65)'
                        }}
                    />

                    <div style={heroOverlayStyle}>
                        <h1 style={{
                            color: '#e62b2b',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            margin: '0 0 15px 0',
                            zIndex: 10,
                            textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
                        }}>
                            Servizi<br/>
                            Fabbro artigiano
                        </h1>
                    </div>

                    <p style={imageCaptionStyle}>
                        {IMAGES[currentIndex].title}
                    </p>

                    <button onClick={nextImage} style={{...navButtonStyle, right: '25px'}}>▶</button>
                </div>
            </div>

            {/* --- BILDER-FILTER / SUCHLEISTE --- */}
            <div style={{ maxWidth: '800px', margin: '40px auto 20px auto', padding: '0 20px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3 style={{ color: '#e62b2b', marginBottom: '15px' }}>Filtra immagini</h3>
                    <input
                        type="text"
                        placeholder="Cerca per titolo o descrizione (es. Schleifarbeiten, Werkstatt...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 15px',
                            fontSize: '1rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Anzeige der gefilterten Bilder */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                    {filteredImages.length > 0 ? (
                        filteredImages.map((img) => (
                            <div key={img.id} style={{ width: '220px', background: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <img src={img.url} alt={img.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                <div style={{ padding: '10px', textAlign: 'left' }}>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1rem' }}>{img.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{img.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Nessuna immagine trovata.</p>
                    )}
                </div>
            </div>

            {/* --- KATEGORIEN-SLIDER SECTION (PARAPETTI & CANCELLI) --- */}
            <div style={{
                maxWidth: '1100px',
                margin: '50px auto 40px auto',
                padding: '0 20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px'}}>

                    {/* KARTE 1: Parapetti e ringhiere */}
                    <div style={{flex: '1 1 450px', maxWidth: '500px', textAlign: 'center'}}>
                        <h3 style={{color: '#4a5568', fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600'}}>
                            Parapetti e ringhiere
                        </h3>

                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            gap: '10px',
                            overflow: 'hidden',
                            borderRadius: '4px'
                        }}>
                            <button
                                onClick={() => setIndexParapetti((prev) => (prev > 0 ? prev - 1 : imagesParapetti.length - 1))}
                                style={{...sliderArrowStyle, left: '10px', zIndex: 10}}
                            >
                                ‹
                            </button>

                            <img src={imagesParapetti[indexParapetti]} alt="Parapetti 1" style={{...cardImageStyle, width: 'calc(50% - 5px)', flex: 1}}/>
                            <img src={imagesParapetti[(indexParapetti + 1) % imagesParapetti.length]} alt="Parapetti 2"
                                 style={{...cardImageStyle, width: 'calc(50% - 5px)', flex: 1}}/>

                            <button
                                onClick={() => setIndexParapetti((prev) => (prev + 1) % imagesParapetti.length)}
                                style={{...sliderArrowStyle, right: '10px', zIndex: 10}}
                            >
                                ›
                            </button>
                        </div>

                        <a href="https://titocci.ch/parapetti-e-ringhiere/" style={redButtonStyle}>
                            Scopri di più
                        </a>
                    </div>

                    {/* KARTE 2: Cancellate in ferro e Cancelli per giardino */}
                    <div style={{flex: '1 1 450px', maxWidth: '500px', textAlign: 'center'}}>
                        <h3 style={{marginBottom: '20px'}}>
                            <button
                                onClick={handleClick}
                                style={{
                                    color: '#4a5568',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                Cancellate in ferro e Cancelli per giardino
                            </button>
                        </h3>

                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            gap: '10px',
                            overflow: 'hidden',
                            borderRadius: '4px'
                        }}>
                            <button
                                onClick={() => setIndexCancelli((prev) => (prev > 0 ? prev - 1 : imagesCancelli.length - 1))}
                                style={{...sliderArrowStyle, left: '10px', zIndex: 10}}
                            >
                                ‹
                            </button>

                            <img src={imagesCancelli[indexCancelli]} alt="Cancelli 1" style={{...cardImageStyle, width: 'calc(50% - 5px)', flex: 1}}/>
                            <img src={imagesCancelli[(indexCancelli + 1) % imagesCancelli.length]} alt="Cancelli 2"
                                 style={{...cardImageStyle, width: 'calc(50% - 5px)', flex: 1}}/>

                            <button
                                onClick={() => setIndexCancelli((prev) => (prev + 1) % imagesCancelli.length)}
                                style={{...sliderArrowStyle, right: '10px', zIndex: 10}}
                            >
                                ›
                            </button>
                        </div>

                        <a href="https://titocci.ch/cancellate-in-ferro-e-cancelli-per-giardino/" style={redButtonStyle}>
                            Scopri di più
                        </a>
                    </div>

                </div>
            </div>

            {/* --- LOCARNO & AVEGNO SERVICE CARDS GRID --- */}
            <div style={{
                maxWidth: '1000px',
                margin: '60px auto',
                padding: '0 20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    justifyContent: 'center'
                }}>
                    {SERVICE_CARDS.map((section) => {
                        const linkLocarno = `https://titocci.ch/a/locarno/${section.slugLocarno}/`;
                        const linkAvegno = `https://titocci.ch/a/avegno/${section.slugAvegno}/`;

                        return (
                            <React.Fragment key={section.id}>
                                {/* Locarno Karte */}
                                <div style={{
                                    flex: '1 1 420px',
                                    maxWidth: '460px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{height: '240px', width: '100%', overflow: 'hidden'}}>
                                        <a href={linkLocarno} style={{ display: 'block', height: '100%' }}>
                                            <img
                                                src={section.image}
                                                alt={section.titleLocarno}
                                                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                                            />
                                        </a>
                                    </div>
                                    <div style={{
                                        padding: '25px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1
                                    }}>
                                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                                            <a
                                                href={linkLocarno}
                                                style={{
                                                    color: '#f59e0b',
                                                    fontSize: '1.35rem',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {section.titleLocarno}
                                            </a>
                                        </h3>
                                        <p style={{ margin: 0 }}>
                                            <a
                                                href={linkLocarno}
                                                style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.92rem',
                                                    lineHeight: '1.5',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {section.textLocarno}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                {/* Avegno Karte */}
                                <div style={{
                                    flex: '1 1 420px',
                                    maxWidth: '460px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{height: '240px', width: '100%', overflow: 'hidden'}}>
                                        <a href={linkAvegno} style={{ display: 'block', height: '100%' }}>
                                            <img
                                                src={section.image}
                                                alt={section.titleAvegno}
                                                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                                            />
                                        </a>
                                    </div>
                                    <div style={{
                                        padding: '25px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1
                                    }}>
                                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                                            <a
                                                href={linkAvegno}
                                                style={{
                                                    color: '#f59e0b',
                                                    fontSize: '1.35rem',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {section.titleAvegno}
                                            </a>
                                        </h3>
                                        <p style={{ margin: 0 }}>
                                            <a
                                                href={linkAvegno}
                                                style={{
                                                    color: '#6b7280',
                                                    fontSize: '0.92rem',
                                                    lineHeight: '1.5',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {section.textAvegno}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* --- TEXTSEKTION AM ENDE --- */}
            <section style={{maxWidth: '900px', margin: '60px auto', padding: '0 20px', textAlign: 'center'}}>
                <h2 style={{fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b'}}>
                    <b>Fabbro artigiano: mestiere e arte</b>
                    <div className="yellow-divider"></div>
                </h2>
                <p style={{lineHeight: '1.6', fontSize: '1.05rem', color: '#333', marginBottom: '40px'}}>
                    Un <b>fabbro artigiano</b> è una figura professionale che ha le sue radici nei secoli passati,
                    risudando i ferri caldi nella lavorazione dei metalli ma fondamentale per la sopravvivenza della
                    comunità. Questo mestiere affascinante e versatile, ancora oggi di grande importanza, combina
                    abilità artigianali con l'innovazione tecnologica per creare elementi unici, funzionali e altamente
                    personalizzati.
                </p>

                <h2 style={{fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b'}}>
                    Il mestiere del fabbro artigiano
                </h2>
                <p style={{lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '40px', color: '#333'}}>
                    Il fabbro artigiano è un esperto specializzato nella lavorazione dei metalli. Attraverso l’uso di
                    varie tecniche come la forgia, la saldatura e la cesellatura, il fabbro trasforma il metallo grezzo
                    in oggetti funzionali ma allo stesso tempo estetici, che danno un valore aggiunto alla proprietà.
                    Questo mestiere richiede un’eccezionale abilità manuale, creatività e una profonda comprensione dei
                    materiali. Che si tratti di cancelli, ringhiere, pergolati, lampioni, scale o qualsiasi altro
                    elemento, il fabbro dà vita al metallo, plasmando la materia con maestria.
                </p>

                <section style={{maxWidth: '900px', margin: '60px auto', padding: '0 20px', textAlign: 'center'}}>
                    <h2 style={{fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b'}}>
                        Il fabbro: un’arte
                    </h2>
                    <p style={{lineHeight: '1.6', fontSize: '1.05rem', color: '#333', marginBottom: '40px'}}>
                        La Titocci Metalcostruzioni <b>si distingue </b> per i <b>suoi servizi realizzati ad </b><span onClick={handleSubmit} style={{color:'red', cursor: 'pointer'}}>arte</span> è una figura professionale che ha le sue radici nei secoli passati...
                    </p>
                </section>

                <h2 style={{fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b'}}>
                    I tipi di metallo
                </h2>
                <p style={{lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '30px', color: '#333'}}>
                    I diversi tipi di metallo utilizzati dai fabbri artigiani dipendono dalla lega e dalla destinazione d’uso.
                </p>

                {/* 3 Spalten für Metall-Typen */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'nowrap',
                    marginBottom: '50px',
                    textAlign: 'left',
                    justifyContent:'space-evenly'
                }}>
                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’acciaio al carbonio</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’acciaio al carbonio è comunemente utilizzato dai fabbri perché forte e resistente.</p>
                    </div>

                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’acciaio inossidabile</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’acciaio inossidabile (o acciaio inox) è una lega a base di ferro, carbonio e altri elementi...</p>
                    </div>

                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’alluminio</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’alluminio è un metallo più leggero dell’acciaio ma durevole e resistente alla corrosione.</p>
                    </div>
                </div>

                <h2 style={{fontSize: '1.8rem', marginBottom: '30px', color: '#f59e0b'}}>
                    Lavorazione di svariati tipi di metalli
                </h2>

                {/* 3 Bilder */}
                <div className="metal-images-container" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'nowrap', marginBottom: '60px' }}>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Gitter2} alt="Gitter Eingang haus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Weiss} alt="Weisses Auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Briefkasten} alt="Briefkasten" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Servizi;