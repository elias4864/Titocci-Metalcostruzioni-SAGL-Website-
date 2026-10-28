import React, { useState } from 'react';

const LOCATION_FACTORS = {
    city: { name: 'Großstadt / Top-Lage', basePrice: 4500 },
    suburb: { name: 'Speckgürtel / Vorort', basePrice: 3200 },
    rural: { name: 'Ländliche Region', basePrice: 2100 },
    country:{name:'Switzerland',basePrice:5000}
};

const CONDITION_FACTORS = {
    new: { name: 'Neubau / Erstbezug', multiplier: 1.2 },
    good: { name: 'Gepflegt / Saniert', multiplier: 1.0 },
    need_repair: { name: 'Renovierungsbedürftig', multiplier: 0.75 },
};

// Erweiterung für die Größenkategorien mit prozentualem Anpassungsfaktor
const GROESSE = {
    small: { name: 'Klein (bis 45 m²)', min: 0, max: 45, multiplier: 1.15 },       // Kleinere Wohnungen haben oft höheren m²-Preis
    medium: { name: 'Mittel (46 - 90 m²)', min: 46, max: 90, multiplier: 1.0 },    // Standard
    large: { name: 'Groß (91 - 150 m²)', min: 91, max: 150, multiplier: 0.95 },    // Leicht degressiver m²-Preis
    extra_large: { name: 'Sehr groß (> 150 m²)', min: 151, max: 999, multiplier: 0.90 }
};

export default function HousePriceCalculator() {
    const [area, setArea] = useState(120);
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [estimatedPrice, setEstimatedPrice] = useState(null);
    const [qm, setQm] = useState(75);

    /**
     * Calculate Size
     * @param qmValue
     * @returns {{name: string, min: number, max: number, multiplier: number}}
     */
    const getGroesseCategory = (qmValue) => {
        if (qmValue <= 45) return GROESSE.small;
        if (qmValue <= 90) return GROESSE.medium;
        if (qmValue <= 150) return GROESSE.large;
        return GROESSE.extra_large;
    };


    const calculatePrice = () => {
        // KEIN e.preventDefault() hier!
        const base = LOCATION_FACTORS[location].basePrice;
        const conditionMult = CONDITION_FACTORS[condition].multiplier;
        const groesseFactor = getGroesseCategory(qm).multiplier;

        const pricePerQm = base * conditionMult * groesseFactor;
        const totalPrice = pricePerQm * qm;

        return {
            pricePerQm: Math.round(pricePerQm),
            totalPrice: Math.round(totalPrice)
        };
    };



const { pricePerQm, totalPrice } = calculatePrice();
    const currentGroesse = getGroesseCategory(qm);

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: 'gold',textShadow:'30px',fontWeight:'bold',fontSize:'30px' }}>Gratis Imobillienrechner</h2>

            <form onSubmit={calculatePrice} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        min="10"
                        required
                        placeholder="100m**2"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
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



                <div style={{ marginBottom: '15px' }}>
                    <label>Wohnfläche (m²): </label>
                    <input
                        type="number"
                        value={qm}
                        onChange={(e) => setQm(Number(e.target.value))}
                        min="10"
                        required
                        placeholder="300m**"
                    />
                    <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>
                    Kategorie: {currentGroesse.name}
                </span>
                </div>

                <hr />



                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color:'orange' }}>Baujahr:</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                        placeholder="Baujahr: 2023"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'brown', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Imobillienwert schätzen
                </button>
            </form>

            {estimatedPrice !== null && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#0369a1' }}>Geschätzter Marktwert:</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#0c4a6e' }}>
                        {estimatedPrice.toLocaleString('de-DE')} €
                    </p>
                    <small style={{ color: '#666' }}>*Dies ist eine unverbindliche mathematische Schätzung.</small>
                </div>
            )}
        </div>
    );
}
