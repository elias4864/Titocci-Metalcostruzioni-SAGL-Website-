import React, { createContext, useState } from 'react';
import Keypad from '../pages/KeyPad.jsx';
import Header from '../pages/Header.jsx';
import Display from '../pages/Display.jsx';
import '../Styles/Calculator.css';
import '../Styles/theme-1.css';
import '../Styles/theme-2.css';
import '../Styles/theme-3.css';
import '../Styles/theme-4.css';

// 1. Context exportieren, damit untergeordnete Komponenten darauf zugreifen können
export const ThemeContext = createContext("1");

export default function Calculator() {
    const [currentInput, setCurrentInput] = useState("0");
    const [theme, setTheme] = useState("1"); // Standard-Theme ist "1"

    // Zeichen / Ziffern hinzufügen
    const addChar = (char) => {
        setCurrentInput(prev => (prev === "0" ? String(char) : prev + char));
    };

    // Letztes Zeichen löschen (Backspace)
    const delChar = () => {
        setCurrentInput(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    };

    // Alles zurücksetzen (AC / RESET)
    const reset = () => {
        setCurrentInput("0");
    };

    // Operatoren (+, -, *, /) hinzufügen
    const handleOperator = (op) => {
        setCurrentInput(prev => prev + " " + op + " ");
    };

    // Quadrat-Berechnung (x²) - Korrigiert
    const handleSquare = () => {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
            setCurrentInput(String(value * value));
        }
    };

    // Prozent-Berechnung
    const handlePercent = () => {
        const value = parseFloat(currentInput);
        if (!isNaN(value)) {
            setCurrentInput(String(value / 100));
        }
    };

    // Quadratwurzel-Berechnung
    const handleSqrt = () => {
        const value = parseFloat(currentInput);
        if (!isNaN(value) && value >= 0) {
            setCurrentInput(String(Math.sqrt(value)));
        } else {
            alert(`Fehler: Ungültiger Wert für die Wurzel (${currentInput})`);
        }
    };

    // Ergebnis berechnen (=)
    const handleEquals = () => {
        try {
            const result = eval(currentInput);
            setCurrentInput(String(result));
        } catch (error) {
            alert("Ungültige Berechnung");
            setCurrentInput("0");
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            <div className={`calc-wrapper theme-${theme}-main`}>
                <div className="calc-container">

                    {/* Header mit Logo und Theme-Switch für 4 Themes */}
                    <div className="calc-header">
                        <div className={`header-logo theme-${theme}-header-logo`}>Online Rechner</div>
                        <div className="calc-header-switch">
                            <span className={`header-switch-prompt theme-${theme}-header-switch-prompt`}>THEME</span>
                            <div style={{ position: 'relative', marginBottom: '30px' }}>
                                {/* Zahlen 1 bis 4 */}
                                <div className="header-switch-positions" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: '30px' }}>
                                    <span className={`theme-${theme}-header-switch-position`}>1</span>
                                    <span className={`theme-${theme}-header-switch-position`}>2</span>
                                    <span className={`theme-${theme}-header-switch-position`}>3</span>
                                    <span className={`theme-${theme}-header-switch-position`}>4</span>
                                </div>
                                <div className={`header-switch-container theme-${theme}-header-switch-container`}>
                                    {/* Klickbare Bereiche für die Themes 1 bis 4 */}
                                    <div className="ghost ghost-1" onClick={() => setTheme("1")}></div>
                                    <div className="ghost ghost-2" onClick={() => setTheme("2")}></div>
                                    <div className="ghost ghost-3" onClick={() => setTheme("3")}></div>
                                    <div className="ghost ghost-4" onClick={() => setTheme("4")}></div>

                                    {/* Schieber / Toggle */}
                                    <div className={`header-switch-toggle theme-${theme}-header-switch-toggle toggle-position-${theme}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display */}
                    <div className={`display theme-${theme}-display`}>
                        <div className="display-text">{currentInput}</div>
                    </div>

                    {/* Keypad */}
                    <div className={`keypad theme-${theme}-keypad`}>
                        <Keypad
                            addChar={addChar}
                            delChar={delChar}
                            reset={reset}
                            handleOperator={handleOperator}
                            handleSquare={handleSquare}
                            handlePercent={handlePercent}
                            handleSqrt={handleSqrt}
                            handleEquals={handleEquals}
                        />
                    </div>

                </div>
            </div>
        </ThemeContext.Provider>
    );
}