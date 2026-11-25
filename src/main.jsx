import React, { createContext, useContext, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Lock } from 'lucide-react';

import './index.css';
import App from './App.jsx';

/**
 * Storage Key for Users 
 * @type {string}
 */
const STORAGE_USERS_KEY = 'titocci_kunden';
const STORAGE_CURRENT_USER_KEY = 'titocci_current_user';

const AuthContext = createContext(null);

const readStoredUsers = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const readStoredCurrentUser = () => {
    try {
        const saved = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

/**
 * Clientseitiger AuthProvider (ohne Backend):
 * Verwaltet Session & Kundenkonten im localStorage für UI-Zugangssteuerung.
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(readStoredCurrentUser);
    const [routeGuardEnabled, setRouteGuardEnabled] = useState(true);

    const login = useCallback((email, password) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const users = readStoredUsers();
        const foundUser = users.find(
            (u) => u.email === cleanEmail && u.password === password
        );

        if (!foundUser) {
            return { ok: false, error: 'E-Mail oder Passwort ist ungültig.' };
        }

        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(foundUser));
        setCurrentUser(foundUser);
        return { ok: true, user: foundUser };
    }, []);

    const register = useCallback(({ kundenTyp, firmaOderName, immobilienObjekt, email, password }) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanName = String(firmaOderName || '').trim();
        const users = readStoredUsers();

        if (users.some((u) => u.email === cleanEmail)) {
            return { ok: false, error: 'Für diese E-Mail existiert bereits ein Konto.' };
        }

        const newUser = {
            id: Date.now(),
            kundenTyp: kundenTyp || 'Immobilienverwaltung',
            firmaOderName: cleanName,
            immobilienObjekt: String(immobilienObjekt || '').trim(),
            email: cleanEmail,
            password
        };

        const nextUsers = [...users, newUser];
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(nextUsers));
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
        setCurrentUser(newUser);
        return { ok: true, user: newUser };
    }, []);

    const updatePassword = useCallback((email, currentPassword, newPassword) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const users = readStoredUsers();
        const userIndex = users.findIndex((u) => u.email === cleanEmail);

        if (userIndex === -1) {
            return { ok: false, error: 'Kein Konto mit dieser E-Mail-Adresse gefunden.' };
        }

        if (users[userIndex].password !== currentPassword) {
            return { ok: false, error: 'Das bisherige Passwort stimmt nicht.' };
        }

        const updatedUser = {
            ...users[userIndex],
            password: newPassword
        };

        const nextUsers = [...users];
        nextUsers[userIndex] = updatedUser;
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(nextUsers));

        setCurrentUser((prev) => {
            if (prev?.email === cleanEmail) {
                localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
                return updatedUser;
            }
            return prev;
        });

        return { ok: true, user: updatedUser };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
        setCurrentUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: Boolean(currentUser && currentUser.email),
                routeGuardEnabled,
                setRouteGuardEnabled,
                login,
                register,
                updatePassword,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth muss innerhalb eines <AuthProvider> verwendet werden.');
    }
    return ctx;
};

/**
 * Reine Frontend-ProtectedRoute:
 * Schützt UI-Bereiche im Browser (kein Ersatz für Backend-Authentifizierung).
 */
export const ProtectedRoute = ({ allowedTypes = [], onRequireAuth, fallback = null, children }) => {
    const { currentUser, isAuthenticated, routeGuardEnabled } = useAuth();

    if (!routeGuardEnabled) {
        return <>{children}</>;
    }

    const isAuthorized =
        isAuthenticated &&
        (allowedTypes.length === 0 || allowedTypes.includes(currentUser.kundenTyp));

    if (isAuthorized) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <section
            aria-label="Geschützter Bereich"
            style={{
                maxWidth: '960px',
                margin: '24px auto',
                padding: '28px 20px',
                borderRadius: '10px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2e2e2e',
                textAlign: 'center'
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(230, 43, 43, 0.15)',
                    marginBottom: '12px'
                }}
            >
                <Lock size={20} color="#ff6b6b" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>
                {isAuthenticated
                    ? 'Fehlende Berechtigung für diesen Bereich'
                    : 'Geschützter Kunden- & Kalkulationsbereich'}
            </h2>
            <p style={{ margin: '0 auto 18px', maxWidth: '540px', color: '#bbb', fontSize: '14px', lineHeight: 1.5 }}>
                {isAuthenticated
                    ? `Ihr Konto (${currentUser.kundenTyp}) ist für diese Ansicht nicht freigeschaltet.`
                    : 'Bitte melden Sie sich mit Ihrem Kundenkonto an oder registrieren Sie ein Konto, um Kalkulator, Richtpreise und Direkt-Buchung zu nutzen.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    onClick={() => onRequireAuth?.('login')}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#e62b2b',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    Jetzt einloggen
                </button>
                <button
                    type="button"
                    onClick={() => onRequireAuth?.('register')}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: '1px solid #444',
                        backgroundColor: '#242424',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    Konto registrieren
                </button>
            </div>
        </section>
    );
};

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