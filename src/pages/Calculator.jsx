        import React, { createContext, useState } from 'react';
        import Keypad from '../pages/KeyPad.jsx';
        import '../Styles/Calculator.css';
        import '../Styles/theme-1.css';
        import '../Styles/theme-2.css';
        import '../Styles/theme-3.css';
        import '../Styles/theme-4.css';

        export const ThemeContext = createContext({
            theme: "1",
            setTheme: () => {},
        });

        const OPERATORS = ["+", "-", "*", "/"];

        function evaluateExpression(expr) {
            const normalized = expr
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/,/g, ".")
                .trim();

            if (!normalized) return 0;

            // Nur Ziffern, Punkte, Operatoren, Klammern und Leerzeichen zulassen
            if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
                throw new Error("Ungültige Zeichen");
            }

            // Kein führender/abschließender binärer Operator außer '-' am Anfang
            const cleaned = normalized.replace(/[+\-*/.\s]+$/, "");
            if (!cleaned) return 0;

            const result = Function(`"use strict"; return (${cleaned});`)();
            if (typeof result !== "number" || !Number.isFinite(result)) {
                throw new Error("Ungültiges Ergebnis");
            }

            // Rundungsartefakte wie 0.1 + 0.2 = 0.30000000000000004 abmildern
            return Number(result.toPrecision(12));
        }

        export default function Calculator() {
            const [currentInput, setCurrentInput] = useState("0");
            const [theme, setTheme] = useState("1");

            const addChar = (char) => {
                const token = String(char);

                setCurrentInput((prev) => {
                    if (token === ".") {
                        const parts = prev.split(/[\s+\-*/]+/);
                        const lastPart = parts[parts.length - 1] || "";
                        if (lastPart.includes(".")) return prev;
                        return prev + ".";
                    }

                    if (prev === "0") {
                        return token;
                    }
                    return prev + token;
                });
            };

            const delChar = () => {
                setCurrentInput((prev) => {
                    if (prev.length <= 1) return "0";
                    // Falls am Ende ein Leerzeichen steht (z. B. nach " + "), ganzen Operatorblock entfernen
                    if (prev.endsWith(" ")) {
                        const trimmed = prev.trimEnd();
                        const lastSpace = trimmed.lastIndexOf(" ");
                        return lastSpace === -1 ? "0" : trimmed.slice(0, lastSpace);
                    }
                    const next = prev.slice(0, -1);
                    return next.trim() === "" ? "0" : next;
                });
            };

            const reset = () => {
                setCurrentInput("0");
            };

            const handleOperator = (op) => {
                const symbol = op === "×" ? "*" : op === "÷" ? "/" : op;
                if (!OPERATORS.includes(symbol)) return;

                setCurrentInput((prev) => {
                    const trimmed = prev.trimEnd();
                    const lastChar = trimmed.slice(-1);

                    if (OPERATORS.includes(lastChar)) {
                        return trimmed.slice(0, -1) + symbol + " ";
                    }
                    return `${trimmed} ${symbol} `;
                });
            };

            const handleSquare = () => {
                try {
                    const value = evaluateExpression(currentInput);
                    setCurrentInput(String(Number((value * value).toPrecision(12))));
                } catch {
                    alert("Ungültige Eingabe für x²");
                }
            };

            const handlePercent = () => {
                try {
                    const value = evaluateExpression(currentInput);
                    setCurrentInput(String(Number((value / 100).toPrecision(12))));
                } catch {
                    alert("Ungültige Eingabe für %");
                }
            };

            const handleSqrt = () => {
                try {
                    const value = evaluateExpression(currentInput);
                    if (value < 0) {
                        alert(`Fehler: Ungültiger Wert für die Wurzel (${value})`);
                        return;
                    }
                    setCurrentInput(String(Number(Math.sqrt(value).toPrecision(12))));
                } catch {
                    alert(`Fehler: Ungültiger Wert für die Wurzel (${currentInput})`);
                }
            };

            const handleEquals = () => {
                try {
                    const result = evaluateExpression(currentInput);
                    setCurrentInput(String(result));
                } catch {
                    alert("Ungültige Berechnung");
                    setCurrentInput("0");
                }
            };

            return (
                <ThemeContext.Provider value={{ theme, setTheme }}>
                    <div className={`calc-wrapper theme-${theme}-main`}>
                        <div className="calc-container">

                            <div className="calc-header">
                                <div className={`header-logo theme-${theme}-header-logo`}>Online Rechner</div>
                                <div className="calc-header-switch">
                                    <span className={`header-switch-prompt theme-${theme}-header-switch-prompt`}>THEME</span>
                                    <div style={{ position: 'relative', marginBottom: '30px' }}>
                                        <div className="header-switch-positions" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginBottom: '30px' }}>
                                            {["1", "2", "3", "4"].map((t) => (
                                                <span key={t} className={`theme-${theme}-header-switch-position`}>{t}</span>
                                            ))}
                                        </div>
                                        <div className={`header-switch-container theme-${theme}-header-switch-container`}>
                                            {["1", "2", "3", "4"].map((t) => (
                                                <div
                                                    key={t}
                                                    className={`ghost ghost-${t}`}
                                                    onClick={() => setTheme(t)}
                                                />
                                            ))}
                                            <div className={`header-switch-toggle theme-${theme}-header-switch-toggle toggle-position-${theme}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`display theme-${theme}-display`}>
                                <div className="display-text">{currentInput}</div>
                            </div>

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