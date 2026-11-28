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

import ImmobilienFilterBar from "../components/ImmobilienFilterBar.jsx";
import KundenObjektVergleich from "../components/KundenObjektVergleich.jsx";
import MaklerDashboard from "../components/MaklerDashboard.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const STORAGE_KEY_INSERATE = "titocci_immobilien_inserate";
const STORAGE_KEY_FAVORITES = "titocci_immobilien_favoriten";
const STORAGE_KEY_REVIEWS = "titocci_immobilien_reviews";
const STORAGE_KEY_NOTIFICATIONS = "titocci_immobilien_notifications";
const STORAGE_KEY_LEADS = "titocci_immobilien_leads";

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

    // Neue States für Kunden- und Makleransicht & Filter
    const [activeMainTab, setActiveMainTab] = useState("kunden"); // "kunden" | "makler"
    const [comparedIds, setComparedIds] = useState([]);
    const [showCompareView, setShowCompareView] = useState(false);
    const [filters, setFilters] = useState({
        ortQuery: "",
        minZimmer: "",
        minPreis: "",
        maxPreis: "",
        metallFeature: "alle",
        sortierung: "neu"
    });

    const [leads, setLeads] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_LEADS);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // Fallback auf Demo-Leads
        }
        return [
            {
                id: 1,
                name: "Marco Rossi (Architekturbüro Lugano)",
                email: "rossi@arch-lugano.ch",
                phone: "+41 91 922 40 10",
                objektTitle: "Attico con terrazza panoramica (Locarno TI)",
                status: "Neu",
                date: "28.11.2026",
                note: "Interesse an Besichtigung und Geländer-Offerte"
            },
            {
                id: 2,
                name: "Elena Fontana",
                email: "elena.fontana@bluewin.ch",
                phone: "+41 79 334 12 88",
                objektTitle: "Rustico ristrutturato con giardino (Avegno TI)",
                status: "Besichtigung",
                date: "27.11.2026",
                note: "Besichtigungstermin vor Ort für Samstag vereinbart"
            }
        ];
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [leads]);

    const [newTitle, setNewTitle] = useState("");
    const [newOrt, setNewOrt] = useState("Locarno TI");
    const [newPreis, setNewPreis] = useState("850'000 CHF");
    const [newZimmer, setNewZimmer] = useState("4.5 Zimmer");
    const [newFlaeche, setNewFlaeche] = useState("120");
    const [newPersonen, setNewPersonen] = useState("4");
    const[startDate,setStartDate] = useState("");





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

    // Helper für Kunden- und Makleransicht
    const toggleCompare = (id) => {
        setComparedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            }
            if (prev.length >= 3) {
                alert("Sie können maximal 3 Objekte gleichzeitig vergleichen.");
                return prev;
            }
            return [...prev, id];
        });
        setShowCompareView(true);
    };

    const handleClearCompare = () => {
        setComparedIds([]);
        setShowCompareView(false);
    };

    const handleRemoveCompare = (id) => {
        setComparedIds((prev) => prev.filter((i) => i !== id));
    };

    const handleUpdateStatus = (id, newStatus) => {
        setInserate((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        pushNotification({
            title: "Inserat-Status aktualisiert",
            text: `Objekt #${id} steht nun auf "${newStatus}".`
        });
    };

    const handleCreateInseratFromMakler = (newItem) => {
        setInserate((prev) => [newItem, ...prev]);
        triggerNotification(newItem, true);
    };

    const handleUpdateLeadStatus = (leadId, newStatus) => {
        setLeads((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
    };

    const handleAddLead = (newLead) => {
        setLeads((prev) => [newLead, ...prev]);
        pushNotification({
            title: "Neuer Interessent erfasst",
            text: `${newLead.name} – ${newLead.objektTitle}`
        });
    };

    const handleBookAppointment = (item) => {
        const newLead = {
            id: Date.now(),
            name: "Online-Besichtigungsanfrage",
            email: "anfrage@kunde.ch",
            phone: "+41 91 000 00 00",
            objektTitle: `${item.title} (${item.ort})`,
            status: "Neu",
            date: new Date().toLocaleDateString("de-CH"),
            note: `Besichtigungs- & Beratungsanfrage für Objekt (${item.preis})`
        };
        setLeads((prev) => [newLead, ...prev]);
        pushNotification({
            title: "Terminanfrage übermittelt!",
            text: `Ihre Anfrage für "${item.title}" wurde erfasst. Unser Maklerteam kontaktiert Sie umgehend.`
        });
    };

    const handleResetFilters = () => {
        setFilters({
            ortQuery: "",
            minZimmer: "",
            minPreis: "",
            maxPreis: "",
            metallFeature: "alle",
            sortierung: "neu"
        });
    };

    const comparedItems = inserate.filter((item) => comparedIds.includes(item.id));

    const visibleInserate = inserate.filter((item) => {
        if (onlyFavorites && !favoriteIds.includes(item.id)) return false;

        // Filter ortQuery (Ort oder Titel)
        if (filters.ortQuery) {
            const q = filters.ortQuery.toLowerCase().trim();
            const matchOrt = (item.ort || "").toLowerCase().includes(q);
            const matchTitle = (item.title || "").toLowerCase().includes(q);
            if (!matchOrt && !matchTitle) return false;
        }

        // Filter minZimmer
        if (filters.minZimmer) {
            const reqZimmer = parseFloat(filters.minZimmer);
            const itemZimmerNum = parseFloat(String(item.zimmer).replace(",", "."));
            if (!isNaN(reqZimmer) && !isNaN(itemZimmerNum) && itemZimmerNum < reqZimmer) return false;
        }

        // Filter minPreis
        if (filters.minPreis) {
            const reqMin = parseInt(filters.minPreis, 10);
            const itemPrice = parseInt(String(item.preis).replace(/[^0-9]/g, ""), 10);
            if (!isNaN(reqMin) && !isNaN(itemPrice) && itemPrice < reqMin) return false;
        }

        // Filter maxPreis
        if (filters.maxPreis) {
            const reqMax = parseInt(filters.maxPreis, 10);
            const itemPrice = parseInt(String(item.preis).replace(/[^0-9]/g, ""), 10);
            if (!isNaN(reqMax) && !isNaN(itemPrice) && itemPrice > reqMax) return false;
        }

        // Filter metallFeature (USP)
        if (filters.metallFeature && filters.metallFeature !== "alle") {
            const textContent = `${item.title} ${item.metallbauNote || ""}`.toLowerCase();
            if (filters.metallFeature === "balkon" && !textContent.includes("balkon") && !textContent.includes("terrazza")) return false;
            if (filters.metallFeature === "gelaender" && !textContent.includes("geländer") && !textContent.includes("parapetti")) return false;
            if (filters.metallFeature === "tor" && !textContent.includes("tor") && !textContent.includes("gitter") && !textContent.includes("cancello")) return false;
        }

        // In Kundenansicht keine Entwürfe anzeigen
        if (activeMainTab === "kunden" && item.status === "Entwurf") return false;

        return true;
    }).sort((a, b) => {
        const priceA = parseInt(String(a.preis).replace(/[^0-9]/g, ""), 10) || 0;
        const priceB = parseInt(String(b.preis).replace(/[^0-9]/g, ""), 10) || 0;
        const flaecheA = parseInt(String(a.flaeche).replace(/[^0-9]/g, ""), 10) || 0;
        const flaecheB = parseInt(String(b.flaeche).replace(/[^0-9]/g, ""), 10) || 0;

        if (filters.sortierung === "preis_asc") return priceA - priceB;
        if (filters.sortierung === "preis_desc") return priceB - priceA;
        if (filters.sortierung === "flaeche_desc") return flaecheB - flaecheA;
        return b.id - a.id;
    });

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

                {/* Rollen-Umschaltung: Kundenansicht vs. Makler-Cockpit */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        margin: "24px 0 20px",
                        backgroundColor: "#181818",
                        border: "1px solid #2e2e2e",
                        borderRadius: "10px",
                        padding: "8px 12px"
                    }}
                >
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={() => setActiveMainTab("kunden")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "9px 16px",
                                borderRadius: "7px",
                                border: activeMainTab === "kunden" ? "1px solid #e62b2b" : "1px solid transparent",
                                backgroundColor: activeMainTab === "kunden" ? "#381414" : "transparent",
                                color: activeMainTab === "kunden" ? "#ff7b7b" : "#aaa",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                            }}
                        >
                            <Building2 size={16} />
                            <span>Kundenansicht &amp; Suche</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveMainTab("makler")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "9px 16px",
                                borderRadius: "7px",
                                border: activeMainTab === "makler" ? "1px solid #e62b2b" : "1px solid transparent",
                                backgroundColor: activeMainTab === "makler" ? "#381414" : "transparent",
                                color: activeMainTab === "makler" ? "#ff7b7b" : "#aaa",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                            }}
                        >
                            <Users size={16} />
                            <span>Makler-Cockpit &amp; CRM</span>
                            {leads.filter((l) => l.status === "Neu").length > 0 && (
                                <span
                                    style={{
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        borderRadius: "999px",
                                        padding: "1px 7px",
                                        fontSize: "11px"
                                    }}
                                >
                                    {leads.filter((l) => l.status === "Neu").length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeMainTab === "kunden" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button
                                type="button"
                                onClick={() => setShowCompareView((prev) => !prev)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "7px 12px",
                                    borderRadius: "6px",
                                    border: comparedIds.length > 0 ? "1px solid #e62b2b" : "1px solid #383838",
                                    backgroundColor: comparedIds.length > 0 ? "#2d1616" : "#222",
                                    color: comparedIds.length > 0 ? "#ff8b8b" : "#bbb",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                <CheckCircle2 size={14} color={comparedIds.length > 0 ? "#e62b2b" : "#888"} />
                                <span>Objekt-Vergleich ({comparedIds.length}/3)</span>
                            </button>
                        </div>
                    )}
                </div>

                {activeMainTab === "makler" ? (
                    <MaklerDashboard
                        inserate={inserate}
                        onUpdateStatus={handleUpdateStatus}
                        onCreateInserat={handleCreateInseratFromMakler}
                        onDeleteInserat={handleDeleteInserat}
                        leads={leads}
                        onUpdateLeadStatus={handleUpdateLeadStatus}
                        onAddLead={handleAddLead}
                        lang={lang}
                    />
                ) : (
                    <>
                        {/* Intelligente FilterBar mit Autocomplete */}
                        <ImmobilienFilterBar
                            filters={filters}
                            onChangeFilters={setFilters}
                            onReset={handleResetFilters}
                            totalCount={visibleInserate.length}
                            lang={lang}
                        />

                        {/* Objekt-Vergleich (wenn aktiv und Elemente ausgewählt) */}
                        {showCompareView && comparedItems.length > 0 && (
                            <KundenObjektVergleich
                                comparedItems={comparedItems}
                                onRemove={handleRemoveCompare}
                                onClear={handleClearCompare}
                                onBookAppointment={handleBookAppointment}
                                lang={lang}
                            />
                        )}

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
                            <label htmlFor="startDate">Startdatum</label>
                            <input
                              id="startDate"
                              type="date"
                              value={startDate}
                              required
                              onChange={(e) => {setStartDate(e.target.value)}}
                              style={{
                                  width: "100%",
                                  padding: "9px 13px",
                                  borderRadius: "14px",
                                  border: "1px solid #383838",
                                  color: "#ffffff", // ggf. an dein Theme anpassen
                                  backgroundColor: "transparent", // optional: falls dunkler Hintergrund gewünscht
                                  boxSizing: "border-box",
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
                                    <div style={{ position: "relative", height: "190px", backgroundColor: "#121212" }}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                        />
                                        {item.tag && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    left: "10px",
                                                    backgroundColor: "rgba(17, 17, 17, 0.85)",
                                                    color: "#fff",
                                                    padding: "4px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "11px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {item.tag}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(item)}
                                            aria-label={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                border: "1px solid #3a3a3a",
                                                backgroundColor: "rgba(17, 17, 17, 0.85)",
                                                display: "grid",
                                                placeItems: "center",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <Heart
                                                size={17}
                                                fill={isFavorite ? "#f43f5e" : "none"}
                                                color="#f43f5e"
                                            />
                                        </button>
                                    </div>

                                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px" }}>
                                            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{item.title}</h3>
                                            <strong style={{ color: "#ff6b6b", whiteSpace: "nowrap" }}>{item.preis}</strong>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#bbb", fontSize: "13px" }}>
                                            <MapPin size={14} color="#ff6b6b" />
                                            <span>{item.ort}</span>
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "12px", color: "#d4d4d4" }}>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <Building2 size={13} /> {item.zimmer}
                                            </span>
                                            <span>{item.flaeche}</span>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <Users size={13} /> {item.personen}
                                            </span>
                                            {item.startDate && <span>Ab {item.startDate}</span>}
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#facc15" }}>
                                            <Star size={14} fill="#facc15" color="#facc15" />
                                            <span>
                                                {ratingInfo.count > 0
                                                    ? `${ratingInfo.avg} / 5 (${ratingInfo.count} Bewertung${ratingInfo.count === 1 ? "" : "en"})`
                                                    : "Noch keine Bewertungen"}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                                            <button
                                                type="button"
                                                onClick={() => toggleStreetView(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "8px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #383838",
                                                    backgroundColor: isStreetViewOpen ? "#262626" : "#141414",
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Compass size={14} />
                                                <span>{isStreetViewOpen ? "Karte schließen" : "Karte / Ansicht"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openReviewPopup(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "8px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #383838",
                                                    backgroundColor: "#141414",
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <MessageSquarePlus size={14} />
                                                <span>Bewerten</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => toggleCompare(item.id)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "8px 10px",
                                                    borderRadius: "6px",
                                                    border: comparedIds.includes(item.id) ? "1px solid #e62b2b" : "1px solid #383838",
                                                    backgroundColor: comparedIds.includes(item.id) ? "#3a1414" : "#141414",
                                                    color: comparedIds.includes(item.id) ? "#ff7b7b" : "#ccc",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <CheckCircle2 size={13} color={comparedIds.includes(item.id) ? "#e62b2b" : "#888"} />
                                                <span>{comparedIds.includes(item.id) ? "Im Vergleich" : "+ Vergleichen"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleBookAppointment(item)}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "8px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #e62b2b",
                                                    backgroundColor: "#2a1212",
                                                    color: "#ff8b8b",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <span>Besichtigung</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteInserat(item.id)}
                                                aria-label="Inserat löschen"
                                                style={{
                                                    marginLeft: "auto",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    padding: "8px 10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #451a1a",
                                                    backgroundColor: "#241111",
                                                    color: "#fca5a5",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {isStreetViewOpen && (
                                            <div style={{ marginTop: "10px", borderTop: "1px solid #2a2a2a", paddingTop: "10px" }}>
                                                <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMapMode(item.id, "streetview")}
                                                        style={{
                                                            padding: "5px 9px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #383838",
                                                            backgroundColor: activeMode === "streetview" ? "#e62b2b" : "#141414",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        {mapUrls.hasApiKey ? "Street View" : "Satellit"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMapMode(item.id, "place")}
                                                        style={{
                                                            padding: "5px 9px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #383838",
                                                            backgroundColor: activeMode === "place" ? "#e62b2b" : "#141414",
                                                            color: "#fff",
                                                            fontSize: "11px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Ort / Karte
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openInGoogleMaps(item.ort)}
                                                        style={{
                                                            marginLeft: "auto",
                                                            padding: "5px 9px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #383838",
                                                            backgroundColor: "#141414",
                                                            color: "#93c5fd",
                                                            fontSize: "11px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Google Maps ↗
                                                    </button>
                                                </div>

                                                <iframe
                                                    title={`${item.title} – ${item.ort}`}
                                                    src={activeIframeSrc}
                                                    width="100%"
                                                    height="190"
                                                    style={{ border: 0, borderRadius: "6px" }}
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
            </>
        )}
    </div>

            {/* Live-Toast unten rechts */}
            {notification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        maxWidth: "360px",
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #e62b2b",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                        zIndex: 40
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "14px" }}>
                            <CheckCircle2 size={16} color="#4ade80" />
                            <span>{notification.title}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotification(null)}
                            aria-label="Benachrichtigung schließen"
                            style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 0 }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <p style={{ margin: "6px 0 4px", fontSize: "13px", color: "#e5e5e5" }}>{notification.text}</p>
                    {notification.meta && (
                        <div style={{ fontSize: "11px", color: "#a3a3a3" }}>{notification.meta}</div>
                    )}
                </div>
            )}

            {/* Modal: Neuigkeiten / Benachrichtigungen */}
            {isInfoPopupOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.75)",
                        display: "grid",
                        placeItems: "center",
                        padding: "16px",
                        zIndex: 50
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "520px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "20px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Neuigkeiten &amp; Aktivitäten</h2>
                            <button
                                type="button"
                                onClick={closeInfoPopup}
                                aria-label="Schließen"
                                style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                            <button
                                type="button"
                                onClick={markAllNotificationsRead}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#141414",
                                    color: "#fff",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                <CheckCheck size={14} /> Alle als gelesen markieren
                            </button>
                            <button
                                type="button"
                                onClick={clearNotifications}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #451a1a",
                                    backgroundColor: "#241111",
                                    color: "#fca5a5",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                Verlauf leeren
                            </button>
                        </div>

                        {notifications.length === 0 ? (
                            <p style={{ color: "#aaa", fontSize: "13px" }}>Keine Benachrichtigungen vorhanden.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        style={{
                                            padding: "12px",
                                            borderRadius: "8px",
                                            backgroundColor: n.unread ? "#241717" : "#141414",
                                            border: n.unread ? "1px solid #7f1d1d" : "1px solid #282828"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold" }}>
                                            <span>{n.title}</span>
                                            <span style={{ color: "#999", fontSize: "11px" }}>{n.createdAt}</span>
                                        </div>
                                        <p style={{ margin: "4px 0", fontSize: "12px", color: "#ddd" }}>{n.text}</p>
                                        {n.meta && <div style={{ fontSize: "11px", color: "#999" }}>{n.meta}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Bewertungen */}
            {activeReviewInserat && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.75)",
                        display: "grid",
                        placeItems: "center",
                        padding: "16px",
                        zIndex: 50
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "82vh",
                            overflowY: "auto",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "20px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0, fontSize: "1.15rem" }}>
                                Bewertungen – {activeReviewInserat.title}
                            </h2>
                            <button
                                type="button"
                                onClick={closeReviewPopup}
                                aria-label="Bewertungsfenster schließen"
                                style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                            <input
                                type="text"
                                value={reviewAuthor}
                                onChange={(e) => setReviewAuthor(e.target.value)}
                                placeholder="Dein Name (optional)"
                                style={{
                                    padding: "8px 10px",
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
                                    padding: "8px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: "#121212",
                                    color: "#fff"
                                }}
                            >
                                <option value={5}>5 Sterne – Ausgezeichnet</option>
                                <option value={4}>4 Sterne – Sehr gut</option>
                                <option value={3}>3 Sterne – In Ordnung</option>
                                <option value={2}>2 Sterne – Weniger gut</option>
                                <option value={1}>1 Stern – Nicht empfehlenswert</option>
                            </select>
                            <textarea
                                rows={3}
                                required
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Deine Bewertung zum Objekt..."
                                style={{
                                    padding: "8px 10px",
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
                                    padding: "9px 12px",
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

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {activeReviews.length === 0 ? (
                                <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>Noch keine Bewertungen vorhanden.</p>
                            ) : (
                                activeReviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        style={{
                                            padding: "10px 12px",
                                            borderRadius: "8px",
                                            backgroundColor: "#141414",
                                            border: "1px solid #282828"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                                            <strong>{rev.author}</strong>
                                            <span style={{ color: "#facc15" }}>{"★".repeat(rev.rating)} ({rev.rating}/5)</span>
                                        </div>
                                        <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#e5e5e5" }}>{rev.comment}</p>
                                        <div style={{ fontSize: "11px", color: "#888" }}>{rev.createdAt}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}