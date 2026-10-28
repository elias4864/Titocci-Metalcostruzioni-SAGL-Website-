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

export default function HousePriceCalculator() {
    const [area, setArea] = useState(120);
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [estimatedPrice, setEstimatedPrice] = useState(null);

    const calculatePrice = (e) => {
        e.preventDefault();

        // Basispreis ermitteln
        const base = LOCATION_FACTORS[location].basePrice;

        // Zustand einberechnen
        const conditionMultiplier = CONDITION_FACTORS[condition].multiplier;

        // Alterseffekt (sehr vereinfacht: ältere Häuser verlieren leicht an Wert, außer sie sind frisch saniert)
        const currentYear = new Date().getFullYear();
        const age = Math.max(0, currentYear - year);
        const ageMultiplier = Math.max(0.65, 1 - (age * 0.005));

        // Berechnung des Gesamtpreises
        const finalPrice = area * base * conditionMultiplier * ageMultiplier/100;

        setEstimatedPrice(Math.round(finalPrice));
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: 'gold',textShadow:'30px' }}>Gratis Imobillienrechner</h2>

            <form onSubmit={calculatePrice} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        min="10"
                        required
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

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Baujahr:</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
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
