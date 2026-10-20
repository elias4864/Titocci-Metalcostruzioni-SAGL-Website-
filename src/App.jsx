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
            </main>
        </>
    );
}

export default App;