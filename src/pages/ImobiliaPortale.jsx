import React, { useState, useRef, useEffect } from "react";
import { User, Briefcase, MapPin, Building2, ExternalLink } from "lucide-react";
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
    highlights: [
        "Schnittstelle zwischen Immobilien-/Kalkulationslogik, UI/UX und Webentwicklung",
        "Strukturierte Offert- und Ausschreibungs-Workflows für B2B & Immobilien",
        "Responsive React-Oberflächen mit direktem E-Mail-Report-Versand"
    ],
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

    const companyInputRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            setCompanyName(currentUser.firmaOderName || "");
            setEmail(currentUser.email || "");
            if (currentUser.immobilienObjekt) {
                setLocationInput(currentUser.immobilienObjekt);
            }
        }
    }, [currentUser]);

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
        setSubmitError("");
        setBookingSubmitted(false);

        if (!isValidEmail(email)) {
            setSubmitError("Bitte gib eine gültige E-Mail-Adresse ein.");
            scrollToInput(companyInputRef);
            return false;
        }

        setIsSending(true);
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
            return true;
        } catch (error) {
            console.error("Fehler beim E-Mail-Versand:", error);
            setSubmitError(t.bookingError);
            return false;
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <header
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #262626"
                }}
            >
                <div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#ff6b6b" }}>{t.heroTag}</div>
                    <h1 style={{ margin: "2px 0 0", fontSize: "1.35rem" }}>{t.heroTitle}</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {currentUser ? (
                        <>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#ddd" }}>
                                <User size={15} color="#2ecc71" />
                                {currentUser.firmaOderName}
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                style={{
                                    padding: "7px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #444",
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                {t.logoutBtn}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openAuthModal("login")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            <User size={15} />
                            <span>{t.loginBtn}</span>
                        </button>
                    )}
                </div>
            </header>

            <section
                aria-label="Profil Person"
                style={{
                    maxWidth: "900px",
                    margin: "24px auto",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2e2e2e"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <User size={20} color="#e62b2b" />
                    <strong>{ABOUT_ME_PROFILE.name}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", fontSize: "14px", marginBottom: "6px" }}>
                    <Briefcase size={16} />
                    <span>{ABOUT_ME_PROFILE.role}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#aaa", fontSize: "14px", marginBottom: "12px" }}>
                    <MapPin size={16} />
                    <span>{ABOUT_ME_PROFILE.location}</span>
                </div>
                <p style={{ margin: "0 0 12px", color: "#ddd", fontSize: "14px" }}>{ABOUT_ME_PROFILE.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {ABOUT_ME_PROFILE.links.map((item) => (
                        <a
                            key={item.url}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ff6b6b", fontSize: "13px" }}
                        >
                            <span>{item.label}</span>
                            <ExternalLink size={14} />
                        </a>
                    ))}
                </div>
            </section>

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

                        <h3 style={{ margin: "0 0 14px", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={20} color="#e62b2b" />
                            <span>{authMode === "login" ? "Login-Ansicht" : "Kunde & Immobilie registrieren"}</span>
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
                                <div style={{ color: "#2ecc71", fontWeight: "bold", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <User size={15} />
                                    <span>Aktive Session: {currentUser.firmaOderName}</span>
                                </div>
                                <div style={{ color: "#bbb", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Building2 size={14} />
                                    <span>{currentUser.kundenTyp} • {currentUser.email}</span>
                                </div>
                                {currentUser.immobilienObjekt && (
                                    <div style={{ color: "#aaa", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <MapPin size={14} />
                                        <span>Objekt: {currentUser.immobilienObjekt}</span>
                                    </div>
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
                                {authMode === "login" ? "Einloggen" : "Konto erstellen"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImmobilienPortal;