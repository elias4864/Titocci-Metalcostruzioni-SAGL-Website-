import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./pages/Navbar.jsx";
import  { BrowserRouter} from 'react-router-dom';

import './Styles/App.css';

function App() {
    return (
        <>
            {/* Die Navbar wird EINMAL geladen und bleibt immer stehen */}
            <Navbar/>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/home" className="logo-link">
                        Titocci Metalcostruzioni
                    </Link>
                </div>
            </nav>

            <main className="hero-image-wrapper">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                    </Routes>
                </div>
            </main>

            <div className="cookie-banner" id="cookieBanner">
                <div className="cookie-banner-content">
                    <p>Questo sito utilizza cookie di profilazione, propri o di altri siti. Se procedi nella navigazione acconsenti all'utilizzo dei cookie.</p>
                    <div className="cookie-banner-buttons">
                        <button id="cookieAccept">Accetta</button>
                        <button id="cookieDecline">Nega</button>
                        <button id="cookiePreference">Preferenze</button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default App;