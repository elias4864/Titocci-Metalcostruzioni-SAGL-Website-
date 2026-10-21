import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import './App.css';

function App() {
    return (
        <>
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
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </div>



                <div className="footer-bottom">
                    <p className="copyright-text">
                        Copyright &copy; {new Date().getFullYear()}
                        <Link to="/home" className="hover">Titocci Metalcostruzioni SAGL |</Link> |{" "}
                        <Link to="/https://titocci.ch/impressum/" className="hover">Impressum </Link> |{""}
                        <Link to="/datenschutzerklärung" className="hover"></Link>|{""}
                        <Link to="/https://titocci.ch/privacy/" className="hover">Privacy</Link>
                    </p>

                </div>



                <p className="seo-text">SEO & Webdesign by <a href="https://marketingmaster.ch" className="marketingmaster">marketingmaster.ch</a> with love</p>

            </main>
        </>
    );
}

export default App;