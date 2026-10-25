import {Link} from "react-router-dom";
import React from "react";
import Impressumbild from "../assets/Impressum.jpg";
import '../Styles/Impressum.css';


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

function Impressum (){

    return (

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
                            fontSize: '14px'
                        }}>Servizi</Link></li>
                        <li><Link to="/galleria" style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            borderBottom: '3px solid #e62b2b',
                            paddingBottom: '4px',
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

                {/* Bild */}
                <img
                    src={Impressumbild}
                    alt="Galleria"
                    style={{
                        width: '100vw',
                        height: '70vh',

                        objectFit: 'cover',
                        display: 'block',
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
                }}/>

                {/* Text Overlay */}
                <div style={heroOverlayStyle}>
                    <h1 style={{
                        color: '#e62b2b',
                        fontSize: '40px',
                        fontWeight: 'bold',

                        margin: 0,
                        textShadow: '2px 2px 8px rgba(0,0,0,0.9)',

                    }}>
                        Impressum
                    </h1>
                </div>


            </div>
            <div style={{textAlign: 'center'}}>
                <h1>Titocci Metalcostruzioni Sagl</h1>

                <p className="black-text">Zona Industriale 2<br/>6670 Avegno</p>

                <h2>PERSONE AUTORIZZATE:</h2>
                <p className="black-text">Titocci Marco - Socio e Gerente</p>

                <h2>CONTATTI:</h2>
                <a href="mailto:info@titocci.ch" className="highlight-red">info@titocci.ch</a>
                <a href="tel:+41917962369" className="highlight-red">Tel. +41 91 796 23 69</a>
            </div>

            <br></br>

            <section>
                <h2 className="black-text">Esclusione di responsabilità</h2>
                <p>Il gestore del sito web non si assume alcuna responsabilità per la correttezza, accuratezza,
                    attualità, completezza o affidabilità delle informazioni pubblicate.

                    Sono escluse rivendicazioni di responsabilità nei confronti del gestore del sito web per danni
                    materiali o immateriali di qualsiasi tipo derivanti dalla visita, dall’utilizzo o dal mancato
                    utilizzo dei dati forniti, da un uso improprio della connessione Internet o da possibili errori
                    tecnici.

                    Tutte le offerte pubblicate non sono vincolanti. L’operatore del sito Web ha il diritto di
                    modificare, aggiungere o eliminare parti del sito Web o l’intero contenuto o di interrompere la
                    pubblicazione in tutto o in parte senza preavviso.</p>
                <h2 className="black-text">Responsabilità per i link</h2>
                <p>I collegamenti a siti Web di terzi, così come i riferimenti ad essi, esulano dalla responsabilità
                    dell’operatore del sito Web. Lo stesso non si assume alcuna responsabilità per il contenuto di
                    questo sito web. Chiunque acceda, visiti o utilizzi fornitori di terze parti lo fa a proprio
                    rischio.</p>
                <h2 className="black-text">Copyright</h2>
                <p>Il copyright e tutti gli altri diritti su testi, immagini, foto o file sul sito web appartengono
                    esclusivamente all’operatore del sito web o ai titolari dei diritti dichiarati. La riproduzione di
                    elementi richiede il consenso scritto del titolare del copyright.
                </p>
            </section>


        </div>


    )
}

export default Impressum;