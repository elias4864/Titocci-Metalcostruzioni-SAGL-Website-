import React, { useContext } from "react";
import { ThemeContext } from "../pages/context/ThemeContext";
import SEO from '../pages/SEO.jsx';


function Display({ value }) {
    const theme = useContext(ThemeContext);

    const formatDisplay = (val) => {
        if (val === "Error") return "Error";
        if (!val || val === "") return "0";
        if (val.endsWith(".")) return val;
        const num = Number(val);
        return isNaN(num) ? val : parseFloat(num.toFixed(7)).toString();
    };

    return (
        <div className={`display theme-${theme}-display`}>
            <p className={`display-text theme-${theme}-display-text`}>
                {formatDisplay(value)}
            </p>
        </div>
    );
}

export default Display;