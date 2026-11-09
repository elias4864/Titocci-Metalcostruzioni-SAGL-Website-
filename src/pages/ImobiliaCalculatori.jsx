import React, { useState } from 'react';

const LOCATION_FACTORS = {
    city: { name: 'Großstadt / Top-Lage', basePrice: 4500 },
    suburb: { name: 'Speckgürtel / Vorort', basePrice: 3200 },
    rural: { name: 'Ländliche Region', basePrice: 2100 },
    country: { name: 'Schweiz', basePrice: 5000 }
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
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [personen, setPersonen] = useState(1);
    const [result, setResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

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
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        const base = LOCATION_FACTORS[location].basePrice;
        const conditionMult = CONDITION_FACTORS[condition].multiplier;
        const groesseFactor = getGroesseCategory(qm).multiplier;
        const personenFactor = 1 + (personen - 1) * 0.02;

        const currentYear = new Date().getFullYear();
        const age = Math.max(0, currentYear - year);
        const buildyear = Math.max(0.6, 1 - (age * 0.005));

        const pricePerQm = base * conditionMult * groesseFactor * personenFactor * buildyear;
        const totalPrice = pricePerQm * qm;

        alert("Der Gesamtpreis pro Quadratmeter beträgt " + Math.round(pricePerQm) + " CHF etwa!");
        alert("Der Gesamtpreis des Grundstücks beträgt " + Math.round(totalPrice) + " CHF etwa!");

        setResult({
            pricePerQm: Math.round(pricePerQm),
            totalPrice: Math.round(totalPrice),
        });
    };

    const currentGroesse = getGroesseCategory(qm);

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

            {/* Header mit Toggle-Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOpen ? '15px' : '0' }}>
                <h2 style={{ margin: 0, color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>Gratis Immobilienrechner</h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isOpen ? 'Einklappen ▲' : 'Ausklappen ▼'}
                </button>
            </div>

            {/* Inhaltsbereich - gerendert wenn isOpen === true */}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                            <input
                                type="number"
                                value={qm}
                                onChange={(e) => setQm(Number(e.target.value))}
                                min="10"
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                            <span style={{ fontSize: '0.85em', color: '#666', marginTop: '4px', display: 'block' }}>
                                Kategorie: {currentGroesse.name}
                            </span>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lage:</label>
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
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Anzahl Personen:</label>
                            <input
                                type="number"
                                value={personen}
                                onChange={(e) => setPersonen(Number(e.target.value))}
                                min="1"
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Baujahr:</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                min="1900"
                                max={new Date().getFullYear()}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>

                        <button type="submit" style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                            Immobilienwert jetzt schätzen
                        </button>
                    </form>

                    {result && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#0369a1', fontSize: '30px', wordBreak: 'break-word' }}><span>Geschätzter Marktwert:</span></h3>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#0c4a6e' }}>
                                {result.totalPrice.toLocaleString('de-CH')} CHF
                            </p>
                            <p style={{ fontSize: '14px', color: '#0369a1', margin: '0 0 10px 0' }}>
                                ({result.pricePerQm.toLocaleString('de-CH')} CHF / m²)
                            </p>
                            <small style={{ color: '#666' }}><marquee>*Dies ist eine unverbindliche mathematische Schätzung</marquee>.</small>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}