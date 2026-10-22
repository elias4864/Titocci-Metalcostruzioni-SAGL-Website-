import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Navicon.png';
import '../Styles/Navbar.css';
import Facebook from "../assets/Facebook.png";
import Google from "../assets/Google.png";
import RedFacebook from "../assets/Redfacebook.jfif";

function Navbar() {
    return (
        <nav className="navbar-overlay">
            <div className="navbar-container">
               <header className="main-header">
                   <img src={Logo} className="logo" alt="Logo" />

                   <ul style={{
                       display: 'flex',
                       listStyle: 'none',
                       gap: '25px',
                       margin: 0,
                       padding: 0
                   }}>
                       <li><Link to="/" style={{ color:'black' , textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #e62b2b', paddingBottom: '3px' }}>Home</Link></li>
                       <li><Link to="/chi-siamo" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Chi siamo</Link></li>
                       <li><Link to="/servizi" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Servizi</Link></li>
                       <li><Link to="/galleria" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Galleria</Link></li>
                       <li><Link to="/contatti" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>Contatti</Link></li>
                   </ul>


               </header>


            </div>
        </nav>

    );
}

export default Navbar;