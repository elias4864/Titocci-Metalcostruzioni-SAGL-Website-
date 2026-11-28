
import React, { useEffect, useState } from "react";
import {
    Calculator, LogIn, LogOut, UserPlus, Heart,
    Building2, Send, CheckCircle2, Trash2
} from "lucide-react";

const USERS_KEY = "titocci_demo_users";
const SESSION_KEY = "titocci_demo_session";
const REQUESTS_KEY = "titocci_demo_requests";

const DEMO_USERS = [
    {
        id: 101,
        kundenTyp: "Immobilienverwaltung",
        firmaOderName: "Verwaltung Vallemaggia SA",
        immobilienObjekt: "Residenza Avegno",
        email: "verwaltung@mock.ch",
        password: "Password123",
        favorites: []
    },
    {
        id: 102,
        kundenTyp: "Privatkunde",
        firmaOderName: "Luca Bernasconi",
        immobilienObjekt: "Casa Locarno",
        email: "luca@mock.ch",
        password: "Password123",
        favorites: []
    }
];

const GEWERKE = {
    "Parapetti & Balkongeländer": 320,
    "Treppen & Innengeländer": 290,
    "Einfahrtstore & Sicherheitsgitter": 410,
    "Areal- & Gartenzäune": 240
};

const MATERIALIEN = {
    "Stahl verzinkt + Pulver": 1.15,
    "Edelstahl V2A / V4A": 1.35,
    "Schmiedeeisen": 1.45,
    "Rohstahl": 1
};

const MONTAGE = {
    "Standard-Montage": 1,
    "Sanierung + Demontage": 1.22,
    "Kran / Gerüst / schwieriger Zugang": 1.18
};

const money = (value) =>
    Number(value || 0).toLocaleString("de-CH", {
        style: "currency",
        currency: "CHF",
        maximumFractionDigits: 2
    });

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

export default function ImmobilienPortal() {
    const [users, setUsers] = useState(() => {
        const saved = readStorage(USERS_KEY, null);
        return saved || DEMO_USERS;
    });

    const [currentUser, setCurrentUser] = useState(() => {
        return readStorage(SESSION_KEY, null);
    });

    const [requests, setRequests] = useState(() =>
        readStorage(REQUESTS_KEY, [])
    );

    const [mode, setMode] = useState("login");
    const [showAuth, setShowAuth] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [authName, setAuthName] = useState("");
    const [authObject, setAuthObject] = useState("");
    const [authType, setAuthType] = useState("Privatkunde");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");

    const [service, setService] = useState(
        "Parapetti & Balkongeländer"
    );
    const [material, setMaterial] = useState("Stahl verzinkt + Pulver");
    const [montage, setMontage] = useState("Standard-Montage");
    const [lfm, setLfm] = useState(45);
    const [eigenmittelQuote, setEigenmittelQuote] = useState(20);
    const [zinssatz, setZinssatz] = useState(1.75);

    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [bookingMessage, setBookingMessage] = useState("");

    const [editObject, setEditObject] = useState(false);
    const [objectDraft, setObjectDraft] = useState("");

    // Daten im Browser speichern
    useEffect(() => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    }, [requests]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
            setCompany(currentUser.firmaOderName || "");
            setEmail(currentUser.email || "");
            setLocation(currentUser.immobilienObjekt || "");
            setObjectDraft(currentUser.immobilienObjekt || "");
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [currentUser]);

    // Aktuellen Benutzer mit der Benutzerliste synchronisieren
    const updateUser = (updatedUser) => {
        setUsers((previous) =>
            previous.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
        setCurrentUser(updatedUser);
    };

    const openLogin = () => {
        setMode("login");
        setError("");
        setSuccess("");
        setShowAuth(true);
    };

    const login = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const found = users.find(
            (user) =>
                user.email.toLowerCase() === authEmail.trim().toLowerCase() &&
                user.password === authPassword
        );

        if (!found) {
            setError("E-Mail oder Passwort ist falsch.");
            return;
        }

        setCurrentUser(found);
        setShowAuth(false);
        setAuthPassword("");
    };

    const register = (e) => {
        e.preventDefault();
        setError("");

        if (authPassword.length < 8) {
            setError("Das Passwort muss mindestens 8 Zeichen haben.");
            return;
        }

        const cleanEmail = authEmail.trim().toLowerCase();

        if (users.some((user) => user.email.toLowerCase() === cleanEmail)) {
            setError("Diese E-Mail-Adresse ist bereits registriert.");
            return;
        }

        const newUser = {
            id: Date.now(),
            kundenTyp: authType,
            firmaOderName: authName.trim() || cleanEmail.split("@")[0],
            immobilienObjekt: authObject.trim(),
            email: cleanEmail,
            password: authPassword,
            favorites: []
        };

        setUsers((previous) => [...previous, newUser]);
        setCurrentUser(newUser);
        setShowAuth(false);
        setAuthPassword("");
    };

    const loginDemo = (demoEmail) => {
        const found = users.find((user) => user.email === demoEmail);
        if (found) {
            setCurrentUser(found);
            setShowAuth(false);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setBookingMessage("");
    };

    const saveObject = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        updateUser({
            ...currentUser,
            immobilienObjekt: objectDraft.trim()
        });

        setLocation(objectDraft.trim());
        setEditObject(false);
    };

    // Favoriten gehören zum jeweiligen Benutzer
    const toggleFavorite = (property) => {
        if (!currentUser) {
            openLogin();
            return;
        }

        const favorites = currentUser.favorites || [];
        const exists = favorites.includes(property);

        updateUser({
            ...currentUser,
            favorites: exists
                ? favorites.filter((item) => item !== property)
                : [...favorites, property]
        });
    };

    const isFavorite = (property) =>
        currentUser?.favorites?.includes(property) || false;

    // Metallbau-Kalkulator
    const total =
        Math.max(0, Number(lfm) || 0) *
        GEWERKE[service] *
        MATERIALIEN[material] *
        MONTAGE[montage];

    const equity = total * (Math.min(100, Math.max(0, Number(eigenmittelQuote) || 0)) / 100);
    const debt = total - equity;
    const yearlyInterest =
        debt * (Math.min(25, Math.max(0, Number(zinssatz) || 0)) / 100);

    // Buchungsanfrage speichern
    const submitBooking = (e) => {
        e.preventDefault();
        setBookingMessage("");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setBookingMessage("Bitte eine gültige E-Mail-Adresse eingeben.");
            return;
        }

        const newRequest = {
            id: Date.now(),
            userId: currentUser?.id || null,
            customer: company || "Gast",
            email,
            phone,
            location,
            date,
            time,
            notes,
            service,
            material,
            montage,
            lfm,
            price: total,
            createdAt: new Date().toLocaleString("de-CH")
        };

        setRequests((previous) => [newRequest, ...previous]);
        setBookingMessage("Deine Anfrage wurde gespeichert!");

        setNotes("");
    };

    const myRequests = requests.filter(
        (request) => request.userId === currentUser?.id
    );

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#111",
            color: "#f5f5f5",
            padding: "20px",
            fontFamily: "system-ui, sans-serif"
        },
        card: {
            maxWidth: "960px",
            margin: "20px auto",
            padding: "22px",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "10px"
        },
        input: {
            width: "100%",
            boxSizing: "border-box",
            padding: "11px",
            background: "#141414",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            marginTop: "6px"
        },
        button: {
            padding: "10px 15px",
            background: "#e62b2b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        label: {
            display: "block",
            color: "#bbb",
            fontSize: "13px",
            marginTop: "12px"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "14px"
        }
    };

    const field = (label, content) => (
        <div>
            <label style={styles.label}>{label}</label>
            {content}
        </div>
    );

    const input = (value, onChange, type = "text", placeholder = "") => (
        <input
            style={styles.input}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );

    const select = (value, onChange, options) => (
        <select
            style={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );

    return (
        <main style={styles.page}>
            {/* Kopfbereich */}
            <header
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    borderBottom: "1px solid #333",
                    paddingBottom: "18px"
                }}
            >
                <div>
                    <div style={{ color: "#ff6b6b", fontSize: "11px" }}>
                        B2B & IMMOBILIENPORTAL • TESSIN & SCHWEIZ
                    </div>
                    <h1 style={{ margin: "5px 0" }}>Titocci Metalcostruzioni</h1>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>
            Multisuser-Demo
          </span>
                </div>

                {currentUser ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px" }}>
              {currentUser.firmaOderName}
            </span>
                        <button style={styles.button} onClick={logout}>
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                ) : (
                    <button style={styles.button} onClick={openLogin}>
                        <LogIn size={14} /> Login / Konto
                    </button>
                )}
            </header>

            {/* Kundenprofil */}
            {currentUser && (
                <section style={styles.card}>
                    <h2>
                        <Building2 size={19} color="#ff6b6b" /> Kundenprofil
                    </h2>

                    <p><b>{currentUser.firmaOderName}</b></p>
                    <p style={{ color: "#aaa" }}>{currentUser.email}</p>
                    <p style={{ color: "#aaa" }}>{currentUser.kundenTyp}</p>

                    <hr style={{ borderColor: "#333" }} />

                    <h3>Mein Immobilienobjekt</h3>

                    {editObject ? (
                        <form onSubmit={saveObject}>
                            {input(objectDraft, setObjectDraft, "text", "Immobilienobjekt")}
                            <button style={{ ...styles.button, marginTop: "10px" }}>
                                Speichern
                            </button>
                        </form>
                    ) : (
                        <>
                            <p>{currentUser.immobilienObjekt || "Kein Objekt hinterlegt"}</p>
                            <button
                                style={styles.button}
                                onClick={() => setEditObject(true)}
                            >
                                Objekt bearbeiten
                            </button>
                        </>
                    )}

                    <hr style={{ borderColor: "#333" }} />

                    <h3>
                        <Heart size={17} color="#f43f5e" /> Meine Favoriten
                    </h3>

                    {["Casa Locarno", "Residenza Avegno", "Villa Lugano"].map((property) => (
                        <div
                            key={property}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "9px",
                                borderBottom: "1px solid #333"
                            }}
                        >
                            <span>{property}</span>
                            <button
                                onClick={() => toggleFavorite(property)}
                                style={{
                                    ...styles.button,
                                    background: isFavorite(property) ? "#f43f5e" : "#333"
                                }}
                            >
                                <Heart size={14} fill={isFavorite(property) ? "white" : "none"} />
                                {isFavorite(property) ? "Gemerkt" : "Merken"}
                            </button>
                        </div>
                    ))}
                </section>
            )}

            {/* Metallbau-Rechner */}
            <section style={styles.card}>
                <h2>
                    <Calculator size={20} color="#e62b2b" /> Metallbau- & Finanzierungsrechner
                </h2>

                <div style={styles.grid}>
                    {field("Gewerk", select(service, setService, Object.keys(GEWERKE)))}
                    {field("Material", select(material, setMaterial, Object.keys(MATERIALIEN)))}
                    {field("Montage", select(montage, setMontage, Object.keys(MONTAGE)))}
                    {field("Laufmeter (lfm)", input(lfm, setLfm, "number"))}
                    {field("Eigenmittelquote (%)", input(eigenmittelQuote, setEigenmittelQuote, "number"))}
                    {field("Zinssatz (% p.a.)", input(zinssatz, setZinssatz, "number"))}
                </div>

                <div style={{ ...styles.grid, marginTop: "20px" }}>
                    {[
                        ["Richtpreis Metallbau", total],
                        ["Eigenmittel", equity],
                        ["Fremdkapital", debt],
                        ["Zins pro Jahr", yearlyInterest]
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            style={{
                                background: "#141414",
                                border: "1px solid #383838",
                                borderRadius: "8px",
                                padding: "15px",
                                textAlign: "center"
                            }}
                        >
                            <div style={{ color: "#aaa", fontSize: "12px" }}>{label}</div>
                            <strong style={{ fontSize: "18px" }}>{money(value)}</strong>
                        </div>
                    ))}
                </div>
            </section>

            {/* Direktbuchung */}
            <section style={styles.card}>
                <h2>Direkt-Buchung: Aufmass & Beratung</h2>
                <p style={{ color: "#aaa", fontSize: "13px" }}>
                    Stelle eine Anfrage für dein Bauvorhaben.
                </p>

                <form onSubmit={submitBooking}>
                    <div style={styles.grid}>
                        {field("Firma / Name", input(company, setCompany))}
                        {field("E-Mail", input(email, setEmail, "email"))}
                        {field("Telefon", input(phone, setPhone, "tel"))}
                        {field("Objekt / Standort", input(location, setLocation))}
                        {field("Wunschdatum", input(date, setDate, "date"))}
                        {field("Wunschzeit", input(time, setTime, "time"))}
                    </div>

                    {field(
                        "Projektbeschreibung",
                        <textarea
                            style={{ ...styles.input, minHeight: "100px" }}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Beschreibe dein Projekt..."
                        />
                    )}

                    <button
                        type="submit"
                        style={{ ...styles.button, marginTop: "15px" }}
                    >
                        <Send size={15} /> Anfrage speichern
                    </button>

                    {bookingMessage && (
                        <p style={{ color: "#4ade80" }}>{bookingMessage}</p>
                    )}
                </form>
            </section>

            {/* Eigene Anfragen */}
            {currentUser && (
                <section style={styles.card}>
                    <h2>Meine Buchungsanfragen ({myRequests.length})</h2>

                    {myRequests.length === 0 ? (
                        <p style={{ color: "#aaa" }}>Du hast noch keine Anfragen erstellt.</p>
                    ) : (
                        myRequests.map((request) => (
                            <div
                                key={request.id}
                                style={{
                                    padding: "13px",
                                    marginTop: "10px",
                                    background: "#141414",
                                    border: "1px solid #333",
                                    borderRadius: "7px"
                                }}
                            >
                                <b>{request.service}</b>
                                <p style={{ color: "#aaa", fontSize: "13px" }}>
                                    {request.location} • {request.date || "Kein Datum"}
                                </p>
                                <p>{money(request.price)}</p>
                                <p style={{ color: "#aaa", fontSize: "12px" }}>
                                    {request.createdAt}
                                </p>
                            </div>
                        ))
                    )}
                </section>
            )}

            {/* Login und Registrierung */}
            {showAuth && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "15px",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "440px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            background: "#1b1b1b",
                            border: "1px solid #444",
                            borderRadius: "10px",
                            padding: "22px"
                        }}
                    >
                        <h2>{mode === "login" ? "Login" : "Konto registrieren"}</h2>

                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                style={{ ...styles.button, flex: 1, background: mode === "login" ? "#e62b2b" : "#333" }}
                                onClick={() => { setMode("login"); setError(""); }}
                            >
                                Login
                            </button>
                            <button
                                style={{ ...styles.button, flex: 1, background: mode === "register" ? "#e62b2b" : "#333" }}
                                onClick={() => { setMode("register"); setError(""); }}
                            >
                                Registrieren
                            </button>
                        </div>

                        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

                        <form onSubmit={mode === "login" ? login : register}>
                            {mode === "register" && (
                                <>
                                    {field(
                                        "Kundentyp",
                                        select(authType, setAuthType, ["Privatkunde", "Immobilienverwaltung"])
                                    )}
                                    {field("Firma / Name", input(authName, setAuthName))}
                                    {field("Immobilienobjekt", input(authObject, setAuthObject))}
                                </>
                            )}

                            {field("E-Mail", input(authEmail, setAuthEmail, "email"))}
                            {field("Passwort", input(authPassword, setAuthPassword, "password"))}

                            <button
                                type="submit"
                                style={{ ...styles.button, width: "100%", marginTop: "18px" }}
                            >
                                {mode === "login" ? (
                                    <><LogIn size={15} /> Einloggen</>
                                ) : (
                                    <><UserPlus size={15} /> Konto erstellen</>
                                )}
                            </button>
                        </form>

                        {mode === "login" && (
                            <div style={{ marginTop: "20px", borderTop: "1px solid #444", paddingTop: "12px" }}>
                                <b>Demo-Konten</b>
                                <p style={{ color: "#aaa", fontSize: "12px" }}>
                                    Passwort für beide Konten: Password123
                                </p>

                                {DEMO_USERS.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => loginDemo(user.email)}
                                        style={{
                                            ...styles.button,
                                            width: "100%",
                                            marginTop: "8px",
                                            background: "#333"
                                        }}
                                    >
                                        {user.firmaOderName}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowAuth(false)}
                            style={{
                                ...styles.button,
                                width: "100%",
                                marginTop: "12px",
                                background: "#333"
                            }}
                        >
                            Schliessen
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
