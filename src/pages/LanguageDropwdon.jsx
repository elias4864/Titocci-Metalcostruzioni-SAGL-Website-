import React from "react";

function LanguageSwitcher({ lang, onLanguageChange }) {
    return (
        <div className="language-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="language" className="dropdown-label" style={{ color: 'black', backgroundColor:'gold', fontSize: '14px,' }}>
                Wähle bitte eine Sprache aus: ▼
            </label>
            <select
                id="language"
                className="language-dropdown"
                name="Languages"
                value={lang || "de"}
                onChange={(e) => onLanguageChange(e.target.value)}
                style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#0dd21e',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer'
                }}
            >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="it">Italiano</option>
                <option value="fr">Français</option>
                <option value="nl">Nederlands</option>
            </select>
        </div>
    );
}

export default LanguageSwitcher;