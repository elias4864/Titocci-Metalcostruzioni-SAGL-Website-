import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Das Element #root wurde in index.html nicht gefunden.');
}

createRoot(rootElement).render(
    <React.StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </HelmetProvider>
    </React.StrictMode>
);
