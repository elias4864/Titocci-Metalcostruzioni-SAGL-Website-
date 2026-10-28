import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter} from 'react-router-dom'; // Wichtig: HashRouter statt BrowserRouter
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <App />
    </React.StrictMode>
);