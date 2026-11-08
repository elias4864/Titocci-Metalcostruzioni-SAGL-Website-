import React, { useContext } from "react";
import { ThemeContext } from "../pages/Calculator.jsx";

function Header({ setTheme }) {
    const theme = useContext(ThemeContext);
    const positions = [5, 28, 50];

    return (
        <header className="calc-header">
            <p className={`header-logo theme-${theme}-header-logo`}>Online Calculator</p>
            <div className="header-switch">
                <p className={`header-switch-prompt theme-${theme}-header-switch-prompt`}>THEME</p>
                <div className={`header-switch-container theme-${theme}-header-switch-container`}>
                    <div
                        style={{ left: `${positions[theme - 1]}px` }}
                        className={`header-switch-toggle theme-${theme}-header-switch-toggle`}
                    ></div>
                    <div className="ghost ghost-1" onClick={() => setTheme(1)}></div>
                    <div className="ghost ghost-2" onClick={() => setTheme(2)}></div>
                    <div className="ghost ghost-3" onClick={() => setTheme(3)}></div>
                    <div className="header-switch-positions">
                        <span className={`theme-${theme}-header-switch-position`}>1</span>
                        <span className={`theme-${theme}-header-switch-position`}>2</span>
                        <span className={`theme-${theme}-header-switch-position`}>3</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;