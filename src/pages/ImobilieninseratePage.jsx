import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, PlusCircle, Building2, MapPin, X, CheckCircle2, Compass, Trash2, Heart, Users } from "lucide-react";

import Locarno from "../assets/Locarno.jfif";
import Steinhaus from "../assets/Steinhaus.jfif";
import Dachterasse from "../assets/Dachterasse.jpg";
import Innenhof from "../assets/Innenhof.jpg";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const STORAGE_KEY_INSERATE = "titocci_immobilien_inserate";
const STORAGE_KEY_FAVORITES = "titocci_immobilien_favoriten";

const INITIAL_INSERATE = [
    {
        id: 1,
        title: "Attico con terrazza panoramica",
        ort: "Locarno TI",
        preis: "1'180'000 CHF",
        zimmer: "4.5 Zimmer",
        flaeche: "135 m²",
        personen: "4 Personen",
        image: Dachterasse,
        tag: "Neu"
    },
    {
        id: 2,
        title: "Rustico ristrutturato con giardino",
        ort: "Avegno TI",
        preis: "890'000 CHF",
        zimmer: "5.5 Zimmer",
        flaeche: "170 m²",
        personen: "5 Personen",
        image: Steinhaus,
        tag: "Exklusiv"
    },
    {
        id: 3,
        title: "Appartamento moderno con corte interna",
        ort: "Ascona TI",
        preis: "745'000 CHF",
        zimmer: "3.5 Zimmer",
        flaeche: "102 m²",
        personen: "3 Personen",
        image: Innenhof,
        tag: "Ruhig"
    }
];

const DEMO_NEUE_INSERATE = [
    {
        title: "Residenza sul lago con balcone",
        ort: "Minusio TI",
        preis: "1'040'000 CHF",
        zimmer: "4.0 Zimmer",
        flaeche: "118 m²",
        personen: "4 Personen",
        image: Locarno,
        tag: "Neu eingestellt"
    },
    {
        title: "Casa unifamiliare moderna",
        ort: "Gordola TI",
        preis: "965'000 CHF",
        zimmer: "5.0 Zimmer",
        flaeche: "155 m²",
        personen: "5 Personen",
        image: Steinhaus,
        tag: "Neu eingestellt"
    },
    {
        title: "Loft luminoso con terrazza",
        ort: "Tenero TI",
        preis: "680'000 CHF",
        zimmer: "3.5 Zimmer",
        flaeche: "96 m²",
        personen: "2 Personen",
        image: Dachterasse,
        tag: "Neu eingestellt"
    }
];

const formatFlaeche = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "120 m²";
    return /m²/i.test(trimmed) ? trimmed : `${trimmed} m²`;
};

const formatPersonen = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "4 Personen";
    if (/person/i.test(trimmed)) return trimmed;
    const count = Number(trimmed);
    if (!Number.isNaN(count) && count === 1) return "1 Person";
    return `${trimmed} Personen`;
};

const buildMapEmbedUrls = (ort) => {
    const cleanOrt = (ort || "Locarno TI").trim();
    const encodedLocation = encodeURIComponent(cleanOrt);

    if (GOOGLE_MAPS_API_KEY) {
        const encodedKey = encodeURIComponent(GOOGLE_MAPS_API_KEY);
        return {
            streetViewSrc: `https://www.google.com/maps/embed/v1/streetview?key=${encodedKey}&location=${encodedLocation}`,
            placeSrc: `https://www.google.com/maps/embed/v1/place?key=${encodedKey}&q=${encodedLocation}`,
            hasApiKey: true
        };
    }

    return {
        streetViewSrc: `https://maps.google.com/maps?q=${encodedLocation}&t=k&z=16&output=embed`,
        placeSrc: `https://maps.google.com/maps?q=${encodedLocation}&z=15&output=embed`,
        hasApiKey: false
    };
};

const buildGoogleMapsLink = (ort) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ort || "Tessin, Schweiz")}`;

export default function ImmobilienInseratePage({ lang }) {
    const [inserate, setInserate] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_INSERATE);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // Fallback auf INITIAL_INSERATE
        }
        return INITIAL_INSERATE;
    });

    const [favoriteIds, setFavoriteIds] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch {
            // Fallback auf leere Favoritenliste
        }
        return [];
    });

    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [notification, setNotification] = useState(null);
    const [demoIndex, setDemoIndex] = useState(0);
    const [openStreetViewIds, setOpenStreetViewIds] = useState({});
    const [viewModeById, setViewModeById] = useState({});

    const [newTitle, setNewTitle] = useState("");
    const [newOrt, setNewOrt] = useState("Locarno TI");
    const [newPreis, setNewPreis] = useState("850'000 CHF");
    const [newZimmer, setNewZimmer] = useState("4.5 Zimmer");
    const [newFlaeche, setNewFlaeche] = useState("120");
    const [newPersonen, setNewPersonen] = useState("4");

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_INSERATE, JSON.stringify(inserate));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [inserate]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favoriteIds));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [favoriteIds]);

    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [notification]);

    const toggleFavorite = (item) => {
        setFavoriteIds((prev) => {
            const exists = prev.includes(item.id);
            const next = exists ? prev.filter((id) => id !== item.id) : [...prev, item.id];

            setNotification({
                id: Date.now(),
                title: exists ? "Aus Favoriten entfernt" : "Zu Favoriten hinzugefügt",
                text: `${item.title} (${item.ort})`
            });

            return next;
        });
    };

    const toggleStreetView = (id) => {
        setOpenStreetViewIds((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const setMapMode = (id, mode) => {
        setViewModeById((prev) => ({
            ...prev,
            [id]: mode
        }));
    };

    /**
     * Öffnet den Standort in einem neuen Browser-Tab auf Google Maps.
     * @param {string} location
     */
    const openInGoogleMaps = (location) => {
        const url = buildGoogleMapsLink(location);
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const triggerNotification = (item) => {
        setNotification({
            id: Date.now(),
            title: "Neues Immobilien-Inserat!",
            text: `${item.title} (${item.ort}) – ${item.preis}`
        });
    };

    const handleDeleteInserat = (id) => {
        const target = inserate.find((item) => item.id === id);
        setInserate((prev) => prev.filter((item) => item.id !== id));
        setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
        setOpenStreetViewIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        if (target) {
            setNotification({
                id: Date.now(),
                title: "Inserat wurde entfernt",
                text: `${target.title} (${target.ort})`
            });
        }
    };

    const handleAddCustomInserat = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const created = {
            id: Date.now(),
            title: newTitle.trim(),
            ort: newOrt.trim() || "Tessin TI",
            preis: newPreis.trim() || "Auf Anfrage",
            zimmer: newZimmer.trim() || "4.5 Zimmer",
            flaeche: formatFlaeche(newFlaeche),
            personen: formatPersonen(newPersonen),
            image: Locarno,
            tag: "Neu"
        };

        setInserate((prev) => [created, ...prev]);
        triggerNotification(created);
        setNewTitle("");
    };

    const handleSimulateIncomingInserat = () => {
        const template = DEMO_NEUE_INSERATE[demoIndex % DEMO_NEUE_INSERATE.length];
        setDemoIndex((prev) => prev + 1);

        const created = {
            ...template,
            id: Date.now()
        };

        setInserate((prev) => [created, ...prev]);
        triggerNotification(created);
    };

    const visibleInserate = onlyFavorites
        ? inserate.filter((item) => favoriteIds.includes(item.id))
        : inserate;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#111111",
                color: "#f5f5f5",
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "24px 20px 80px"
            }}
        >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* Kopfzeile */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        paddingBottom: "18px",
                        borderBottom: "1px solid #262626"
                    }}
                >
                    <div>
                        <div style={{ fontSize: "12px", color: "#ff6b6b", fontWeight: "bold", letterSpacing: "0.06em" }}>
                            IMMOBILIEN-INSERATE &amp; LIVE-BENACHRICHTIGUNG
                        </div>
                        <h1 style={{ margin: "4px 0 0", fontSize: "1.75rem" }}>
                            Aktuelle Immobilien-Inserate
                        </h1>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                        <button
                            type="button"
                            onClick={() => setOnlyFavorites((prev) => !prev)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: onlyFavorites ? "1px solid #f43f5e" : "1px solid #3a3a3a",
                                backgroundColor: onlyFavorites ? "#4c0519" : "#1d1d1d",
                                color: onlyFavorites ? "#fda4af" : "#fff",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            <Heart size={15} fill={onlyFavorites ? "#f43f5e" : "none"} color="#f43f5e" />
                            <span>
                                {onlyFavorites ? "Alle anzeigen" : "Favoriten"} ({favoriteIds.length})
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSimulateIncomingInserat}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            <Bell size={15} />
                            <span>Neues Inserat simulieren</span>
                        </button>

                        <Link
                            to="/"
                            style={{
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "1px solid #3a3a3a",
                                backgroundColor: "#1d1d1d",
                                color: "#fff",
                                textDecoration: "none",
                                fontSize: "13px"
                            }}
                        >
                            Zur Startseite
                        </Link>
                    </div>
                </header>

                {/* Formular zum Hinzufügen eines neuen Inserats */}
                <section
                    style={{
                        marginTop: "24px",
                        padding: "18px",
                        borderRadius: "10px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2d2d2d"
                    }}
                >
                    <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PlusCircle size={18} color="#e62b2b" />
                        <span>Neues Inserat erfassen</span>
                    </h2>

                    <form
                        onSubmit={handleAddCustomInserat}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
                            gap: "10px",
                            alignItems: "end"
                        }}
                    >
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Objekttitel
                            </label>
                            <input
                                type="text"
                                required
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="z.B. Wohnung mit Balkon"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Ort
                            </label>
                            <input
                                type="text"
                                value={newOrt}
                                onChange={(e) => setNewOrt(e.target.value)}
                                placeholder="z.B. Locarno TI"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Preis
                            </label>
                            <input
                                type="text"
                                value={newPreis}
                                onChange={(e) => setNewPreis(e.target.value)}
                                placeholder="z.B. 850'000 CHF"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Quadratmeter (m²)
                            </label>
                            <input
                                type="text"
                                value={newFlaeche}
                                onChange={(e) => setNewFlaeche(e.target.value)}
                                placeholder="z.B. 120"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Anzahl Personen im Haus
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={newPersonen}
                                onChange={(e) => setNewPersonen(e.target.value)}
                                placeholder="z.B. 4"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>
                                Zimmer
                            </label>
                            <input
                                type="text"
                                value={newZimmer}
                                onChange={(e) => setNewZimmer(e.target.value)}
                                placeholder="z.B. 4.5 Zimmer"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Inserat veröffentlichen
                        </button>
                    </form>
                </section>

                {/* Inserate-Karten */}
                <section
                    style={{
                        marginTop: "24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {visibleInserate.length === 0 ? (
                        <div
                            style={{
                                gridColumn: "1 / -1",
                                padding: "32px",
                                textAlign: "center",
                                borderRadius: "10px",
                                backgroundColor: "#1a1a1a",
                                border: "1px solid #2e2e2e",
                                color: "#bbb"
                            }}
                        >
                            Noch keine Immobilien als Favorit markiert.
                        </div>
                    ) : (
                        visibleInserate.map((item) => {
                            const isFavorite = favoriteIds.includes(item.id);
                            const isStreetViewOpen = Boolean(openStreetViewIds[item.id]);
                            const activeMode = viewModeById[item.id] || "streetview";
                            const mapUrls = buildMapEmbedUrls(item.ort);
                            const activeIframeSrc =
                                activeMode === "place" ? mapUrls.placeSrc : mapUrls.streetViewSrc;

                            return (
                                <article
                                    key={item.id}
                                    style={{
                                        backgroundColor: "#1a1a1a",
                                        border: isFavorite ? "1px solid #f43f5e" : "1px solid #2e2e2e",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                >
                                    <div style={{ position: "relative", height: "190px" }}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                left: "10px",
                                                backgroundColor: "#e62b2b",
                                                color: "#fff",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                                padding: "4px 8px",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            {item.tag || "Inserat"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteInserat(item.id)}
                                            aria-label={`Inserat ${item.title} entfernen`}
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                padding: "5px 9px",
                                                borderRadius: "5px",
                                                border: "1px solid rgba(255,255,255,0.18)",
                                                backgroundColor: "rgba(17,17,17,0.82)",
                                                color: "#ff8577",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <Trash2 size={12} />
                                            <span>Entfernen</span>
                                        </button>
                                    </div>

                                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
                                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{item.title}</h3>

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#bbb", fontSize: "13px" }}>
                                            <MapPin size={14} color="#ff6b6b" />
                                            <span>{item.ort}</span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#bbb", fontSize: "13px" }}>
                                            <Building2 size={14} color="#ff6b6b" />
                                            <span>{item.zimmer} • {item.flaeche || "120 m²"}</span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#bbb", fontSize: "13px" }}>
                                            <Users size={14} color="#ff6b6b" />
                                            <span>{item.personen || "4 Personen"} im Haus</span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "4px" }}>
                                            <button
                                                type="button"
                                                onClick={() => toggleFavorite(item)}
                                                aria-pressed={isFavorite}
                                                aria-label={
                                                    isFavorite
                                                        ? `${item.title} aus Favoriten entfernen`
                                                        : `${item.title} als Favorit speichern`
                                                }
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    border: isFavorite ? "1px solid #f43f5e" : "1px solid #3c3c3c",
                                                    backgroundColor: isFavorite ? "#4c0519" : "#242424",
                                                    color: isFavorite ? "#fda4af" : "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: isFavorite ? "bold" : "normal",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Heart
                                                    size={13}
                                                    fill={isFavorite ? "#f43f5e" : "none"}
                                                    color={isFavorite ? "#f43f5e" : "#fff"}
                                                />
                                                <span>{isFavorite ? "Favorit" : "Liken"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => toggleStreetView(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #3c3c3c",
                                                    backgroundColor: isStreetViewOpen ? "#e62b2b" : "#242424",
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Compass size={13} />
                                                <span>{isStreetViewOpen ? "360° schliessen" : "Google Street View 360°"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openInGoogleMaps(item.ort)}
                                                style={{
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #3c3c3c",
                                                    backgroundColor: "#181818",
                                                    color: "#93c5fd",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Auf Google Maps öffnen
                                            </button>
                                        </div>

                                        {isStreetViewOpen && (
                                            <div style={{ marginTop: "6px", borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        padding: "6px 10px",
                                                        backgroundColor: "#151515",
                                                        borderBottom: "1px solid #2b2b2b",
                                                        fontSize: "11px"
                                                    }}
                                                >
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMapMode(item.id, "streetview")}
                                                            style={{
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                backgroundColor: activeMode === "streetview" ? "#e62b2b" : "#262626",
                                                                color: "#fff",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Street View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setMapMode(item.id, "place")}
                                                            style={{
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                backgroundColor: activeMode === "place" ? "#e62b2b" : "#262626",
                                                                color: "#fff",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Karte
                                                        </button>
                                                    </div>
                                                    {!mapUrls.hasApiKey && (
                                                        <span style={{ color: "#aaa" }}>Fallback-Karte (ohne API-Key)</span>
                                                    )}
                                                </div>

                                                <iframe
                                                    title={`Google Maps (${activeMode}) – ${item.title}`}
                                                    src={activeIframeSrc}
                                                    width="100%"
                                                    height="210"
                                                    style={{ border: 0, display: "block" }}
                                                    loading="lazy"
                                                    allowFullScreen
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                />
                                            </div>
                                        )}

                                        <div style={{ marginTop: "auto", paddingTop: "10px", fontSize: "1.1rem", fontWeight: "bold", color: "#4ade80" }}>
                                            {item.preis}
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </section>
            </div>

            {/* Notification Popup bei neuem Immobilien-Inserat */}
            {notification && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        maxWidth: "360px",
                        width: "calc(100% - 40px)",
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #e62b2b",
                        borderLeft: "5px solid #e62b2b",
                        borderRadius: "8px",
                        padding: "14px 16px",
                        boxShadow: "0 10px 28px rgba(0,0,0,0.55)",
                        zIndex: 999,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px"
                    }}
                >
                    <CheckCircle2 size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
                            {notification.title}
                        </div>
                        <div style={{ fontSize: "13px", color: "#ddd", marginTop: "3px" }}>
                            {notification.text}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setNotification(null)}
                        aria-label="Benachrichtigung schliessen"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#aaa",
                            cursor: "pointer",
                            padding: "2px"
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}