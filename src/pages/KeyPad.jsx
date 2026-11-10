import React, { useContext } from "react";
import { ThemeContext } from "../pages/context/ThemeContext.js";
import Key from "./Key.jsx"; // Achte hier auf den korrekten relativen Pfad zu Key.jsx
import SEO from '../pages/SEO.jsx';


function Keypad({
                    addChar,
                    delChar,
                    reset,
                    handleOperator,
                    handleEquals,
                    handleSquare,
                    handleSqrt,
                    handlePercent
                }) {
    const theme = useContext(ThemeContext);

    return (
        <>
            {/* Erste Reihe */}
            <Key text="7" onClick={() => addChar(7)} />
            <Key text="8" onClick={() => addChar(8)} />
            <Key text="9" onClick={() => addChar(9)} />
            <Key text="DEL" type={1} onClick={delChar} />

            {/* Zweite Reihe */}
            <Key text="4" onClick={() => addChar(4)} />
            <Key text="5" onClick={() => addChar(5)} />
            <Key text="6" onClick={() => addChar(6)} />
            <Key text="+" onClick={() => handleOperator("+")} />

            {/* Dritte Reihe */}
            <Key text="1" onClick={() => addChar(1)} />
            <Key text="2" onClick={() => addChar(2)} />
            <Key text="3" onClick={() => addChar(3)} />
            <Key text="-" onClick={() => handleOperator("-")} />

            {/* Vierte Reihe */}
            <Key text="." onClick={() => addChar(".")} />
            <Key text="0" onClick={() => addChar(0)} />
            <Key text="/" onClick={() => handleOperator("/")} />
            <Key text="x" onClick={() => handleOperator("*")} />

            {/* Fünfte Reihe (Erweiterte Funktionen: Quadrat, Prozent, Wurzel) */}
            <Key text="x²" type={0} onClick={handleSquare} />
            <Key text="%" onClick={handlePercent} />
            <Key text="√" type={0} onClick={handleSqrt} />
            {/* Platzhalter oder Operator, falls nötig – hier frei gelassen oder für Division etc. */}

            {/* Letzte Reihe: RESET und EQUALS (jeweils 2 Spalten breit) */}
            <Key text="RESET" type={1} area="reset" onClick={reset} />
            <Key text="=" type={2} area="equals" onClick={handleEquals} />
        </>
    );
}

export default Keypad;