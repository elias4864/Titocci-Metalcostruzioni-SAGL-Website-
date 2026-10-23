import React from 'react';
import NavIcon from '../assets/Navicon.png';
import '../Styles/TimeLineSection.css';
import Schleifbild from '../assets/Schleifbild.jpg';

export const TimelineSection = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
            <h1 className="yellow-text">Presentazione</h1>
            <div className="timeline-line"></div>

            {/* --- 1973 --- */}
            <div className="timeline-year">
                <span>1973</span>
            </div>

            {/* 1973: Fondazione (Rechts) */}
            <div className="timeline-item right">
                <div className="timeline-content-left">
                    <span className="left-label">Titocci Metalcostruzioni SAGL</span>
                </div>
                <div className="timeline-dot"></div>
                <div className="timeline-box">
                    <div className="box-arrow left-arrow"></div>
                    <h2 className="box-title">Fondazione</h2>
                    <img src={NavIcon} alt="Titocci Logo" className="box-logo" />
                    <p className="box-text">
                        La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                        ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                    </p>
                </div>
            </div>

            {/* Zwischenschritt: Officina più grande (Links) */}
            <div className="timeline-item left">
                <div className="timeline-box">
                    <div className="box-arrow right-arrow"></div>
                    <p className="box-text">
                        Passato qualche anno, visto il costante aumento della mole di lavoro e
                        l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                    </p>
                </div>
                <div className="timeline-dot"></div>
                <div className="timeline-content-right"></div>
            </div>

            {/* --- 1982 --- */}
            <div className="timeline-year">
                <span>1982</span>
            </div>

            {/* 1982: Capannone Avegno (Rechts) */}
            <div className="timeline-item right">
                <div className="timeline-content-left"></div>
                <div className="timeline-dot"></div>
                <div className="timeline-box">
                    <div className="box-arrow left-arrow"></div>
                    <p className="box-text">
                        Nel 1982 viene costruito il capannone presso la zona industriale di Avegno.
                        Qui la ditta trova la sua sede ideale ed è qui che tuttora continua la sua attività.
                    </p>
                </div>
            </div>

            {/* --- 1995 --- */}
            <div className="timeline-year">
                <span>1995</span>
            </div>

            {/* 1995: Figlio Marco (Links) */}
            <div className="timeline-item left">
                <div className="timeline-box">
                    <div className="box-arrow right-arrow"></div>
                    <p className="box-text">
                        Nel 1995 entra in azienda il figlio Marco.
                    </p>
                </div>
                <div className="timeline-dot"></div>
                <div className="timeline-content-right"></div>
            </div>

            {/* --- 2012 --- */}
            <div className="timeline-year">
                <span>2012</span>
            </div>

            {/* 2012: Esperienza (Rechts) */}
            <div className="timeline-item right">
                <div className="timeline-content-left"></div>
                <div className="timeline-dot"></div>
                <div className="timeline-box">
                    <div className="box-arrow left-arrow"></div>
                    <p className="box-text">
                        Dopo quattro anni di apprendistato e ulteriori 13 anni di esperienza come dipendente...
                    </p>
                </div>
            </div>

            {/* --- 2017 --- */}
            <divf className="timeline-year">
                <span>2017</span>


                <p>
                    <h1 className="gelbe-border">


                    </h1>

                </p>


                <img src={Schleifbild} />
            </divf>
        </div>
    );
};

export default TimelineSection;