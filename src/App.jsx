import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Dropdown from "./assets/Dropdown.png";
import './Styles/App.css';

function App() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
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



                <div className="footer-bottom copyright-container">
                    <div className="copyright-left">
                        <span>&copy; {new Date().getFullYear()}</span>
                        <Link to="/home" className="hover-red">Titocci Metalcostruzioni SAGL</Link>
                        <span>|</span>
                        <Link to="/impressum" className="hover">Impressum</Link>
                        <span>|</span>
                        <Link to="/privacy" className="hover">Privacy</Link>
                    </div>
                    <div className="copyright-right">
                        Web Design by <a   ref="https://marketingmaster.ch" target="_blank" rel="noopener noreferrer"><p className="marketingmaster">marketingmaster.ch</p></a> with love
                    </div>



                    <button className="scroll-to-top" onClick={scrollToTop} title="Nach oben scrollen">
                        <img className="dropdown-img" src={Dropdown}></img>
                    </button>

                </div>





            </main>
        </>
    );
}

export default App;