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
import Locarno from '../assets/Locarno.jfif';
import Gitter2 from '../assets/Gitter2.jfif';
import Weiss from '../assets/Weiss.png';

import Icon from "../assets/Icon.jpg";

import '../Styles/Servici.css';
import '../Styles/TimeLineSection.css';

const IMAGES = [
    { id: 1, url: Schleifbild, title: 'Schleifarbeiten', description: 'Lavorazione e finitura di alta precisione.' },
    { id: 2, url: Bauplan, title: 'Werkstatt', description: 'Progettazione e produzione artigianale.' },
    { id: 3, url: PC, title: 'PC & Design', description: 'Pianificazione CAD e modellazione 3D.' },
];

const SERVICE_CARDS = [
    {
        id: 'cancellate-giardino',
        titleLocarno: 'Cancellate per giardino a Locarno',
        titleAvegno: 'Cancellate per giardino ad Avegno',
        image: Gitter,
        textLocarno: 'Proteggi la tua casa e il tuo giardino con stile installando le cancellate per giardino. Potrai limitare l’accesso degli estranei e tenere al sicuro la tua famiglia e i tuoi animali domestici.',
        textAvegno: 'Proteggi la tua casa e il tuo giardino con stile installando le cancellate per giardino ad Avegno. Potrai limitare l’accesso degli estranei e tenere al sicuro la tua famiglia e i tuoi animali domestici.'
    },
    {
        id: 'cancellate-ferro',
        titleLocarno: 'Cancellate in ferro a Locarno',
        titleAvegno: 'Cancellate in ferro ad Avegno',
        image: Fenster,
        textLocarno: 'Le migliori soluzioni per le tue cancellate in ferro sono quelle che uniscono funzionalità e design. Scegli una soluzione personalizzata, creata su misura per la tua proprietà.',
        textAvegno: 'Le migliori soluzioni per le tue cancellate in ferro ad Avegno sono quelle che uniscono funzionalità e design. Scegli una soluzione personalizzata, creata su misura per la tua proprietà.'
    },
    {
        id: 'ringhiere',
        titleLocarno: 'Ringhiere a Locarno',
        titleAvegno: 'Ringhiere ad Avegno',
        image: Wand,
        textLocarno: 'Le ringhiere sono sistemi di protezione che si trovano nella maggioranza degli edifici. Oltre ad essere componenti importanti per la sicurezza, le ringhiere diventano parte integrante dell’architettura.',
        textAvegno: 'Le ringhiere sono sistemi di protezione che si trovano nella maggioranza degli edifici. Oltre ad essere componenti importanti per la sicurezza, le ringhiere diventano parte integrante dell’architettura.'
    },
    {
        id: 'parapetti',
        titleLocarno: 'Parapetti a Locarno',
        titleAvegno: 'Parapetti ad Avegno',
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

function Servizi() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [indexParapetti, setIndexParapetti] = useState(0);
    const [indexCancelli, setIndexCancelli] = useState(0);

    // States für die beiden unteren Slider getrennt steuerbar
    const [sliderIndex1, setSliderIndex1] = useState(0);
    const [sliderIndex2, setSliderIndex2] = useState(0);

    const navigate = useNavigate();

    const imagesParapetti = [Gitter, Wand];
    const imagesCancelli = [Fenster, Eingang];

    // Bilder-Arrays für die beiden unteren Slider
    const bottomImages1 = [Wand, Fenster, Gitter2];
    const bottomImages2 = [Briefkasten, Locarno, Weiss];

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

    const handleClick = () => {
        window.location.href = 'https://titocci.ch/a/locarno/cancellate-per-giardino-a-locarno/';
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
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={Icon} alt="Logo"
                                 style={{width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px'}}/>
                        </div>

                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '35px',
                            margin: 0,
                            padding: 0
                        }}>
                            <li><Link to="/" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>Home</Link></li>
                            <li><Link to="/chi-siamo" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>Chi siamo</Link></li>
                            <li><Link to="/servizi" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                borderBottom: '3px solid #e62b2b',
                                paddingBottom: '4px',
                                fontSize: '14px'
                            }}>Servizi</Link></li>
                            <li><Link to="/galleria" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>Galleria</Link></li>
                            <li><Link to="/contatti" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>Contatti</Link></li>
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

            {/* --- KATEGORIEN-SLIDER SECTION (PARAPETTI & CANCELLI) --- */}
            <div style={{
                maxWidth: '1100px',
                margin: '50px auto 40px auto',
                padding: '0 20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap'}}>

                    {/* KARTE 1: Parapetti e ringhiere */}
                    <div style={{flex: '1 1 450px', maxWidth: '500px', textAlign: 'center'}}>
                        <h3 style={{color: '#4a5568', fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600'}}>
                            Parapetti e ringhiere
                        </h3>

                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            gap: '5px',
                            overflow: 'hidden',
                            borderRadius: '2px'
                        }}>
                            <button
                                onClick={() => setIndexParapetti((prev) => (prev > 0 ? prev - 1 : imagesParapetti.length - 1))}
                                style={arrowButtonStyle('left')}
                            >
                                ‹
                            </button>

                            <img src={imagesParapetti[indexParapetti]} alt="Parapetti 1" style={cardImageStyle}/>
                            <img src={imagesParapetti[(indexParapetti + 1) % imagesParapetti.length]} alt="Parapetti 2"
                                 style={cardImageStyle}/>

                            <button
                                onClick={() => setIndexParapetti((prev) => (prev + 1) % imagesParapetti.length)}
                                style={arrowButtonStyle('right')}
                            >
                                ›
                            </button>
                        </div>

                        {/* Indikator Punkte */}
                        <div style={{display: 'flex', justifyContent: 'center', gap: '6px', margin: '15px 0 20px 0'}}>
                            {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: i === indexParapetti ? '#000' : '#ccc',
                                        display: 'inline-block'
                                    }}
                                />
                            ))}
                        </div>

                        <Link to="/galleria" style={redButtonStyle}>
                            Scopri di più
                        </Link>
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
                            gap: '5px',
                            overflow: 'hidden',
                            borderRadius: '2px'
                        }}>
                            <button
                                onClick={() => setIndexCancelli((prev) => (prev > 0 ? prev - 1 : imagesCancelli.length - 1))}
                                style={arrowButtonStyle('left')}
                            >
                                ‹
                            </button>

                            <img src={imagesCancelli[indexCancelli]} alt="Cancelli 1" style={cardImageStyle}/>
                            <img src={imagesCancelli[(indexCancelli + 1) % imagesCancelli.length]} alt="Cancelli 2"
                                 style={cardImageStyle}/>

                            <button
                                onClick={() => setIndexCancelli((prev) => (prev + 1) % imagesCancelli.length)}
                                style={arrowButtonStyle('right')}
                            >
                                ›
                            </button>
                        </div>

                        {/* Indikator Punkte */}
                        <div style={{display: 'flex', justifyContent: 'center', gap: '6px', margin: '15px 0 20px 0'}}>
                            {[0, 1, 2, 3].map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: i === indexCancelli ? '#000' : '#ccc',
                                        display: 'inline-block'
                                    }}
                                />
                            ))}
                        </div>

                        <Link to="/galleria" style={redButtonStyle}>
                            Scopri di più
                        </Link>
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
                    {SERVICE_CARDS.map((section) => (
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
                                    <img
                                        src={section.image}
                                        alt={section.titleLocarno}
                                        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                                    />
                                </div>
                                <div style={{
                                    padding: '25px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1
                                }}>
                                    <h3 style={{
                                        color: '#f59e0b',
                                        fontSize: '1.35rem',
                                        fontWeight: 'bold',
                                        marginTop: 0,
                                        marginBottom: '15px'
                                    }}>
                                        {section.titleLocarno}
                                    </h3>
                                    <p style={{color: '#6b7280', fontSize: '0.92rem', lineHeight: '1.5', margin: 0}}>
                                        {section.textLocarno}
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
                                    <img
                                        src={section.image}
                                        alt={section.titleAvegno}
                                        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                                    />
                                </div>
                                <div style={{
                                    padding: '25px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1
                                }}>
                                    <h3 style={{
                                        color: '#f59e0b',
                                        fontSize: '1.35rem',
                                        fontWeight: 'bold',
                                        marginTop: 0,
                                        marginBottom: '15px'
                                    }}>
                                        {section.titleAvegno}
                                    </h3>
                                    <p style={{color: '#6b7280', fontSize: '0.92rem', lineHeight: '1.5', margin: 0}}>
                                        {section.textAvegno}
                                    </p>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* --- TEXTSEKTION AM ENDE --- */}
            <section style={{maxWidth: '900px', margin: '60px auto', padding: '0 20px', textAlign: 'center'}}>
                <h1 className="yellow-text"
                    style={{fontSize: '2rem', marginBottom: '20px', color: '#f59e0b', fontWeight: 'bold'}}>
                    Fabbro artigiano: mestiere e arte
                </h1>
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

                <h2 style={{fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b'}}>
                    I tipi di metallo
                </h2>
                <p style={{lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '30px', color: '#333'}}>
                    I diversi tipi di metallo utilizzati dai fabbri artigiani dipendono dalla lega e dalla destinazione
                    d’uso.
                </p>

                {/* 3 Spalten für Metall-Typen */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '50px',
                    textAlign: 'left'
                }}>
                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’acciaio al
                            carbonio</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’acciaio al
                            carbonio è comunemente utilizzato dai fabbri perché forte e resistente.</p>
                    </div>
                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’acciaio
                            inossidabile</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’acciaio
                            inossidabile (o acciaio inox) è una lega a base di ferro, carbonio e altri elementi, tra cui
                            cromo, nichel, titanio, ecc. È proprio la presenza di questi elementi che rende questo tipo
                            di acciaio molto resistente alla corrosione.</p>
                    </div>
                    <div style={{
                        flex: '1 1 250px',
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{color: '#f59e0b', fontSize: '1.2rem', marginBottom: '10px'}}>L’alluminio</h3>
                        <p style={{fontSize: '0.95rem', color: '#666', lineHeight: '1.5', margin: 0}}>L’alluminio è un
                            metallo più leggero dell’acciaio ma durevole e resistente alla corrosione. È
                            riciclabile.</p>
                    </div>
                </div>

                <h2 style={{fontSize: '1.8rem', marginBottom: '30px', color: '#f59e0b'}}>
                    Lavorazione di svariati tipi di metalli
                </h2>

                {/* 3 Bilder mit mehr Abstand (.metal-images-container) */}
                <div className="metal-images-container" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '60px' }}>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Gitter} alt="Metalli 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Wand} alt="Metalli 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="img-container" style={{ width: '300px', height: '210px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <img src={Weiss} alt="Metalli 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* --- UNTERER BILDER-SLIDER MIT VOLLSTÄNDIGEN STEUERUNGSPFEILEN --- */}
                <div style={{maxWidth: '1000px', margin: '0 auto 40px auto', position: 'relative'}}>
                    <div style={{display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap'}}>

                        {/* Slider 1 */}
                        <div style={{flex: '1 1 450px', textAlign: 'center'}}>
                            <p style={{
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '15px',
                                minHeight: '40px'
                            }}>
                                Costruzione e montaggio di ringhiere di ogni tipo, scale, serramenti, cancelli manuali o automatizzati, porte garage, bucalettere, recinzioni, ecc ....
                            </p>
                            <div style={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <button
                                    onClick={() => setSliderIndex1((prev) => (prev > 0 ? prev - 1 : bottomImages1.length - 1))}
                                    style={arrowButtonStyle('left')}
                                >
                                    ‹
                                </button>

                                <img src={bottomImages1[sliderIndex1]} alt="Slider 1"
                                     style={{width: '100%', height: '260px', objectFit: 'cover', display: 'block'}}/>

                                <button
                                    onClick={() => setSliderIndex1((prev) => (prev + 1) % bottomImages1.length)}
                                    style={arrowButtonStyle('right')}
                                >
                                    ›
                                </button>
                            </div>

                            {/* Indikator Punkte Slider 1 */}
                            <div style={{display: 'flex', justifyContent: 'center', gap: '6px', margin: '12px 0 0 0'}}>
                                {bottomImages1.map((_, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: i === sliderIndex1 ? '#000' : '#ccc',
                                            display: 'inline-block'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Slider 2 */}
                        <div style={{flex: '1 1 450px', textAlign: 'center'}}>
                            <p style={{
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '15px',
                                minHeight: '40px'
                            }}>
                                Eseguiamo anche riparazioni, semplice lavorazione lamiere, taglio, piegatura, saldatura di acciaio Inox e alluminio, verniciatura semplice, ecc .....
                            </p>
                            <div style={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <button
                                    onClick={() => setSliderIndex2((prev) => (prev > 0 ? prev - 1 : bottomImages2.length - 1))}
                                    style={arrowButtonStyle('left')}
                                >
                                    ‹
                                </button>

                                <img src={bottomImages2[sliderIndex2]} alt="Slider 2"
                                     style={{width: '100%', height: '260px', objectFit: 'cover', display: 'block'}}/>

                                <button
                                    onClick={() => setSliderIndex2((prev) => (prev + 1) % bottomImages2.length)}
                                    style={arrowButtonStyle('right')}
                                >
                                    ›
                                </button>
                            </div>

                            {/* Indikator Punkte Slider 2 */}
                            <div style={{display: 'flex', justifyContent: 'center', gap: '6px', margin: '12px 0 0 0'}}>
                                {bottomImages2.map((_, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: i === sliderIndex2 ? '#000' : '#ccc',
                                            display: 'inline-block'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Link zu Contatti am Ende */}
                <p style={{fontSize: '1rem', color: '#555', marginTop: '50px'}}>
                    Visitate la nostra pagina dei <Link to="/contatti" style={{
                    color: '#e62b2b',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                }}>contatti</Link> per ottenere ulteriori informazioni
                </p>
            </section>
            <hr className="yellow-line"/>

        </div>
    );
}

// --- Hilfs-Styles ---
const cardImageStyle = {
    width: '50%',
    height: '200px',
    objectFit: 'cover',
    display: 'block'
};

const redButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#e52e2e',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.2s ease'
};

const arrowButtonStyle = (direction) => ({
    position: 'absolute',
    top: '50%',
    [direction]: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    width: '35px',
    height: '35px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease'
});

export default Servizi;