import { useContext } from "react";
import { ThemeContext } from "../pages/context/ThemeContext.js";

function Key({ text, type = 0, area = "", onClick }) {
    const theme = useContext(ThemeContext);

    // CSS-Klassen sauber filtern und zusammenfügen (inklusive Type 4)
    const classNames = [
        "key",
        `theme-${theme}-key`,
        type === 1 && `key-type-1 theme-${theme}-key-type-1`,
        type === 2 && `key-type-2 theme-${theme}-key-type-2`,
        type === 3 && `key-type-3 theme-${theme}-key-type-3`,
        type === 4 && `key-type-4 theme-${theme}-key-type-4`,
        area && `key-area-${area}`,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type="button" className={classNames} onClick={onClick}>
            <p className="key-text">{text}</p>
        </button>
    );
}

export default Key;