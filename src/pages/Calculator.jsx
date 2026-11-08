import React, { createContext, useState } from "react";

// Komponenten importieren
import Header from "../pages/Header.jsx";
import Display from "../pages/Display";
import Keypad from "../pages/KeyPad.jsx";

import '../Styles/Calculator.css';

export const ThemeContext = createContext();

function Calculator() {
    const [theme, setTheme] = useState(1);
    const [primary, setPrimary] = useState("0");
    const [secondary, setSecondary] = useState("");
    const [operator, setOperator] = useState(null);
    const [previous, setPrevious] = useState("");
    const [ResetNext,setResetNext] = useState("");

    // Haupt-Berechnung gemäß Lucca Rodrigues Algorithmus
    const calc = (shift = true, swap = false) => {
        let result = 0;
        const primaryNumber = Number(primary);
        const secondaryNumber = Number(secondary);

        if (swap) {
            if (operator === 0) result = primaryNumber + secondaryNumber;
            if (operator === 1) result = primaryNumber - secondaryNumber;
            if (operator === 2) result = primaryNumber * secondaryNumber;
            if (operator === 3) result = secondaryNumber === 0 ? "Error" : primaryNumber / secondaryNumber;
        } else {
            if (operator === 0) result = secondaryNumber + primaryNumber;
            if (operator === 1) result = secondaryNumber - primaryNumber;
            if (operator === 2) result = secondaryNumber * primaryNumber;
            if (operator === 3) result = primaryNumber === 0 ? "Error" : secondaryNumber / primaryNumber;
        }

        const originalPrimary = primary;
        setPrimary(result.toString());

        if (shift) {
            setSecondary(originalPrimary);
        }
    };

    // Zeichen/Ziffern eingeben
    const addChar = (char) => {
        let currentPrimary = primary;
        let currentSecondary = secondary;

        if (previous === "=") {
            setSecondary("");
            currentSecondary = "";
        }

        if (previous.startsWith("op")) {
            setSecondary(primary);
            currentPrimary = "";
        }

        if (char === "." && currentPrimary.includes(".")) return;

        if (currentPrimary === "0" && char !== ".") {
            setPrimary(String(char));
        } else {
            setPrimary(currentPrimary + String(char));
        }

        setPrevious(`char-${char}`);
    };

    // DEL Taste
    const delChar = () => {
        if (primary.length <= 1 || primary === "Error") {
            setPrimary("0");
        } else {
            setPrimary((prev) => prev.slice(0, -1));
        }
    };


    // RESET Taste
    const reset = () => {
        setPrimary("0");
        setSecondary("");
        setOperator(null);
        setPrevious("");
    };

    // Operator-Klick Handler
    const handleOperator = (op) => {
        const newSecondary = previous === "=" ? "" : secondary;
        setSecondary(newSecondary);

        if (newSecondary !== "" && !previous.startsWith("op")) {
            calc(true, false);
        }

        setOperator(op);
        setPrevious(`op-${op}`);
    };

    // Gleichheitszeichen (=) Handler
    const handleEquals = () => {
        if (operator === null) return;
        const isRepeatEquals = previous === "=";
        calc(!isRepeatEquals, isRepeatEquals);
        setPrevious("=");
    };


    // Quadrat-Funktion (x²)
    const handleSquare = () => {
        const num = parseFloat(primary);
        if (!isNaN(num)) {
            const result = (num * num).toString();
            setPrimary(result);
            setResetNext(true); // Setzt den Status, damit die nächste Ziffereneingabe das Ergebnis überschreibt
        }
    };
    return (
        <ThemeContext.Provider value={theme}>
            <main className={`calc-wrapper theme-${theme}-main`}>
                <div className="calc-container">
                    <Header setTheme={setTheme} />
                    <Display value={primary} />
                    <Keypad
                        addChar={addChar}
                        delChar={delChar}
                        reset={reset}
                        handleOperator={handleOperator}
                        handleEquals={handleEquals}
                        handleSquare={handleSquare}
                    />
                </div>
            </main>
        </ThemeContext.Provider>
    );
}

export default Calculator;