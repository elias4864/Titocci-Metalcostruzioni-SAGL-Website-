import React, { useState } from "react";
import { Link } from "react-router-dom";
import Schleifbild from "../assets/Schleifen3.jpg";
import Impressumbild from "../assets/Impressum.jpg";
import Holztreppe from "../assets/Holztreppe.jpg";
import Seitengitter from "../assets/Seitengitter.jpg";
import Gitter4 from "../assets/Gitter4.jpg";
import Calculator from "../pages/ImobiliaCalculatori.jsx";

const ImmobilienPortal = ({ lang = "de" }) => {
    // Mehrsprachige Texte
    const translations = {
        de: {
            home: "Home",
            chiSiamo: "Über uns",
            servizi: "Leistungen",
            galeria: "Galerie",
            kontakte: "Kontakt",
            immobilien: "Immobilien & Ausschreibungen",
            calculatori: "Online Preisrechner",
            heroTag: "B2B & IMMOBILIENPORTAL • TESSIN & SCHWEIZ",
            heroTitle: "Titocci Metalcostruzioni",
            heroSubtitle: "Metallbau-Lösungen für Immobilienverwaltungen, Generalunternehmer & öffentliche Ausschreibungen.",
            filterTitle: "Objekt & Metallbau-Los konfigurieren",
            objektTyp: "Immobilientyp",
            gewerkTyp: "Metallbau-Gewerk",
            standort: "Standort / Gemeinde (z.B. Avegno, Locarno)",
            terminWunsch: "Wunschtermin Begehung / Offertphase",
            suchenBtn: "Verfügbarkeit & Richtpreis prüfen",
            tabAusschreibungen: "Aktuelle Ausschreibungen & Projekte",
            tabKunden: "Kundenansicht & Objekt-Katalog",
            tabRechner: "Kalkulator & Offertanfrage",
            statusOffen: "Offen für Offerten",
            statusInArbeit: "In Ausführung",
            bkpLabel: "BKP-Code",
            fristLabel: "Eingabefrist",
            offerteBtn: "Leistungsverzeichnis & Offerte anfordern",
            bookingTitle: "Direkt-Buchung: Aufmass & Technische Beratung vor Ort",
            bookingSub: "Wählen Sie Ihr Projektfenster – wie bei einer Hotelbuchung reservieren Sie direkt unseren Projektleiter für Ihr Objekt.",
            namePlaceholder: "Firma / Verwaltung / Name",
            emailPlaceholder: "Geschäftliche E-Mail",
            projektDetails: "Beschreiben Sie kurz das Bauvorhaben (z.B. 45 lfm Balkongeländer, Sanierung Mehrfamilienhaus)...",
            bookingSubmit: "Termin verbindlich reservieren",
            bookingSuccess: "Vielen Dank! Ihr Terminfenster für die Objektbesichtigung wurde reserviert. Wir haben Ihnen eine Bestätigung gesendet."
        },
        it: {
            home: "Home",
            chiSiamo: "Chi siamo",
            servizi: "Servizi",
            galeria: "Galleria",
            kontakte: "Contatti",
            immobilien: "Immobili & Appalti",
            calculatori: "Calcolatore online",
            heroTag: "PORTALE B2B & IMMOBILIARE • TICINO",
            heroTitle: "Titocci Metalcostruzioni",
            heroSubtitle: "Soluzioni di metalcostruzione per amministrazioni immobiliari, architetti e appalti.",
            filterTitle: "Configura Immobile e Lotto Metalcostruzione",
            objektTyp: "Tipo di immobile",
            gewerkTyp: "Opera in metallo",
            standort: "Località / Comune (es. Avegno, Locarno)",
            terminWunsch: "Data sopralluogo / Fase offerta",
            suchenBtn: "Verifica disponibilità e stima",
            tabAusschreibungen: "Appalti e Progetti Attuali",
            tabKunden: "Vista Clienti & Catalogo Oggetti",
            tabRechner: "Calcolatore & Richiesta Offerta",
            statusOffen: "Aperto per offerte",
            statusInArbeit: "In esecuzione",
            bkpLabel: "Codice CCC (BKP)",
            fristLabel: "Termine consegna",
            offerteBtn: "Richiedi capitolato e offerta",
            bookingTitle: "Prenotazione Diretta: Rilievo Misure e Consulenza",
            bookingSub: "Seleziona la fascia oraria per riservare un sopralluogo tecnico direttamente presso il tuo immobile.",
            namePlaceholder: "Azienda / Amministrazione / Nome",
            emailPlaceholder: "E-mail aziendale",
            projektDetails: "Descrivi brevemente il progetto (es. 45 ml parapetti balcone, risanamento palazzina)...",
            bookingSubmit: "Prenota sopralluogo",
            bookingSuccess: "Grazie! Il tuo appuntamento per il sopralluogo è stato registrato."
        },
        en: {
            home: "Home",
            chiSiamo: "About Us",
            servizi: "Services",
            galeria: "Gallery",
            kontakte: "Contact",
            immobilien: "Real Estate & Tenders",
            calculatori: "Online Calculator",
            heroTag: "B2B & REAL ESTATE PORTAL • TICINO",
            heroTitle: "Titocci Metalcostruzioni",
            heroSubtitle: "Architectural metalwork solutions for property managers, developers & tenders.",
            filterTitle: "Configure Property & Metalwork Package",
            objektTyp: "Property Type",
            gewerkTyp: "Metalwork Category",
            standort: "Location / Municipality (e.g. Avegno)",
            terminWunsch: "Preferred Site Visit Date",
            suchenBtn: "Check Availability & Estimate",
            tabAusschreibungen: "Active Tenders & Projects",
            tabKunden: "Client View & Property Catalog",
            tabRechner: "Calculator & Quote Request",
            statusOffen: "Open for Tenders",
            statusInArbeit: "In Progress",
            bkpLabel: "BKP Code",
            fristLabel: "Submission Deadline",
            offerteBtn: "Request Specification & Quote",
            bookingTitle: "Direct Booking: On-Site Measurement & Consultation",
            bookingSub: "Select your preferred date to book a technical site inspection for your property.",
            namePlaceholder: "Company / Property Management / Name",
            emailPlaceholder: "Business Email",
            projektDetails: "Briefly describe the project scope (e.g., 45m balcony railings, apartment renovation)...",
            bookingSubmit: "Reserve Appointment",
            bookingSuccess: "Thank you! Your on-site inspection slot has been reserved."
        },
        fr: {
            home: "Accueil",
            chiSiamo: "À propos",
            servizi: "Services",
            galeria: "Galerie",
            kontakte: "Contact",
            immobilien: "Immobilier & Appels d'offres",
            calculatori: "Calculateur en ligne",
            heroTag: "PORTAIL B2B & IMMOBILIER • TESSIN",
            heroTitle: "Titocci Metalcostruzioni",
            heroSubtitle: "Solutions de construction métallique pour régies immobilières et appels d'offres.",
            filterTitle: "Configurer le bien et le lot métallerie",
            objektTyp: "Type de bien immobilier",
            gewerkTyp: "Ouvrage métallique",
            standort: "Lieu / Commune (ex. Avegno)",
            terminWunsch: "Date souhaitée pour visite",
            suchenBtn: "Vérifier disponibilité & estimation",
            tabAusschreibungen: "Appels d'offres & Projets",
            tabKunden: "Vue Clients & Catalogue",
            tabRechner: "Calculateur & Demande d'offre",
            statusOffen: "Ouvert aux offres",
            statusInArbeit: "En cours",
            bkpLabel: "Code CFC (BKP)",
            fristLabel: "Délai de soumission",
            offerteBtn: "Demander le cahier des charges",
            bookingTitle: "Réservation Directe : Prise de mesures sur site",
            bookingSub: "Réservez directement un créneau avec notre chef de projet pour votre bien immobilier.",
            namePlaceholder: "Entreprise / Régie / Nom",
            emailPlaceholder: "E-mail professionnel",
            projektDetails: "Décrivez brièvement le projet...",
            bookingSubmit: "Réserver le rendez-vous",
            bookingSuccess: "Merci ! Votre rendez-vous sur site a bien été réservé."
        }
    };

    const t = translations[lang] || translations.de;

    // States für Tabs, Booking-Filter und Ausschreibungen
    const [activeTab, setActiveTab] = useState("ausschreibungen");
    const [selectedPropertyType, setSelectedPropertyType] = useState("Mehrfamilienhaus / Wohnbau");
    const [selectedService, setSelectedService] = useState("Parapetti & Balkongeländer");
    const [locationInput, setLocationInput] = useState("Avegno / Vallemaggia");
    const [visitDate, setVisitDate] = useState("");
    const [bookingSubmitted, setBookingSubmitted] = useState(false);
    const [selectedTender, setSelectedTender] = useState(null);

    // Beispiel-Daten für Immobilienausschreibungen (BKP-konform für Schweiz/Tessin)
    const tenders = [
        {
            id: "TI-2026-084",
            title: "Residenza Valle Maggia – Balkonbrüstungen & Treppengeländer",
            location: "6670 Avegno",
            type: "Neubau Mehrfamilienhaus (12 Einheiten)",
            bkp: "BKP 272 Metallbauarbeiten",
            volume: "ca. 145 lfm Geländer + 3 Fluchttreppen",
            deadline: "15.12.2026",
            status: t.statusOffen,
            isOpen: true,
            image: Impressumbild,
            specs: ["Feuerverzinkter Stahl & Pulverbeschichtung Anthrazit", "SIA 358 Normkonformität", "Inkl. Statik & Montage vor Ort"]
        },
        {
            id: "TI-2026-091",
            title: "Villa & Gartenanlage Ascona – Sicherheitszaun & Einfahrtstor",
            location: "6612 Ascona",
            type: "Privatimmobilie / Luxussanierung",
            bkp: "BKP 421 Garten- & Einfriedungsarbeiten",
            volume: "68 lfm Schmiedeeisen-Zaun + elektrisches Schiebetor",
            deadline: "22.12.2026",
            status: t.statusOffen,
            isOpen: true,
            image: Gitter4,
            specs: ["Massanfertigung nach Architektenplan", "Motorisierter Torantrieb & Zutrittskontrolle", "Korrosionsschutz Klasse C4"]
        },
        {
            id: "TI-2026-077",
            title: "Gewerbepark Locarno – Innentreppen & Sicherheitsgitter",
            location: "6600 Locarno",
            type: "Gewerbe- & Verwaltungsgebäude",
            bkp: "BKP 272.2 Treppen & Podeste",
            volume: "4 Stockwerke Stahltreppen mit Holzstufen",
            deadline: "Laufend",
            status: t.statusInArbeit,
            isOpen: false,
            image: Holztreppe,
            specs: ["Kombination Rohstahl & Eiche massiv", "Brandschutz-Anforderungen erfüllt", "Schallentkoppelte Wandbefestigung"]
        }
    ];

    // Kundenansicht: Standardisierte Paket-Lösungen für Immobilienverwaltungen
    const clientPackages = [
        {
            title: "Parapetti & Balkonsysteme (SIA 358)",
            desc: "Komplettsanierung oder Neubau von Balkon- und Terrassenbrüstungen für Mehrfamilienhäuser. Wartungsarm, witterungsbeständig und architektonisch anpassbar.",
            priceHint: "Ab CHF 320.– / lfm inkl. Montage",
            img: Impressumbild,
            link: "https://titocci.ch/a/avegno/parapetti-ad-avegno/"
        },
        {
            title: "Treppenhaus- & Innengeländer (Ringhiere)",
            desc: "Moderne Handläufe, Absturzsicherungen und Stahltreppen für Wohn- und Geschäftshäuser. Perfekte Integration mit Holz, Glas oder Edelstahl.",
            priceHint: "Ab CHF 290.– / lfm inkl. Montage",
            img: Holztreppe,
            link: "https://titocci.ch/a/avegno/ringhiere-ad-avegno/"
        },
        {
            title: "Einfahrts- & Sicherheitsanlagen (Cancellate)",
            desc: "Automatisierte Schiebe- und Flügeltore für Wohnanlagen, Tiefgaragen und Gewerbeareale inklusive Schliessanlagen.",
            priceHint: "Richtpreis nach Aufmass",
            img: Gitter4,
            link: "https://titocci.ch/a/avegno/cancellate-in-ferro-ad-avegno/"
        },
        {
            title: "Areal- & Garteneinfriedungen",
            desc: "Massgefertigte Grundstücksabgrenzungen und Sichtschutzsysteme aus Stahl und Schmiedeeisen für gepflegte Immobilienanlagen.",
            priceHint: "Ab CHF 240.– / lfm inkl. Montage",
            img: Seitengitter,
            link: "https://titocci.ch/a/avegno/cancellate-per-giardino-ad-avegno/"
        }
    ];

    const handleBookingSearch = (e) => {
        e.preventDefault();
        setActiveTab("rechner");
        const element = document.getElementById("portal-workspace");
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    const handleDirectReservation = (e) => {
        e.preventDefault();
        setBookingSubmitted(true);
    };

    return (
        <div style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif" }}>
            {/* HERO SECTION MIT BOOKING-SUCHLEISTE */}
            <div style={{ position: "relative", width: "100%", minHeight: "720px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                {/* Navbar */}
                <nav style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 50px",
                    boxSizing: "border-box",
                    zIndex: 20,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)"
                }}>
                    <div style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "1px", color: "#e62b2b" }}>
                        TITOCCI <span style={{ color: "#fff", fontWeight: "300" }}>METALCOSTRUZIONI</span>
                    </div>
                    <ul style={{ display: "flex", listStyle: "none", gap: "28px", margin: 0, padding: 0, flexWrap: "wrap" }}>
                        <li><Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.home}</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.chiSiamo}</Link></li>
                        <li><Link to="/servizi" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.servizi}</Link></li>
                        <li><Link to="/galeria" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.galeria}</Link></li>
                        <li><span style={{ color: "white", fontWeight: "bold", borderBottom: "3px solid #e62b2b", paddingBottom: "4px", fontSize: "14px", cursor: "pointer" }}>{t.immobilien}</span></li>
                        <li><Link to="/kontakte" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.kontakte}</Link></li>
                    </ul>
                </nav>

                {/* Hintergrundbild */}
                <img
                    src={Schleifbild}
                    alt="Titocci Metalcostruzioni Immobilien"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 1
                    }}
                />
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(17,17,17,0.95) 100%)",
                    zIndex: 2
                }} />

                {/* Hero Content */}
                <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "40px auto 20px", padding: "0 20px", textAlign: "center" }}>
                    <span style={{
                        backgroundColor: "rgba(230, 43, 43, 0.2)",
                        border: "1px solid #e62b2b",
                        color: "#ff6b6b",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        letterSpacing: "1.5px"
                    }}>
                        {t.heroTag}
                    </span>
                    <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "18px 0 10px", textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
                        {t.heroTitle}
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "#cccccc", maxWidth: "750px", margin: "0 auto 40px" }}>
                        {t.heroSubtitle}
                    </p>

                    {/* BOOKING-STYLE FILTER BAR */}
                    <form onSubmit={handleBookingSearch} style={{
                        backgroundColor: "#1e1e1e",
                        border: "2px solid #e62b2b",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "15px",
                        textAlign: "left",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.7)"
                    }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>{t.objektTyp}</label>
                            <select
                                value={selectedPropertyType}
                                onChange={(e) => setSelectedPropertyType(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "6px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444" }}
                            >
                                <option>Mehrfamilienhaus / Wohnbau</option>
                                <option>Einfamilienhaus / Villa</option>
                                <option>Gewerbe- & Industriebau</option>
                                <option>Öffentliche Ausschreibung (BKP)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>{t.gewerkTyp}</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "6px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444" }}
                            >
                                <option>Parapetti & Balkongeländer</option>
                                <option>Ringhiere & Treppenanlagen</option>
                                <option>Cancellate & Automatische Tore</option>
                                <option>Garten- & Sicherheitszäune</option>
                                <option>Komplett-Los Metallbau</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>{t.standort}</label>
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "6px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>{t.terminWunsch}</label>
                            <input
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                style={{ width: "100%", padding: "11px", borderRadius: "6px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                            <button type="submit" style={{
                                width: "100%",
                                padding: "13px 18px",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}>
                                {t.suchenBtn}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* WORKSPACE: TABS FÜR AUSSCHREIBUNGEN, KUNDENANSICHT & BOOKING */}
            <div id="portal-workspace" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 80px" }}>

                {/* Tab Navigation */}
                <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #333", paddingBottom: "15px", marginBottom: "35px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => setActiveTab("ausschreibungen")}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            backgroundColor: activeTab === "ausschreibungen" ? "#e62b2b" : "#222",
                            color: "#fff"
                        }}
                    >
                        📋 {t.tabAusschreibungen}
                    </button>
                    <button
                        onClick={() => setActiveTab("kunden")}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            backgroundColor: activeTab === "kunden" ? "#e62b2b" : "#222",
                            color: "#fff"
                        }}
                    >
                        🏢 {t.tabKunden}
                    </button>
                    <button
                        onClick={() => setActiveTab("rechner")}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            backgroundColor: activeTab === "rechner" ? "#e62b2b" : "#222",
                            color: "#fff"
                        }}
                    >
                        📅 Booking & {t.tabRechner}
                    </button>
                </div>

                {/* TAB 1: IMMOBILIENAUSSCHREIBUNGEN (B2B / BKP) */}
                {activeTab === "ausschreibungen" && (
                    <div style={{ display: "grid", gap: "25px" }}>
                        {tenders.map((item) => (
                            <div key={item.id} style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                backgroundColor: "#1a1a1a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "1px solid #2e2e2e"
                            }}>
                                <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", minHeight: "230px", objectFit: "cover" }} />

                                <div style={{ padding: "25px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                                            <span style={{ fontSize: "12px", color: "#999", fontWeight: "bold" }}>REF: {item.id} • {item.location}</span>
                                            <span style={{
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                backgroundColor: item.isOpen ? "rgba(46, 204, 113, 0.15)" : "rgba(241, 196, 15, 0.15)",
                                                color: item.isOpen ? "#2ecc71" : "#f1c40f"
                                            }}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <h3 style={{ margin: "0 0 8px", fontSize: "1.4rem", color: "#fff" }}>{item.title}</h3>
                                        <p style={{ margin: "0 0 15px", color: "#bbb", fontSize: "14px" }}>{item.type} — <strong>{item.volume}</strong></p>

                                        <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#ccc", marginBottom: "15px", flexWrap: "wrap" }}>
                                            <span style={{ backgroundColor: "#262626", padding: "5px 10px", borderRadius: "5px" }}>
                                                <strong>{t.bkpLabel}:</strong> {item.bkp}
                                            </span>
                                            <span style={{ backgroundColor: "#262626", padding: "5px 10px", borderRadius: "5px" }}>
                                                <strong>{t.fristLabel}:</strong> {item.deadline}
                                            </span>
                                        </div>

                                        <ul style={{ margin: "0 0 20px", paddingLeft: "18px", color: "#aaa", fontSize: "13px" }}>
                                            {item.specs.map((spec, idx) => (
                                                <li key={idx} style={{ marginBottom: "4px" }}>{spec}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            onClick={() => {
                                                setSelectedTender(item.id);
                                                setActiveTab("rechner");
                                            }}
                                            style={{
                                                backgroundColor: "#e62b2b",
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "6px",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {t.offerteBtn} →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 2: KUNDENANSICHT (IMMOBILIEN-PAKETE & REFERENZEN) */}
                {activeTab === "kunden" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "25px" }}>
                        {clientPackages.map((pkg, index) => (
                            <div key={index} style={{
                                backgroundColor: "#1a1a1a",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "1px solid #2e2e2e",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <div>
                                    <img src={pkg.img} alt={pkg.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                    <div style={{ padding: "20px" }}>
                                        <span style={{ color: "#e62b2b", fontSize: "12px", fontWeight: "bold" }}>{pkg.priceHint}</span>
                                        <h3 style={{ margin: "8px 0 12px", fontSize: "1.2rem" }}>{pkg.title}</h3>
                                        <p style={{ color: "#bbb", fontSize: "14px", lineHeight: "1.5" }}>{pkg.desc}</p>
                                    </div>
                                </div>
                                <div style={{ padding: "0 20px 20px", display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={() => setActiveTab("rechner")}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            backgroundColor: "#e62b2b",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "6px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Termin buchen
                                    </button>
                                    <a
                                        href={pkg.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            padding: "10px 14px",
                                            backgroundColor: "#2a2a2a",
                                            color: "#fff",
                                            textDecoration: "none",
                                            borderRadius: "6px",
                                            fontSize: "13px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 3: DIREKT-BOOKING & INTEGRIERTER PREISRECHNER */}
                {activeTab === "rechner" && (
                    <div style={{ display: "grid", gap: "40px" }}>
                        {/* Booking-Formular */}
                        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
                            <h2 style={{ marginTop: 0, color: "#e62b2b" }}>{t.bookingTitle}</h2>
                            <p style={{ color: "#bbb", marginBottom: "25px" }}>{t.bookingSub}</p>

                            {selectedTender && (
                                <div style={{ backgroundColor: "#262626", padding: "10px 15px", borderRadius: "6px", marginBottom: "20px", borderLeft: "4px solid #e62b2b" }}>
                                    Ausgewählte Ausschreibung / Referenz: <strong>{selectedTender}</strong>
                                </div>
                            )}

                            {bookingSubmitted ? (
                                <div style={{ backgroundColor: "rgba(46, 204, 113, 0.15)", border: "1px solid #2ecc71", color: "#2ecc71", padding: "20px", borderRadius: "8px" }}>
                                    ✅ {t.bookingSuccess}
                                </div>
                            ) : (
                                <form onSubmit={handleDirectReservation} style={{ display: "grid", gap: "15px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px" }}>
                                        <input type="text" required placeholder={t.namePlaceholder} style={{ padding: "12px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }} />
                                        <input type="email" required placeholder={t.emailPlaceholder} style={{ padding: "12px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }} />
                                        <input type="text" defaultValue={`${selectedPropertyType} • ${locationInput}`} style={{ padding: "12px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }} />
                                    </div>
                                    <textarea rows="4" placeholder={t.projektDetails} style={{ padding: "12px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }} />
                                    <button type="submit" style={{
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        border: "none",
                                        padding: "14px 28px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        justifySelf: "start"
                                    }}>
                                        {t.bookingSubmit}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Dein bestehender Preisrechner eingebettet */}
                        <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "12px", border: "1px solid #333" }}>
                            <Calculator />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ImmobilienPortal;