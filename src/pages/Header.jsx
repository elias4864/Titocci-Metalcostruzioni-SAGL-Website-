import React, { useContext } from "react";
import { ThemeContext } from "../pages/context/ThemeContext.js";
import SEO from '../pages/SEO.jsx';


function Header({ setTheme }) {
    const theme = useContext(ThemeContext);

    // Pixel-Positionen für die 4 Themes (Passe die Werte je nach Breite an)
    const positions = [5, 28, 50, 72];
    const themeIndex = parseInt(theme, 10) - 1;

    return (
        <header className="calc-header">
            <p className={`header-logo theme-${theme}-header-logo`}>Online Calculator</p>
            <div className="calc-header-switch">

                {/* THEME-Text mit gezieltem Abstand nach unten */}
                <p className={`header-switch-prompt theme-${theme}-header-switch-prompt`} style={{ marginBottom: '8px' }}>
                    THEME
                </p>

                <div style={{ position: 'relative' }}>
                    {/* Zahlen 1 bis 4 mit sauberem Abstand nach unten zum Schieber-Container */}
                    <div
                        className="header-switch-positions"
                        style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6px', marginBottom: '8px' }}
                    >
                        <span className={`theme-${theme}-header-switch-position`}>1</span>
                        <span className={`theme-${theme}-header-switch-position`}>2</span>
                        <span className={`theme-${theme}-header-switch-position`}>3</span>
                        <span className={`theme-${theme}-header-switch-position`}>4</span>
                    </div>

                    {/* Schieber-Container */}
                    <div className={`header-switch-container theme-${theme}-header-switch-container`} style={{ position: 'relative' }}>
                        <div
                            style={{ left: `${positions[themeIndex >= 0 ? themeIndex : 0]}px` }}
                            className={`header-switch-toggle theme-${theme}-header-switch-toggle`}
                        ></div>
                        <div className="ghost ghost-1" onClick={() => setTheme("1")}></div>
                        <div className="ghost ghost-2" onClick={() => setTheme("2")}></div>
                        <div className="ghost ghost-3" onClick={() => setTheme("3")}></div>
                        <div className="ghost ghost-4" onClick={() => setTheme("4")}></div>
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;