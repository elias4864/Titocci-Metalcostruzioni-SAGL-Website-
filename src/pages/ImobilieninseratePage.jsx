import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Bell,
    PlusCircle,
    Building2,
    MapPin,
    X,
    CheckCircle2,
    Compass,
    Trash2,
    Heart,
    Users,
    Star,
    MessageSquarePlus,
    Sparkles,
    CheckCheck
} from "lucide-react";

import Locarno from "../assets/Locarno.jfif";
import Steinhaus from "../assets/Steinhaus.jfif";
import Dachterasse from "../assets/Dachterasse.jpg";
import Innenhof from "../assets/Innenhof.jpg";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const STORAGE_KEY_INSERATE = "titocci_immobilien_inserate";
const STORAGE_KEY_FAVORITES = "titocci_immobilien_favoriten";
const STORAGE_KEY_REVIEWS = "titocci_immobilien_reviews";
const STORAGE_KEY_NOTIFICATIONS = "titocci_immobilien_notifications";

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

const INITIAL_REVIEWS = {
    1: [
        {
            id: 1001,
            author: "Marco Conti",
            rating: 5,
            comment: "Fantastische Aussicht auf den See und sehr gepflegte Terrasse.",
            createdAt: "2026-10-12"
        }
    ]
};

const INITIAL_NOTIFICATIONS = [
    {
        id: 9001,
        title: "Willkommen bei den Immobilien-Updates",
        text: "Neue Inserate, Bewertungen und Favoriten-Änderungen werden hier gesammelt.",
        meta: "Locarno TI • Systeminfo",
        createdAt: "Heute",
        unread: true
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

    const [reviewsByInserat, setReviewsByInserat] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") return parsed;
            }
        } catch {
            // Fallback auf INITIAL_REVIEWS
        }
        return INITIAL_REVIEWS;
    });

    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch {
            // Fallback auf INITIAL_NOTIFICATIONS
        }
        return INITIAL_NOTIFICATIONS;
    });

    const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

    const [activeReviewInseratId, setActiveReviewInseratId] = useState(null);
    const [reviewAuthor, setReviewAuthor] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

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
        try {
            localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviewsByInserat));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [reviewsByInserat]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [notifications]);

    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [notification]);

    const pushNotification = ({ title, text, meta = "", openPopup = false }) => {
        const nowTime = new Date().toLocaleTimeString("de-CH", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const entry = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title,
            text,
            meta,
            createdAt: nowTime,
            unread: true
        };

        setNotification(entry);
        setNotifications((prev) => [entry, ...prev]);

        if (openPopup) {
            setIsInfoPopupOpen(true);
        }
    };

    const openInfoPopup = () => {
        setIsInfoPopupOpen(true);
    };

    const closeInfoPopup = () => {
        setIsInfoPopupOpen(false);
        setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    };

    const markAllNotificationsRead = () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter((item) => item.unread).length;

    const openReviewPopup = (inseratId) => {
        setActiveReviewInseratId(inseratId);
        setReviewRating(5);
        setReviewComment("");
    };

    const closeReviewPopup = () => {
        setActiveReviewInseratId(null);
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!activeReviewInseratId || !reviewComment.trim()) return;

        const newReview = {
            id: Date.now(),
            author: reviewAuthor.trim() || "Anonymer Besucher",
            rating: Number(reviewRating) || 5,
            comment: reviewComment.trim(),
            createdAt: new Date().toISOString().slice(0, 10)
        };

        setReviewsByInserat((prev) => {
            const currentList = Array.isArray(prev[activeReviewInseratId]) ? prev[activeReviewInseratId] : [];
            return {
                ...prev,
                [activeReviewInseratId]: [newReview, ...currentList]
            };
        });

        const targetInserat = inserate.find((item) => item.id === activeReviewInseratId);
        pushNotification({
            title: "Bewertung gespeichert",
            text: `${newReview.rating}/5 Sterne von ${newReview.author} für ${targetInserat?.title || "Inserat"}`,
            meta: targetInserat?.ort || "Tessin TI"
        });

        setReviewComment("");
    };

    const getRatingSummary = (inseratId) => {
        const list = Array.isArray(reviewsByInserat[inseratId]) ? reviewsByInserat[inseratId] : [];
        if (list.length === 0) return { avg: null, count: 0 };
        const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        return {
            avg: (sum / list.length).toFixed(1),
            count: list.length
        };
    };

    const toggleFavorite = (item) => {
        setFavoriteIds((prev) => {
            const exists = prev.includes(item.id);
            const next = exists ? prev.filter((id) => id !== item.id) : [...prev, item.id];

            pushNotification({
                title: exists ? "Aus Favoriten entfernt" : "Zu Favoriten hinzugefügt",
                text: `${item.title} – ${item.preis}`,
                meta: item.ort
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

    const openInGoogleMaps = (location) => {
        const url = buildGoogleMapsLink(location);
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const triggerNotification = (item, openPopup = false) => {
        pushNotification({
            title: "Neues Immobilien-Inserat!",
            text: `${item.title} (${item.ort}) – ${item.preis}`,
            meta: `${item.zimmer} • ${item.flaeche} • ${item.personen}`,
            openPopup
        });
    };

    const handleDeleteInserat = (id) => {
        const target = inserate.find((item) => item.id === id);
        setInserate((prev) => prev.filter((item) => item.id !== id));
        setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
        setReviewsByInserat((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        if (activeReviewInseratId === id) {
            setActiveReviewInseratId(null);
        }
        setOpenStreetViewIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        if (target) {
            pushNotification({
                title: "Inserat wurde entfernt",
                text: `${target.title} (${target.ort})`,
                meta: target.preis
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
        triggerNotification(created, true);
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
        triggerNotification(created, true);
    };

    const visibleInserate = onlyFavorites
        ? inserate.filter((item) => favoriteIds.includes(item.id))
        : inserate;

    const activeReviewInserat = inserate.find((item) => item.id === activeReviewInseratId) || null;
    const activeReviews = activeReviewInseratId
        ? reviewsByInserat[activeReviewInseratId] || []
        : [];

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#111111",
                color: "#f5f5f5",
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "24px 20px 96px"
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
                            onClick={openInfoPopup}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: unreadCount > 0 ? "1px solid #ff6b6b" : "1px solid #3a3a3a",
                                backgroundColor: unreadCount > 0 ? "#2a1414" : "#1d1d1d",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            <Sparkles size={15} color="#ff6b6b" />
                            <span>Neuigkeiten ({notifications.length})</span>
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        borderRadius: "999px",
                                        padding: "1px 7px",
                                        fontSize: "11px"
                                    }}
                                >
                                    {unreadCount} neu
                                </span>
                            )}
                        </button>

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
                            const ratingInfo = getRatingSummary(item.id);

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

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", fontSize: "13px" }}>
                                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                            <span>
                                                {ratingInfo.avg
                                                    ? `${ratingInfo.avg} / 5 (${ratingInfo.count} ${ratingInfo.count === 1 ? "Review" : "Reviews"})`
                                                    : "Noch keine Reviews"}
                                            </span>
                                        </div>

                                        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ff7b7b", marginTop: "4px" }}>
                                            {item.preis}
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                                            <button
                                                type="button"
                                                onClick={() => toggleFavorite(item)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    padding: "7px 10px",
                                                    borderRadius: "6px",
                                                    border: isFavorite ? "1px solid #f43f5e" : "1px solid #3a3a3a",
                                                    backgroundColor: isFavorite ? "#4c0519" : "#222",
                                                    color: isFavorite ? "#fda4af" : "#eee",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Heart size={13} fill={isFavorite ? "#f43f5e" : "none"} color="#f43f5e" />
                                                <span>{isFavorite ? "Favorit" : "Merken"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openReviewPopup(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    padding: "7px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #3a3a3a",
                                                    backgroundColor: "#222",
                                                    color: "#eee",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <MessageSquarePlus size={13} color="#fbbf24" />
                                                <span>Bewerten</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => toggleStreetView(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    padding: "7px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #3a3a3a",
                                                    backgroundColor: isStreetViewOpen ? "#2a2222" : "#222",
                                                    color: "#eee",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Compass size={13} color="#ff6b6b" />
                                                <span>{isStreetViewOpen ? "Karte schliessen" : "Ansicht"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openInGoogleMaps(item.ort)}
                                                style={{
                                                    padding: "7px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #3a3a3a",
                                                    backgroundColor: "transparent",
                                                    color: "#ccc",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Maps
                                            </button>
                                        </div>

                                        {isStreetViewOpen && (
                                            <div style={{ marginTop: "10px", borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}>
                                                <div style={{ display: "flex", gap: "6px", padding: "6px", backgroundColor: "#141414" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMapMode(item.id, "streetview")}
                                                        style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            border: "none",
                                                            backgroundColor: activeMode === "streetview" ? "#e62b2b" : "#262626",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Luftbild / Street
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMapMode(item.id, "place")}
                                                        style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            border: "none",
                                                            backgroundColor: activeMode === "place" ? "#e62b2b" : "#262626",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Ort
                                                    </button>
                                                </div>
                                                <iframe
                                                    title={`Karte für ${item.ort}`}
                                                    src={activeIframeSrc}
                                                    width="100%"
                                                    height="180"
                                                    style={{ border: 0, display: "block" }}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })
                    )}
                </section>
            </div>

            {/* Popup für neue Informationen & Benachrichtigungen */}
            {isInfoPopupOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Neue Informationen und Benachrichtigungen"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.72)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        zIndex: 1100
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "540px",
                            maxHeight: "82vh",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #363636",
                            borderRadius: "12px",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px 18px",
                                borderBottom: "1px solid #2b2b2b"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Bell size={18} color="#ff6b6b" />
                                <h2 style={{ margin: 0, fontSize: "1.15rem" }}>
                                    Neue Informationen &amp; Notifications
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeInfoPopup}
                                aria-label="Neuigkeiten-Popup schliessen"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#bbb",
                                    cursor: "pointer"
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "8px",
                                padding: "10px 18px",
                                backgroundColor: "#151515",
                                borderBottom: "1px solid #262626"
                            }}
                        >
                            <button
                                type="button"
                                onClick={markAllNotificationsRead}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #333",
                                    backgroundColor: "#202020",
                                    color: "#ddd",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                <CheckCheck size={14} color="#4ade80" />
                                <span>Alle als gelesen markieren</span>
                            </button>

                            <button
                                type="button"
                                onClick={clearNotifications}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #333",
                                    backgroundColor: "transparent",
                                    color: "#ff8577",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                Verlauf leeren
                            </button>
                        </div>

                        <div style={{ padding: "16px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                            {notifications.length === 0 ? (
                                <p style={{ margin: 0, color: "#aaa", textAlign: "center", padding: "20px 0" }}>
                                    Keine aktuellen Benachrichtigungen vorhanden.
                                </p>
                            ) : (
                                notifications.map((entry) => (
                                    <div
                                        key={entry.id}
                                        style={{
                                            padding: "12px 14px",
                                            borderRadius: "8px",
                                            backgroundColor: entry.unread ? "#231717" : "#151515",
                                            border: entry.unread ? "1px solid #e62b2b" : "1px solid #2a2a2a"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                            <strong style={{ fontSize: "14px", color: "#fff" }}>
                                                {entry.unread ? "● " : ""}
                                                {entry.title}
                                            </strong>
                                            <span style={{ fontSize: "11px", color: "#999" }}>{entry.createdAt}</span>
                                        </div>
                                        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#ddd" }}>{entry.text}</p>
                                        {entry.meta && (
                                            <div style={{ marginTop: "6px", fontSize: "12px", color: "#ff8577" }}>
                                                {entry.meta}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Popup für Bewertungen */}
            {activeReviewInserat && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Bewertungen für ${activeReviewInserat.title}`}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.72)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        zIndex: 1100
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "480px",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #363636",
                            borderRadius: "12px",
                            padding: "20px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
                                Bewertung – {activeReviewInserat.title}
                            </h2>
                            <button
                                type="button"
                                onClick={closeReviewPopup}
                                aria-label="Bewertungs-Popup schliessen"
                                style={{ background: "transparent", border: "none", color: "#bbb", cursor: "pointer" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <input
                                type="text"
                                value={reviewAuthor}
                                onChange={(e) => setReviewAuthor(e.target.value)}
                                placeholder="Dein Name (optional)"
                                style={{
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff"
                                }}
                            />
                            <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                style={{
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff"
                                }}
                            >
                                <option value={5}>5 Sterne</option>
                                <option value={4}>4 Sterne</option>
                                <option value={3}>3 Sterne</option>
                                <option value={2}>2 Sterne</option>
                                <option value={1}>1 Stern</option>
                            </select>
                            <textarea
                                rows={3}
                                required
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Deine Bewertung zum Objekt..."
                                style={{
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff",
                                    resize: "vertical"
                                }}
                            />
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
                                Bewertung speichern
                            </button>
                        </form>

                        <div style={{ marginTop: "16px", maxHeight: "180px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {activeReviews.length === 0 ? (
                                <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>Noch keine Bewertungen vorhanden.</p>
                            ) : (
                                activeReviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            backgroundColor: "#131313",
                                            border: "1px solid #292929",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <strong>{rev.author}</strong>
                                            <span style={{ color: "#fbbf24" }}>{rev.rating}/5 ★</span>
                                        </div>
                                        <p style={{ margin: "4px 0 0", color: "#ccc" }}>{rev.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Kurzer Live-Toast unten rechts */}
            {notification && (
                <div
                    role="status"
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        maxWidth: "360px",
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #e62b2b",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        zIndex: 1050
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "14px" }}>
                            <CheckCircle2 size={16} color="#4ade80" />
                            <span>{notification.title}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotification(null)}
                            aria-label="Hinweis schliessen"
                            style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer" }}
                        >
                            <X size={15} />
                        </button>
                    </div>
                    <p style={{ margin: "6px 0 8px", fontSize: "13px", color: "#ddd" }}>{notification.text}</p>
                    <button
                        type="button"
                        onClick={() => {
                            setNotification(null);
                            openInfoPopup();
                        }}
                        style={{
                            padding: "4px 8px",
                            borderRadius: "5px",
                            border: "1px solid #3a3a3a",
                            backgroundColor: "#262626",
                            color: "#ff8577",
                            fontSize: "11px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Alle Neuigkeiten im Popup öffnen
                    </button>
                </div>
            )}
        </div>
    );
}