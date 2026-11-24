import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Schleifbild from "../assets/Schleifen3.jpg";
import Impressumbild from "../assets/Impressum.jpg";
import Holztreppe from "../assets/Holztreppe.jpg";
import Seitengitter from "../assets/Seitengitter.jpg";
import Gitter4 from "../assets/Gitter4.jpg";
import Calculator from "../pages/ImobiliaCalculatori.jsx";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_n9toe59";
const EMAILJS_TEMPLATE_ID = "template_mrshrnl";
const EMAILJS_PUBLIC_KEY = "dFpVpt98rEIko4TLa";

const GEWERK_CONFIG = {
    "Parapetti & Balkongeländer": {
        bkp: "BKP 272.1",
        baseRatePerLfm: 320,
        normHint: "SIA 358 Absturzsicherung"
    },
    "Treppen & Innengeländer": {
        bkp: "BKP 272.2",
        baseRatePerLfm: 290,
        normHint: "SIA 358 & Brandschutz"
    },
    "Einfahrtstore & Sicherheitsgitter": {
        bkp: "BKP 272.4",
        baseRatePerLfm: 410,
        normHint: "Antrieb & Zutrittskontrolle"
    },
    "Areal- & Gartenzäune": {
        bkp: "BKP 421",
        baseRatePerLfm: 240,
        normHint: "Korrosionsschutz C3/C4"
    }
};

const MATERIAL_FACTORS = {
    "Stahl feuerverzinkt & pulverbeschichtet": { factor: 1.15, label: "Stahl verzinkt + Pulver (RAL/Anthrazit)" },
    "Edelstahl V2A / V4A": { factor: 1.35, label: "Edelstahl (V2A / V4A)" },
    "Schmiedeeisen / Kunstschmiedearbeit": { factor: 1.45, label: "Schmiedeeisen (Massanfertigung)" },
    "Rohstahl geölt": { factor: 1.0, label: "Rohstahl (Innenbereich)" }
};

const MONTAGE_FACTORS = {
    "Standard-Montage": { factor: 1.0, label: "Standard-Montage" },
    "Sanierung inkl. Demontage & Entsorgung": { factor: 1.22, label: "Sanierung + Demontage/Entsorgung" },
    "Kran- / Gerüstbedarf / erschwerter Zugang": { factor: 1.18, label: "Kran / Gerüst / Zugang erschwert" }
};

const ABOUT_ME_PROFILE = {
    name: "Elias Kaiser",
    role: "Full-Stack & Web Developer • Immobilien- & Metallbau-Portal",
    location: "Zürich / Tessin (CH)",
    summary:
        "Entwicklung moderner Web- und Kalkulationslösungen mit Fokus auf klare Nutzerführung, B2B-Ausschreibungen, interaktive Preisrechner und saubere Frontend-/Backend-Architektur.",
    skills: ["React & Vite", "TypeScript / JavaScript", "Kalkulations- & Offert-Workflows", "SEO & Responsive UI"],
    links: [
        { label: "Portfolio", url: "https://elias-portfolio.eljourka.workers.dev" },
        { label: "GitHub", url: "https://github.com/elias4864" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/elias-kaiser-646638371" }
    ]
};

const ImmobilienPortal = ({ lang = "de" }) => {
    const translations = {
        de: {
            home: "Home",
            chiSiamo: "Über uns",
            servizi: "Leistungen",
            galeria: "Galerie",
            kontakte: "Kontakt",
            immobilien: "Immobilien & Ausschreibungen",
            loginBtn: "Login / Konto",
            logoutBtn: "Logout",
            heroTag: "B2B & IMMOBILIENPORTAL • TESSIN & SCHWEIZ",
            heroTitle: "Titocci Metalcostruzioni",
            heroSubtitle: "Metallbau-Lösungen für Immobilienverwaltungen, Generalunternehmer & öffentliche Ausschreibungen.",
            objektTyp: "Immobilientyp",
            gewerkTyp: "Metallbau-Gewerk",
            standort: "Standort / Gemeinde (z.B. Avegno, Locarno)",
            terminWunsch: "Wunschtermin Begehung / Offertphase",
            suchenBtn: "Verfügbarkeit & Richtpreis prüfen",
            tabAusschreibungen: "Aktuelle Ausschreibungen & Projekte",
            tabKunden: "Kundenansicht & Objekt-Katalog",
            tabRechner: "Kalkulator & Offertanfrage",
            tabAboutMe: "About Me & Profil",
            statusOffen: "Offen für Offerten",
            statusInArbeit: "In Ausführung",
            fristLabel: "Eingabefrist",
            offerteBtn: "Leistungsverzeichnis & Offerte anfordern",
            bookingTitle: "Direkt-Buchung: Aufmass & Technische Beratung vor Ort",
            bookingSub: "Wählen Sie Ihr Projektfenster und senden Sie Ihre Anfrage direkt per E-Mail an unser Team.",
            namePlaceholder: "Firma / Verwaltung / Name",
            emailPlaceholder: "Geschäftliche E-Mail",
            phonePlaceholder: "Telefonnummer (optional)",
            projektDetails: "Beschreiben Sie kurz das Bauvorhaben (z.B. 45 lfm Balkongeländer, Sanierung Mehrfamilienhaus)...",
            bookingSubmit: "Termin verbindlich anfragen",
            bookingSuccess: "Vielen Dank! Ihre Anfrage wurde erfolgreich per E-Mail versendet.",
            bookingError: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
        }
    };

    const t = translations[lang] || translations.de;

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("titocci_current_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [kundenTyp, setKundenTyp] = useState("Immobilienverwaltung");
    const [firmaOderName, setFirmaOderName] = useState("");
    const [immobilienObjekt, setImmobilienObjekt] = useState("");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
    const [authError, setAuthError] = useState("");
    const [authSuccess, setAuthSuccess] = useState("");

    const [activeTab, setActiveTab] = useState("ausschreibungen");
    const [selectedPropertyType, setSelectedPropertyType] = useState("Mehrfamilienhaus / Wohnbau");
    const [selectedService, setSelectedService] = useState("Parapetti & Balkongeländer");
    const [locationInput, setLocationInput] = useState("Avegno / Vallemaggia");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [selectedTender, setSelectedTender] = useState(null);

    const [lfm, setLfm] = useState(45);
    const [materialType, setMaterialType] = useState("Stahl feuerverzinkt & pulverbeschichtet");
    const [montageType, setMontageType] = useState("Standard-Montage");
    const [eigenmittelQuote, setEigenmittelQuote] = useState(20);

    const [companyName, setCompanyName] = useState(() => currentUser?.firmaOderName || "");
    const [email, setEmail] = useState(() => currentUser?.email || "");
    const [phone, setPhone] = useState("");
    const [projectNotes, setProjectNotes] = useState("");
    const [qm, setQm] = useState(120);
    const [canton, setCanton] = useState("TI");
    const [zinssatz, setZinssatz] = useState(1.75);
    const [isSending, setIsSending] = useState(false);
    const [bookingSubmitted, setBookingSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const workspaceRef = useRef(null);
    const companyInputRef = useRef(null);

    const activeGewerk = GEWERK_CONFIG[selectedService] || GEWERK_CONFIG["Parapetti & Balkongeländer"];
    const activeMaterial = MATERIAL_FACTORS[materialType] || MATERIAL_FACTORS["Stahl feuerverzinkt & pulverbeschichtet"];
    const activeMontage = MONTAGE_FACTORS[montageType] || MONTAGE_FACTORS["Standard-Montage"];

    const safeLfm = Math.max(0, Number(lfm) || 0);
    const effectiveRatePerLfm = activeGewerk.baseRatePerLfm * activeMaterial.factor * activeMontage.factor;
    const estimatedMetalworkCost = safeLfm * effectiveRatePerLfm;
    const estimatedEigenmittel = estimatedMetalworkCost * ((Number(eigenmittelQuote) || 0) / 100);
    const estimatedFremdkapital = Math.max(0, estimatedMetalworkCost - estimatedEigenmittel);
    const estimatedYearlyInterest = estimatedFremdkapital * ((Number(zinssatz) || 0) / 100);

    const scrollToInput = (targetRef = companyInputRef) => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const el = targetRef?.current;
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    if (typeof el.focus === "function") {
                        el.focus({ preventScroll: true });
                    }
                }
            }, 60);
        });
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const openAuthModal = (mode = "login") => {
        setAuthMode(mode);
        setAuthError("");
        setAuthSuccess("");
        setPrivacyAccepted(false);
        setShowAuthModal(true);
    };

    const handleResetCalculation = () => {
        setLfm(45);
        setMaterialType("Stahl feuerverzinkt & pulverbeschichtet");
        setMontageType("Standard-Montage");
        setEigenmittelQuote(20);
        setSelectedTender(null);
        setProjectNotes("");
        setBookingSubmitted(false);
        setSubmitError("");
    };

    const handlePrintSummary = () => {
        window.print();
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setAuthError("");
        setAuthSuccess("");

        const cleanEmail = authEmail.trim().toLowerCase();
        if (!cleanEmail || !authPassword) {
            setAuthError("Bitte E-Mail und Passwort eingeben.");
            return;
        }

        let storedUsers = [];
        try {
            storedUsers = JSON.parse(localStorage.getItem("titocci_kunden") || "[]");
        } catch {
            storedUsers = [];
        }

        if (authMode === "register") {
            if (!firmaOderName.trim()) {
                setAuthError("Bitte Firma, Verwaltung oder Namen angeben.");
                return;
            }
            if (authPassword.length < 6) {
                setAuthError("Das Passwort muss mindestens 6 Zeichen lang sein.");
                return;
            }
            if (authPassword !== authPasswordConfirm) {
                setAuthError("Die Passwörter stimmen nicht überein.");
                return;
            }
            if (!privacyAccepted) {
                setAuthError("Bitte akzeptiere die Datenschutzerklärung.");
                return;
            }
            if (storedUsers.some((u) => u.email === cleanEmail)) {
                setAuthError("Für diese E-Mail existiert bereits ein Konto.");
                return;
            }

            const newUser = {
                id: Date.now(),
                kundenTyp,
                firmaOderName: firmaOderName.trim(),
                immobilienObjekt: immobilienObjekt.trim(),
                email: cleanEmail,
                password: authPassword
            };

            localStorage.setItem("titocci_kunden", JSON.stringify([...storedUsers, newUser]));
            localStorage.setItem("titocci_current_user", JSON.stringify(newUser));
            setCurrentUser(newUser);
            setCompanyName(newUser.firmaOderName);
            setEmail(newUser.email);
            if (newUser.immobilienObjekt) setLocationInput(newUser.immobilienObjekt);

            setAuthPassword("");
            setAuthPasswordConfirm("");
            setAuthSuccess("Kundenkonto & Immobilie registriert!");
            setShowAuthModal(false);
        } else {
            const foundUser = storedUsers.find(
                (u) => u.email === cleanEmail && u.password === authPassword
            );
            if (!foundUser) {
                setAuthError("E-Mail oder Passwort ist ungültig.");
                return;
            }

            localStorage.setItem("titocci_current_user", JSON.stringify(foundUser));
            setCurrentUser(foundUser);
            setCompanyName(foundUser.firmaOderName);
            setEmail(foundUser.email);
            if (foundUser.immobilienObjekt) setLocationInput(foundUser.immobilienObjekt);

            setAuthPassword("");
            setAuthSuccess(`Willkommen, ${foundUser.firmaOderName}!`);
            setShowAuthModal(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("titocci_current_user");
        setCurrentUser(null);
    };

    const sendEmailCalc = async ({
                                     calculatedTotalPrice = 0,
                                     calculatedPricePerQm = 0,
                                     attachedImage = "",
                                     attachedPdfName = "",
                                     customMessage = ""
                                 } = {}) => {
        if (!isValidEmail(email)) {
            alert("Bitte gib eine gültige E-Mail-Adresse ein.");
            scrollToInput(companyInputRef);
            return false;
        }

        setIsSending(true);
        setSubmitError("");
        setBookingSubmitted(false);

        const finalTotal = Number(calculatedTotalPrice) || estimatedMetalworkCost;
        const finalPerQm = Number(calculatedPricePerQm) || 0;

        try {
            const detailsBlock = customMessage ? `${customMessage}\n\n` : "";

            const templateParams = {
                subject: "Neue Immobilien- & Metallbau-Anfrage von Titocci Metalcostruzioni",
                from_name: companyName || "Nicht angegeben",
                from_email: email.trim(),
                reply_to: email.trim(),
                phone: phone.trim() || "Keine Telefonnummer angegeben",
                tender_ref: selectedTender || "Keine Referenz gewählt",
                property_type: selectedPropertyType,
                service_type: selectedService,
                location: locationInput || "Nicht angegeben",
                visit_date: visitDate ? `${visitDate}${visitTime ? ` (${visitTime})` : ""}` : "Kein Wunschdatum angegeben",
                message:
                    `${detailsBlock}` +
                    `Kunde / Konto: ${currentUser ? `${currentUser.firmaOderName} (${currentUser.kundenTyp})` : "Gast"}\n` +
                    `Objekttyp: ${selectedPropertyType}\n` +
                    `Gewerk: ${selectedService} (${activeGewerk.bkp})\n` +
                    `Laufmeter (lfm): ${safeLfm} lfm (Richtpreis: ${effectiveRatePerLfm.toFixed(2)} CHF/lfm)\n` +
                    `Material / Oberfläche: ${activeMaterial.label}\n` +
                    `Montage / Ausführung: ${activeMontage.label}\n` +
                    `Richtpreis Metallbau: ${estimatedMetalworkCost.toFixed(2)} CHF\n` +
                    `Eigenmittel (${eigenmittelQuote}%): ${estimatedEigenmittel.toFixed(2)} CHF | Fremdkapital: ${estimatedFremdkapital.toFixed(2)} CHF\n` +
                    `Kalk. Jahreszins (${zinssatz}%): ${estimatedYearlyInterest.toFixed(2)} CHF\n` +
                    `Standort: ${locationInput}\n` +
                    `Wunschtermin: ${visitDate || "Nicht angegeben"}${visitTime ? ` (${visitTime})` : ""}\n` +
                    `Wohnfläche: ${qm} m²\n` +
                    `Kanton: ${canton}\n` +
                    `Telefon: ${phone.trim() || "Keine Telefonnummer angegeben"}\n` +
                    `Geschätzter Quadratmeterpreis: ${finalPerQm.toFixed(2)} CHF\n` +
                    `Geschätzter Gesamtpreis: ${finalTotal.toFixed(2)} CHF\n` +
                    `PDF-Dokument: ${attachedPdfName || "Kein PDF hochgeladen"}`,
                to_email: "info@titocci.ch",
                signup_date: new Date().toLocaleDateString("de-CH"),
                image_url: attachedImage || "Kein Bild angehängt",
                pdf_filename: attachedPdfName || "Kein PDF hochgeladen"
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            setBookingSubmitted(true);
            alert(
                "Der Bericht wurde erfolgreich an " +
                email.trim() +
                " und an die Titocci Metalcostruzioni gesendet!"
            );
            return true;
        } catch (error) {
            console.error("Fehler beim E-Mail-Versand:", error);
            setSubmitError(t.bookingError);
            return false;
        } finally {
            setIsSending(false);
        }
    };

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
        setBookingSubmitted(false);
        setActiveTab("rechner");
        scrollToInput(workspaceRef);
    };

    const handleDirectReservation = async (e) => {
        e.preventDefault();
        await sendEmailCalc({ customMessage: projectNotes });
    };

    const handleRequestTenderOffer = (tender) => {
        setSelectedTender(tender.id);
        setLocationInput(tender.location);
        setProjectNotes(
            `Anfrage zu Ausschreibung ${tender.id} (${tender.title}, ${tender.bkp}, Volumen: ${tender.volume}).`
        );
        setActiveTab("rechner");
        scrollToInput(companyInputRef);
    };

    return (
        <div style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif" }}>
            {/* LOGIN & REGISTRIERUNGS-MODAL */}
            {showAuthModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.8)",
                        zIndex: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "460px",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderTop: "3px solid #e62b2b",
                            borderRadius: "12px",
                            padding: "28px",
                            position: "relative"
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setShowAuthModal(false)}
                            aria-label="Schliessen"
                            style={{
                                position: "absolute",
                                top: "14px",
                                right: "16px",
                                background: "none",
                                border: "none",
                                color: "#aaa",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}
                        >
                            ✕
                        </button>

                        <h3 style={{ margin: "0 0 14px", fontSize: "1.4rem" }}>
                            {authMode === "login" ? "Login-Ansicht" : "Kunde & Immobilie registrieren"}
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                                style={{
                                    padding: "9px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    backgroundColor: authMode === "login" ? "#e62b2b" : "#282828",
                                    color: "#fff"
                                }}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                                style={{
                                    padding: "9px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    backgroundColor: authMode === "register" ? "#e62b2b" : "#282828",
                                    color: "#fff"
                                }}
                            >
                                Registrieren
                            </button>
                        </div>

                        {currentUser && authMode === "login" && (
                            <div
                                style={{
                                    backgroundColor: "#141414",
                                    border: "1px solid #2e2e2e",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "14px",
                                    fontSize: "13px"
                                }}
                            >
                                <div style={{ color: "#2ecc71", fontWeight: "bold", marginBottom: "4px" }}>
                                    Aktive Session: {currentUser.firmaOderName}
                                </div>
                                <div style={{ color: "#bbb" }}>{currentUser.kundenTyp} • {currentUser.email}</div>
                                {currentUser.immobilienObjekt && (
                                    <div style={{ color: "#aaa", marginTop: "2px" }}>Objekt: {currentUser.immobilienObjekt}</div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setShowAuthModal(false); setActiveTab("aboutme"); }}
                                    style={{
                                        marginTop: "8px",
                                        padding: "6px 10px",
                                        borderRadius: "5px",
                                        border: "1px solid #444",
                                        backgroundColor: "#222",
                                        color: "#fff",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Profil & Konto-Ansicht öffnen
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit} style={{ display: "grid", gap: "12px" }}>
                            {authMode === "register" && (
                                <>
                                    <select
                                        value={kundenTyp}
                                        onChange={(e) => setKundenTyp(e.target.value)}
                                        style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    >
                                        <option value="Immobilienverwaltung">Immobilienverwaltung</option>
                                        <option value="Mehrfamilienhaus / Eigentümer">Mehrfamilienhaus / Eigentümer</option>
                                        <option value="Architekt / Generalunternehmer">Architekt / Generalunternehmer</option>
                                        <option value="Privatkunde">Privatkunde</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Firma / Verwaltung / Name *"
                                        value={firmaOderName}
                                        onChange={(e) => setFirmaOderName(e.target.value)}
                                        required
                                        style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Immobilien-Objekt / Adresse (z.B. MFH Avegno)"
                                        value={immobilienObjekt}
                                        onChange={(e) => setImmobilienObjekt(e.target.value)}
                                        style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    />
                                </>
                            )}

                            <input
                                type="email"
                                placeholder="Geschäftliche E-Mail *"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                required
                                style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                            />
                            <input
                                type="password"
                                placeholder="Passwort *"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                required
                                style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                            />
                            {authMode === "register" && (
                                <>
                                    <input
                                        type="password"
                                        placeholder="Passwort bestätigen *"
                                        value={authPasswordConfirm}
                                        onChange={(e) => setAuthPasswordConfirm(e.target.value)}
                                        required
                                        style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    />
                                    <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#ccc", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={privacyAccepted}
                                            onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                            style={{ marginTop: "2px" }}
                                        />
                                        <span>Ich akzeptiere die Datenschutzerklärung zur Bearbeitung meiner Anfrage.</span>
                                    </label>
                                </>
                            )}

                            {authError && <div style={{ color: "#ff7b7b", fontSize: "13px" }}>{authError}</div>}
                            {authSuccess && <div style={{ color: "#2ecc71", fontSize: "13px" }}>{authSuccess}</div>}

                            <button
                                type="submit"
                                style={{
                                    padding: "12px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#e62b2b",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                {authMode === "login" ? "Einloggen" : "Konto & Immobilie registrieren"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* HERO & NAVIGATION */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "680px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(17,17,17,0.95) 100%), url(${Schleifbild})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <nav
                    style={{
                        position: "relative",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 50px",
                        boxSizing: "border-box",
                        zIndex: 20,
                        gap: "16px",
                        flexWrap: "wrap",
                        background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)"
                    }}
                >
                    <div style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "1px", color: "#e62b2b" }}>
                        TITOCCI <span style={{ color: "#fff", fontWeight: "300" }}>METALCOSTRUZIONI</span>
                    </div>

                    <ul style={{ display: "flex", listStyle: "none", gap: "24px", margin: 0, padding: 0, flexWrap: "wrap", alignItems: "center" }}>
                        <li><Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.home}</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.chiSiamo}</Link></li>
                        <li><Link to="/servizi" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.servizi}</Link></li>
                        <li><Link to="/galeria" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.galeria}</Link></li>
                        <li>
                            <span style={{ color: "white", fontWeight: "bold", borderBottom: "3px solid #e62b2b", paddingBottom: "4px", fontSize: "14px" }}>
                                {t.immobilien}
                            </span>
                        </li>
                        <li><Link to="/kontakte" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.kontakte}</Link></li>
                        <li>
                            <img src="src/assets/About.jpg"></img>
                            {currentUser ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab("aboutme"); scrollToInput(workspaceRef); }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            fontSize: "12px",
                                            color: "#2ecc71",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            padding: 0
                                        }}
                                    >
                                        {currentUser.firmaOderName}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        style={{
                                            padding: "7px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid #555",
                                            backgroundColor: "#222",
                                            color: "#fff",
                                            fontSize: "12px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {t.logoutBtn}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => openAuthModal("login")}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {t.loginBtn}
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>

                <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 24px", width: "100%", boxSizing: "border-box" }}>
                    <div style={{ color: "#e62b2b", fontWeight: "bold", fontSize: "12px", letterSpacing: "1.5px", marginBottom: "10px" }}>
                        {t.heroTag}
                    </div>
                    <h1 style={{ fontSize: "2.8rem", margin: "0 0 12px" }}>{t.heroTitle}</h1>
                    <p style={{ color: "#ddd", fontSize: "1.1rem", maxWidth: "760px", marginBottom: "28px" }}>
                        {t.heroSubtitle}
                    </p>

                    <form
                        onSubmit={handleBookingSearch}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "12px",
                            backgroundColor: "rgba(24,24,24,0.95)",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "1px solid #333"
                        }}
                    >
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>{t.objektTyp}</label>
                            <select
                                value={selectedPropertyType}
                                onChange={(e) => setSelectedPropertyType(e.target.value)}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                            >
                                <option value="Mehrfamilienhaus / Wohnbau">Mehrfamilienhaus / Wohnbau</option>
                                <option value="Gewerbe & Industrie">Gewerbe & Industrie</option>
                                <option value="Privatimmobilie / Villa">Privatimmobilie / Villa</option>
                                <option value="Öffentliche Ausschreibung">Öffentliche Ausschreibung</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>{t.gewerkTyp}</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                            >
                                {Object.keys(GEWERK_CONFIG).map((gewerk) => (
                                    <option key={gewerk} value={gewerk}>{gewerk}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>{t.standort}</label>
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>{t.terminWunsch}</label>
                            <input
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "11px 16px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#e62b2b",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                {t.suchenBtn}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* WORKSPACE BEREICH */}
            <div ref={workspaceRef} style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 24px 60px" }}>
                {/* VERBESSERTE LOGIN- & KONTEN-LEISTE */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        backgroundColor: "#171717",
                        border: "1px solid #2b2b2b",
                        borderRadius: "10px",
                        padding: "14px 18px",
                        marginBottom: "20px"
                    }}
                >
                    {currentUser ? (
                        <>
                            <div style={{ fontSize: "13px" }}>
                                <span style={{ color: "#2ecc71", fontWeight: "bold" }}>Eingeloggt:</span>{" "}
                                <strong>{currentUser.firmaOderName}</strong> ({currentUser.kundenTyp} • {currentUser.email})
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("aboutme")}
                                    style={{
                                        padding: "7px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                        backgroundColor: "#232323",
                                        color: "#fff",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Profil ansehen
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    style={{
                                        padding: "7px 12px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    {t.logoutBtn}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: "13px", color: "#ccc" }}>
                                <strong>Gast-Modus:</strong> Melden Sie sich an, um Unternehmensdaten automatisch in Kalkulation und Offerten zu übernehmen.
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal("login")}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal("register")}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                        backgroundColor: "#232323",
                                        color: "#fff",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Konto erstellen
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* TABS */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px", borderBottom: "1px solid #2c2c2c", paddingBottom: "14px" }}>
                    {[
                        { id: "ausschreibungen", label: t.tabAusschreibungen },
                        { id: "kunden", label: t.tabKunden },
                        { id: "rechner", label: t.tabRechner },
                        { id: "aboutme", label: t.tabAboutMe },

                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 18px",
                                borderRadius: "6px",
                                border: "none",
                                fontWeight: "bold",
                                cursor: "pointer",
                                backgroundColor: activeTab === tab.id ? "#e62b2b" : "#1f1f1f",
                                color: "#fff"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "ausschreibungen" && (
                    <div style={{ display: "grid", gap: "20px" }}>
                        {tenders.map((tender) => (
                            <div
                                key={tender.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                    gap: "20px",
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #2e2e2e",
                                    borderRadius: "10px",
                                    padding: "20px"
                                }}
                            >
                                <img
                                    src={tender.image}
                                    alt={tender.title}
                                    style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "8px" }}
                                />
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "12px", color: "#e62b2b", fontWeight: "bold" }}>{tender.id} • {tender.bkp}</span>
                                        <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "4px", backgroundColor: tender.isOpen ? "#1e462e" : "#3a3520", color: tender.isOpen ? "#6ee79c" : "#facc15" }}>
                                            {tender.status}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: "0 0 8px" }}>{tender.title}</h3>
                                    <p style={{ margin: "0 0 10px", color: "#ccc", fontSize: "14px" }}>
                                        {tender.location} – {tender.type} ({tender.volume})
                                    </p>
                                    <ul style={{ margin: "0 0 14px", paddingLeft: "18px", color: "#aaa", fontSize: "13px" }}>
                                        {tender.specs.map((spec) => <li key={spec}>{spec}</li>)}
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                        <span style={{ fontSize: "12px", color: "#bbb" }}>{t.fristLabel}: {tender.deadline}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRequestTenderOffer(tender)}
                                            style={{
                                                padding: "9px 14px",
                                                borderRadius: "6px",
                                                border: "none",
                                                backgroundColor: "#e62b2b",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                fontSize: "13px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {t.offerteBtn}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "kunden" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                        {clientPackages.map((pkg) => (
                            <div
                                key={pkg.title}
                                style={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #2e2e2e",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                }}
                            >
                                <img src={pkg.img} alt={pkg.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                                <div style={{ padding: "18px" }}>
                                    <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>{pkg.title}</h3>
                                    <p style={{ margin: "0 0 12px", color: "#bbb", fontSize: "13px", lineHeight: 1.5 }}>{pkg.desc}</p>
                                    <div style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "13px", marginBottom: "12px" }}>{pkg.priceHint}</div>
                                    <a
                                        href={pkg.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "#e62b2b", fontSize: "13px", fontWeight: "bold", textDecoration: "none" }}
                                    >
                                        Details auf titocci.ch →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "rechner" && (
                    <div style={{ display: "grid", gap: "28px" }}>
                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "10px", padding: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
                                <div>
                                    <h3 style={{ margin: "0 0 4px" }}>Metallbau-Richtkalkulation ({activeGewerk.bkp})</h3>
                                    <div style={{ fontSize: "13px", color: "#aaa" }}>{activeGewerk.normHint}</div>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={handleResetCalculation}
                                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#252525", color: "#fff", cursor: "pointer", fontSize: "12px" }}
                                    >
                                        Zurücksetzen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrintSummary}
                                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#252525", color: "#fff", cursor: "pointer", fontSize: "12px" }}
                                    >
                                        Drucken
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>Laufmeter (lfm)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={lfm}
                                        onChange={(e) => setLfm(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>Material / Oberfläche</label>
                                    <select
                                        value={materialType}
                                        onChange={(e) => setMaterialType(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    >
                                        {Object.keys(MATERIAL_FACTORS).map((mat) => <option key={mat} value={mat}>{mat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>Montage / Ausführung</label>
                                    <select
                                        value={montageType}
                                        onChange={(e) => setMontageType(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                    >
                                        {Object.keys(MONTAGE_FACTORS).map((mon) => <option key={mon} value={mon}>{mon}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>Eigenmittelquote (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={eigenmittelQuote}
                                        onChange={(e) => setEigenmittelQuote(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444", boxSizing: "border-box" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", backgroundColor: "#141414", padding: "16px", borderRadius: "8px" }}>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#aaa" }}>Richtpreis / lfm</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>CHF {effectiveRatePerLfm.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#aaa" }}>Geschätzter Metallbau-Preis</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2ecc71" }}>CHF {estimatedMetalworkCost.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#aaa" }}>Eigenmittel ({eigenmittelQuote}%)</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>CHF {estimatedEigenmittel.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#aaa" }}>Fremdkapital / Zins ({zinssatz}%)</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                        CHF {estimatedFremdkapital.toFixed(2)} <span style={{ fontSize: "12px", color: "#aaa" }}>(~CHF {estimatedYearlyInterest.toFixed(0)}/J)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Calculator
                            qm={qm}
                            setQm={setQm}
                            canton={canton}
                            setCanton={setCanton}
                            zinssatz={zinssatz}
                            setZinssatz={setZinssatz}
                            onSendCalculation={sendEmailCalc}
                        />

                        <form
                            onSubmit={handleDirectReservation}
                            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "10px", padding: "24px", display: "grid", gap: "14px" }}
                        >
                            <h3 style={{ margin: 0 }}>{t.bookingTitle}</h3>
                            <p style={{ margin: 0, color: "#bbb", fontSize: "14px" }}>{t.bookingSub}</p>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                                <input
                                    ref={companyInputRef}
                                    type="text"
                                    placeholder={t.namePlaceholder}
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                />
                                <input
                                    type="email"
                                    placeholder={t.emailPlaceholder}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                />
                                <input
                                    type="tel"
                                    placeholder={t.phonePlaceholder}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                />
                                <input
                                    type="time"
                                    value={visitTime}
                                    onChange={(e) => setVisitTime(e.target.value)}
                                    style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444" }}
                                />
                            </div>

                            <textarea
                                rows="4"
                                placeholder={t.projektDetails}
                                value={projectNotes}
                                onChange={(e) => setProjectNotes(e.target.value)}
                                style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#262626", color: "#fff", border: "1px solid #444", resize: "vertical" }}
                            />

                            {bookingSubmitted && <div style={{ color: "#2ecc71", fontSize: "14px" }}>{t.bookingSuccess}</div>}
                            {submitError && <div style={{ color: "#ff7b7b", fontSize: "14px" }}>{submitError}</div>}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: isSending ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {isSending ? "Wird gesendet..." : t.bookingSubmit}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ABOUT ME & LOGIN-KONTO ANSICHT */}
                {activeTab === "aboutme" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "10px", padding: "24px" }}>
                            <div style={{ fontSize: "12px", color: "#e62b2b", fontWeight: "bold", marginBottom: "6px" }}>ABOUT ME</div>
                            <h3 style={{ margin: "0 0 6px", fontSize: "1.4rem" }}>{ABOUT_ME_PROFILE.name}</h3>
                            <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "14px" }}>
                                {ABOUT_ME_PROFILE.role} • {ABOUT_ME_PROFILE.location}
                            </div>
                            <p style={{ color: "#ddd", fontSize: "14px", lineHeight: 1.6, margin: "0 0 16px" }}>
                                {ABOUT_ME_PROFILE.summary}
                            </p>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                                {ABOUT_ME_PROFILE.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            fontSize: "12px",
                                            padding: "5px 10px",
                                            borderRadius: "999px",
                                            backgroundColor: "#252525",
                                            border: "1px solid #3a3a3a",
                                            color: "#eee"
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                {ABOUT_ME_PROFILE.links.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "#e62b2b", fontWeight: "bold", fontSize: "13px", textDecoration: "none" }}
                                    >
                                        {item.label} →
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "10px", padding: "24px" }}>
                            <div style={{ fontSize: "12px", color: "#2ecc71", fontWeight: "bold", marginBottom: "6px" }}>LOGIN & KONTO-ANSICHT</div>
                            <h3 style={{ margin: "0 0 12px", fontSize: "1.3rem" }}>
                                {currentUser ? "Angemeldetes Kundenkonto" : "Kein Konto aktiv"}
                            </h3>

                            {currentUser ? (
                                <div style={{ display: "grid", gap: "8px", fontSize: "14px", color: "#ddd" }}>
                                    <div><strong>Firma / Name:</strong> {currentUser.firmaOderName}</div>
                                    <div><strong>Kundentyp:</strong> {currentUser.kundenTyp}</div>
                                    <div><strong>E-Mail:</strong> {currentUser.email}</div>
                                    <div><strong>Objekt:</strong> {currentUser.immobilienObjekt || "Nicht hinterlegt"}</div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("rechner")}
                                            style={{ padding: "9px 14px", borderRadius: "6px", border: "none", backgroundColor: "#e62b2b", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
                                        >
                                            Zum Kalkulator
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            style={{ padding: "9px 14px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#252525", color: "#fff", cursor: "pointer", fontSize: "13px" }}
                                        >
                                            {t.logoutBtn}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gap: "12px", fontSize: "14px", color: "#bbb" }}>
                                    <p style={{ margin: 0 }}>
                                        Melden Sie sich mit Ihrem Konto an oder registrieren Sie ein neues Kunden- & Immobilienprofil.
                                    </p>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            type="button"
                                            onClick={() => openAuthModal("login")}
                                            style={{ padding: "10px 16px", borderRadius: "6px", border: "none", backgroundColor: "#e62b2b", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
                                        >
                                            Login öffnen
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openAuthModal("register")}
                                            style={{ padding: "10px 16px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#252525", color: "#fff", cursor: "pointer", fontSize: "13px" }}
                                        >
                                            Registrieren
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImmobilienPortal;