import React, { useState } from 'react';
import emailjs from "@emailjs/browser";

const CANTON_FACTORS = {
    ZH: { name: 'Zürich (ZH)', factor: 1.35 },
    GE: { name: 'Genf (GE)', factor: 1.40 },
    BS: { name: 'Basel-Stadt (BS)', factor: 1.25 },
    BE: { name: 'Bern (BE)', factor: 1.00 },
    LU: { name: 'Luzern (LU)', factor: 1.15 },
    SG: { name: 'St. Gallen (SG)', factor: 0.90 },
    VS: { name: 'Wallis (VS)', factor: 0.85 },
    CH: { name: 'Übrige Schweiz', factor: 1.00 },
};

const LOCATION_FACTORS = {
    city: { name: 'Großstadt / Top-Lage', basePrice: 8500 },
    suburb: { name: 'Speckgürtel / Vorort', basePrice: 6200 },
    rural: { name: 'Ländliche Region', basePrice: 4100 },
    lake: { name: 'Am Seeufer', basePrice: 11000 },
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

    // E-Mail-Versand via EmailJS
    const sendEmailCalc = async (calculatedTotalPrice, calculatedPricePerQm) => {
        if (!email || email.length < 5 || !email.includes('@')) {
            alert("Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }

        try {
            const EmailJS_serviceID = 'service_n9toe59';

            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                subject: "Neue Immobilien-Berechnung von Titocci Metalconstruzione",
                from_email: email,
                message: `Wohnfläche: ${qm} m²\nKanton: ${canton}\nZinssatz: ${zinssatz}%\nGeschätzter Quadratmeterpreis: ${calculatedPricePerQm} CHF\nGeschätzter Gesamtpreis: ${calculatedTotalPrice} CHF`,
                to_email: "info@titocci.ch",
                signup_date: new Date().toLocaleDateString('de-CH'),
            };

            await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            alert("Der Bericht wurde erfolgreich an " + email + " und an Titocci Metalconstruzione gesendet!");

        } catch (error) {
            console.error("Fehler beim E-Mail-Versand:", error.message);
            alert("Fehler beim Senden der E-Mail: " + error.message);
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            alert("Bitte geben Sie zuerst eine gültige E-Mail-Adresse ein.");
            return;
        }



        const base = LOCATION_FACTORS[location].basePrice;
        const cantonFactor = CANTON_FACTORS[canton].factor;
        const conditionMult = CONDITION_FACTORS[condition].multiplier;
        const groesseFactor = getGroesseCategory(qm).multiplier;

        const age = Math.max(0, currentYear - year);
        const ageFactor = Math.max(0.6, 1 - (age * 0.005));

        const personenFactor = 1 + ((personen - 1) * 0.01);
        const zinsFactor = Math.max(0.85, 1 - ((zinssatz - 2.0) * 0.03));

        const pricePerQm = base * cantonFactor * conditionMult * groesseFactor * ageFactor * personenFactor * zinsFactor;
        const totalPrice = pricePerQm * qm;

        const roundedPricePerQm = Math.round(pricePerQm);
        const roundedTotalPrice = Math.round(totalPrice);

        setResult({
            pricePerQm: roundedPricePerQm,
            totalPrice: roundedTotalPrice,
            email: email,
        });

        // EmailJS direkt nach erfolgreicher Berechnung auslösen
        sendEmailCalc(roundedTotalPrice, roundedPricePerQm);
    };

    const currentGroesse = getGroesseCategory(qm);

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

            {/* Header mit Toggle-Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOpen ? '15px' : '0' }}>
                <h2 style={{ margin: 0, color: '#0070f3', fontSize: '24px', fontWeight: 'bold' }}>Gratis Immobilienrechner</h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isOpen ? 'Einklappen ▲' : 'Ausklappen ▼'}
                </button>
            </div>

            {/* Inhaltsbereich */}
            {isOpen && (
                <>
                    <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Foto der Immobilie / Wohnung hochladen:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                            {imagePreview && (
                                <div style={{ marginTop: '10px', position: 'relative', textAlign: 'center' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Immobilien Vorschau"
                                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(230, 43, 43, 0.85)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        Bild entfernen
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* E-MAIL EINGABE */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ihre E-Mail-Adresse eingeben (für den Bericht):</label>
                            <input
                                type="email"
                                placeholder="elias.kaiser@gmx.ch"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', color: 'orange' }}
                            />
                        </div>

                        {/* SLIDER 1: Wohnfläche (m²) */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                                <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{qm} m²</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="300"
                                step="1"
                                value={qm}
                                onChange={(e) => setQm(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.85em', color: '#666', marginTop: '4px', display: 'block' }}>
                                Kategorie: {currentGroesse.name}
                            </span>
                        </div>

                        {/* KANTON / GEMEINDE AUSWAHL */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kanton / Region:</label>
                            <select
                                value={canton}
                                onChange={(e) => setCanton(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                {Object.entries(CANTON_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lage innerhalb der Region:</label>
                            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                {Object.entries(LOCATION_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Zustand:</label>
                            <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                {Object.entries(CONDITION_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Anzahl Personen im Haushalt:</label>
                            <input
                                type="number"
                                value={personen}
                                onChange={(e) => setPersonen(Number(e.target.value))}
                                min="1"
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* SLIDER 2: Hypothekarzins (%) */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Hypothekarzins (%):</label>
                                <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{zinssatz.toFixed(1)} %</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="10.0"
                                step="0.1"
                                value={zinssatz}
                                onChange={(e) => setZinssatz(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        {/* SLIDER 3: Baujahr */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Baujahr:</label>
                                <span style={{ fontWeight: 'bold', color: '#0070f3' }}>{year}</span>
                            </div>
                            <input
                                type="range"
                                min="1900"
                                max={currentYear}
                                step="1"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        {/* Submit-Button */}
                        <button
                            type="submit"
                            onClick={sendEmailCalc}
                            style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                        >

                            Immobilienpreis berechnen & E-Mail erhalten
                        </button>
                    </form>

                    {result && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#0369a1', fontSize: '20px' }}>Geschätzter Marktwert</h3>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#0c4a6e' }}>
                                {result.totalPrice.toLocaleString('de-CH')} CHF
                            </p>
                            <p style={{ fontSize: '14px', color: '#0369a1', margin: '0 0 10px 0' }}>
                                ({result.pricePerQm.toLocaleString('de-CH')} CHF / m²)
                            </p>
                            <p style={{ fontSize: '13px', color: '#0369a1', margin: '10px 0 0 0' }}>
                                Der Bericht wurde an <strong>{result.email}</strong> gesendet.
                            </p>
                            <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '5px' }}>*Dies ist eine unverbindliche mathematische Schätzung.</small>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}