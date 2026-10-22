import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import '../Styles/Chi Siamo.css';
import NavIcon from '../assets/Navicon.png';


/**
 * Timeline Section Function
 * @returns {JSX.Element}
 * @constructor
 */
export const TimelineSection = () => {
    return (
        <Timeline position="alternate">
            {/* 1973 Badge */}
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot className="timeline-badge-year">1973</TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent />
            </TimelineItem>

            {/* Item 1: Fondazione */}
            <TimelineItem>
                <TimelineOppositeContent className="timeline-title-left">
                    Titocci Metalcostruzioni SAGL
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot className="timeline-dot-yellow" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <div className="timeline-card">
                        <h3 className="card-title">Fondazione</h3>
                        {/* Logo einfügen, falls vorhanden */}
                        <img src={NavIcon} alt="Titocci Logo" className="card-logo" />
                        <p className="card-text">
                            La nostra ditta è stata fondata nel 1973 da Titocci Giovanni, la prima sede era
                            ubicata in un piccolo magazzino a Ponte Brolla, frazione del comune di Tegna.
                        </p>
                    </div>
                </TimelineContent>
            </TimelineItem>

            {/* Item 2: Trasferimento */}
            <TimelineItem>
                <TimelineContent>
                    <div className="timeline-card">
                        <p className="card-text">
                            Passato qualche anno, visto il costante aumento della mole di lavoro e
                            l'inserimento di personale, sorge l'esigenza di trasferirsi in un'officina più grande.
                        </p>
                    </div>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot className="timeline-dot-yellow" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineOppositeContent />
            </TimelineItem>

            {/* 1982 Badge */}
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot className="timeline-badge-year">1982</TimelineDot>
                </TimelineSeparator>
                <TimelineContent />
            </TimelineItem>
        </Timeline>
    );
};

export default TimelineSection;