import React, { useState } from 'react';
import emailjs from "@emailjs/browser";
import SEO from '../pages/SEO.jsx';
import html2pdf from 'html2pdf.js';

const CANTON_FACTORS = {
    ZH: { name: 'Zürich (ZH)', factor: 1.35 },
    GE: { name: 'Genf (GE)', factor: 1.40 },
    BS: { name: 'Basel-Stadt (BS)', factor: 1.25 },
    BE: { name: 'Bern (BE)', factor: 1.00 },
    LU: { name: 'Luzern (LU)', factor: 1.15 },
    SG: { name: 'St. Gallen (SG)', factor: 0.90 },
    VS: { name: 'Wallis (VS)', factor: 0.85 },
    ACS: { name: 'Aargau Central South (ACS)', factor: 1.05 },
    EOX: { name: 'Ostschweiz Exklusiv (EOX)', factor: 1.10 },
    CH: { name: 'Übrige Schweiz', factor: 1.00 },
};

const LOCATION_FACTORS = {
    city: { name: 'Großstadt / Top-Lage', basePrice: 8500 },
    suburb: { name: 'Speckgürtel / Vorort', basePrice: 6200 },
    rural: { name: 'Ländliche Region', basePrice: 4100 },
    lake: { name: 'Am Seeufer', basePrice: 11000 },
    mountains:{name:'Berg-/Panoramalage',basePrice:8000},
};

const CONDITION_FACTORS = {
    new: { name: 'Neubau / Erstbezug', multiplier: 1.2 },
    good: { name: 'Gepflegt / Saniert', multiplier: 1.0 },
    need_repair: { name: 'Renovierungsbedürftig', multiplier: 0.75 },
};

const GROESSE = {
    small: { name: 'Klein (bis 45 m²)', min: 0, max: 45, multiplier: 1.15 },
    medium: { name: 'Mittel (46 - 90 m²)', min: 46, max: 90, multiplier: 1.0 },
    large: { name: 'Groß (91 - 150 m²)', min: 91, max: 150, multiplier: 0.95 },
    extra_large: { name: 'Sehr groß (> 150 m²)', min: 151, max: 999, multiplier: 0.90 },
};

export default function HousePriceCalculator() {
    const [qm, setQm] = useState(75);
    const [canton, setCanton] = useState('ZH');
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [personen, setPersonen] = useState(1);
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [zinssatz, setZinssatz] = useState(2.5);
    const [exportPdf, setExportPdf] = useState(true);

    const currentYear = new Date().getFullYear();

    const getGroesseCategory = (qmValue) => {
        if (qmValue <= 45) return GROESSE.small;
        if (qmValue <= 90) return GROESSE.medium;
        if (qmValue <= 150) return GROESSE.large;
        return GROESSE.extra_large;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
    };

    const sendEmailCalc = async (calculatedTotalPrice, calculatedPricePerQm, attachedImage) => {
        if (!email || email.length < 5 || !email.includes('@')) {
            alert("Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }

        try {
            const EmailJS_serviceID = 'service_n9toe59';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                subject: "Neue Immobilien-Berechnung von Titocci Metalcostruzioni",
                from_email: email,
                message: `Wohnfläche: ${qm} m²\nKanton: ${canton}\nZinssatz: ${zinssatz}%\nGeschätzter Quadratmeterpreis: ${calculatedPricePerQm.toFixed(2)} CHF\nGeschätzter Gesamtpreis: ${calculatedTotalPrice.toFixed(2)} CHF`,
                to_email: "info@titocci.ch",
                signup_date: new Date().toLocaleDateString('de-CH'),
                image_url: attachedImage || "Kein Bild angehängt"
            };

            await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            alert("Der Bericht wurde erfolgreich an " + email + " und an Titocci Metalcostruzioni gesendet!");
        } catch (error) {
            console.error("Fehler beim E-Mail-Versand:", error.message);
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        if (!qm || qm <= 0) {
            alert("Bitte gib eine gültige Wohnfläche ein.");
            return;
        }
        if (!email || !email.includes('@')) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
        }

        const base = LOCATION_FACTORS[location].basePrice;
        const cantonFactor = CANTON_FACTORS[canton].factor;
        const conditionMult = CONDITION_FACTORS[condition].multiplier;
        const groesseFactor = getGroesseCategory(qm).multiplier;


        /**
         * Berechnungs des Gesamtpreises der  Imobillienwohnung
         * @type {number}
         */

        const age = Math.max(0, currentYear - year);
        const ageFactor = Math.max(0.6, 1 - (age * 0.005));
        const personenFactor = 1 + ((personen - 1) * 0.01);
        const zinsFactor = Math.max(0.85, 1 + ((zinssatz - 2.0) * 0.03));

        const pricePerQm = base * cantonFactor * conditionMult * groesseFactor * ageFactor * personenFactor * zinsFactor;
        const totalPrice = pricePerQm * qm;
        alert("Der Gesamtpreis pro Quadratmeter beträgt"+pricePerQm);
        alert("Der Gesamtpreis der Imobillie beträgt"+totalPrice.toFixed(2));

        // Zusätzliche Finanzkennzahlen berechnen
        const jahresZins = totalPrice * (zinssatz / 100);
        const monatlicherZins = jahresZins / 12;
        const eigenkapital20 = totalPrice * 0.20;


        const calculationResult = {
            pricePerQm,
            totalPrice,
            email,
            image: imagePreview,
            monatlicherZins,
            eigenkapital20,
            date: new Date().toLocaleDateString('de-CH')
        };

        setResult(calculationResult);
        sendEmailCalc(totalPrice, pricePerQm, imagePreview);

        if (exportPdf) {
            setTimeout(() => {
                const element = document.getElementById('immobilien-report-pdf');
                if (element) {
                    const options = {
                        margin:       10,
                        filename:     'Immobilien-Kurzgutachten-Titocci.pdf',
                        image:        { type: 'jpeg', quality: 2 },
                        html2canvas:  { scale: 2, useCORS: true },
                        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    html2pdf().from(element).set(options).save();
                }
            }, 600);
        }
    };

    const currentGroesse = getGroesseCategory(qm);

    return (
        <div style={{
            maxWidth: '500px',
            margin: '20px auto',
            padding: '24px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 248, 0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            color: 'black',
            backgroundColor:'orange'
        }}>
            <SEO title="Immobilienrechner - Titocci Metalcostruzioni SAGL" />

            {/* Header mit Toggle-Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: isOpen ? '20px' : '0',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(241, 245, 249, 0.7)',
                transition: 'all 0.3s ease'
            }}>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>
                    Free Immobilienrechner
                </h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    {isOpen ? 'Einklappen' : 'Öffnen'}
                </button>
            </div>

            {isOpen && (
                <>
                    <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold',color:'gold',fontSize:'20px' ,textShadow:'brown 2px 2px'}}>Foto  der Imobillie hochladen:</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                            {imagePreview && (
                                <div style={{ marginTop: '10px', position: 'relative', textAlign: 'center' }}>
                                    <img src={imagePreview} alt="Vorschau" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <button type="button" onClick={handleRemoveImage} style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Entfernen</button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ihre E-Mail-Adresse:</label>
                            <input type="email" placeholder="name@beispiel.ch" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{qm} m²</span>
                            </div>
                            <input type="range" min="10" max="300" value={qm} onChange={(e) => setQm(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                            <span style={{ fontSize: '0.85em', color: '#64748b' }}>Kategorie: {currentGroesse.name}</span>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kanton / Region:</label>
                            <select value={canton} onChange={(e) => setCanton(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                {Object.entries(CANTON_FACTORS).map(([key, val]) => (<option key={key} value={key}>{val.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lage:</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                {Object.entries(LOCATION_FACTORS).map(([key, val]) => (<option key={key} value={key}>{val.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Zustand:</label>
                            <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                {Object.entries(CONDITION_FACTORS).map(([key, val]) => (<option key={key} value={key}>{val.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Hypothekarzins (%):</label>
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{zinssatz.toFixed(1)} %</span>
                            </div>
                            <input type="range" min="0.5" max="10.0" step="0.1" value={zinssatz} onChange={(e) => setZinssatz(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Baujahr:</label>
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{year}</span>
                            </div>
                            <input type="range" min="1900" max={currentYear} value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                            <input type="checkbox" id="exportPdfCheckbox" checked={exportPdf} onChange={(e) => setExportPdf(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                            <label htmlFor="exportPdfCheckbox" style={{ fontSize: '14px', cursor: 'pointer' }}>Professionelles PDF-Kurzgutachten direkt exportieren</label>
                        </div>

                        <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                            Immobilie bewerten & PDF erhalten
                        </button>
                    </form>

                    {/* ERGEBNIS-BOX (Wird auch für das PDF als Vorlage genutzt mit id="immobilien-report-pdf") */}
                    {result && (
                        <div id="immobilien-report-pdf" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#ffffff', border: '2px solid #2563eb', borderRadius: '8px', color: '#0f172a' }}>
                            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#2563eb', fontSize: '18px' }}>Titocci Metalcostruzioni SAGL</h3>
                                    <small style={{ color: '#64748b' }}>Immobilien-Marktwertanalyse vom {result.date}</small>
                                </div>
                                <span style={{ fontSize: '12px', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Zertifiziert</span>
                            </div>

                            {result.image && (
                                <img src={result.image} alt="Immobilie" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
                            )}

                            <div style={{ textAlign: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 5px 0' }}>Geschätzter Gesamtwert</p>
                                <p style={{ fontSize: '26px', fontWeight: '800', margin: '0', color: '#0f172a' }}>
                                    {Math.round(result.totalPrice).toLocaleString('de-CH')} CHF
                                </p>
                                <p style={{ fontSize: '14px', color: '#2563eb', margin: '5px 0 0 0', fontWeight: '600' }}>
                                    ({Math.round(result.pricePerQm).toLocaleString('de-CH')} CHF / m²)
                                </p>
                            </div>

                            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '10px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Wohnfläche / Region:</span> <strong>{qm} m² ({CANTON_FACTORS[canton].name})</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Zustand & Baujahr:</span> <strong>{CONDITION_FACTORS[condition].name} ({year})</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Empf. Eigenkapital (20%):</span> <strong>{Math.round(result.eigenkapital20).toLocaleString('de-CH')} CHF</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Monatliche Zinsbelastung:</span> <strong>~ {Math.round(result.monatlicherZins).toLocaleString('de-CH')} CHF / Mt.</strong></div>
                            </div>

                            <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '0' }}>
                                Dieser Bericht wurde automatisch an <strong>{result.email}</strong> übermittelt.<br/>© Titocci Metalcostruzioni SAGL – Alle Rechte vorbehalten.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}