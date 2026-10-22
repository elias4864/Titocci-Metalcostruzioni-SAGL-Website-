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


               </header>


            </div>
        </nav>

    );
}

export default Navbar;