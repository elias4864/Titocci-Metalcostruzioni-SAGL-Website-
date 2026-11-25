import React, { useState, useRef, useEffect } from "react";
import {
    User,
    Briefcase,
    MapPin,
    ExternalLink,
    Calculator,
    Send,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
    KeyRound,
    UserPlus,
    RotateCcw,
    X
} from "lucide-react";
import emailjs from "@emailjs/browser";

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

const MOCK_USERS = [
    {
        id: 101,
        kundenTyp: "Immobilienverwaltung",
        firmaOderName: "Verwaltung Vallemaggia SA",
        immobilienObjekt: "Residenza Avegno (MFH)",
        email: "verwaltung@mock.ch",
        password: "Password123"
    },
    {
        id: 102,
        kundenTyp: "Privatkunde",
        firmaOderName: "Luca Bernasconi",
        immobilienObjekt: "Casa Locarno",
        email: "luca@mock.ch",
        password: "Password123"
    }
];

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

const ProtectedRoute = ({ user, allowedTypes = [], onRequireAuth, children }) => {
    const isAuthenticated = Boolean(user && user.email);
    const isAuthorized =
        isAuthenticated &&
        (allowedTypes.length === 0 || allowedTypes.includes(user.kundenTyp));

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <section
            aria-label="Geschützter Bereich"
            style={{
                maxWidth: "960px",
                margin: "24px auto",
                padding: "28px 20px",
                borderRadius: "10px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2e2e2e",
                textAlign: "center"
            }}
        >
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(230, 43, 43, 0.15)",
                    marginBottom: "12px"
                }}
            >
                <Lock size={20} color="#ff6b6b" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
                {isAuthenticated ? "Fehlende Berechtigung für diesen Bereich" : "Geschützter Kunden- & Kalkulationsbereich"}
            </h2>
            <p style={{ margin: "0 auto 18px", maxWidth: "560px", color: "#bbb", fontSize: "14px", lineHeight: 1.5 }}>
                {isAuthenticated
                    ? `Ihr Konto (${user.kundenTyp}) ist für diese Ansicht nicht freigeschaltet.`
                    : "Bitte melden Sie sich an, registrieren Sie ein Konto oder setzen Sie Ihr Passwort zurück, um Kalkulator, Richtpreise und Direkt-Buchung zu nutzen."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => onRequireAuth("login")}
                    style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#e62b2b",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: "pointer"
                    }}
                >
                    Jetzt einloggen
                </button>
                <button
                    type="button"
                    onClick={() => onRequireAuth("register")}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "1px solid #444",
                        backgroundColor: "#242424",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: "pointer"
                    }}
                >
                    <UserPlus size={14} />
                    <span>Konto registrieren</span>
                </button>
                <button
                    type="button"
                    onClick={() => onRequireAuth("reset")}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "1px solid #444",
                        backgroundColor: "#1d1d1d",
                        color: "#ffd166",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: "pointer"
                    }}
                >
                    <KeyRound size={14} />
                    <span>Passwort zurücksetzen</span>
                </button>
            </div>
        </section>
    );
};

const ImmobilienPortal = ({ lang = "de" }) => {
    const translations = {
        de: {
            loginBtn: "Login / Konto",
            logoutBtn: "Logout",
            heroTag: "B2B & IMMOBILIENPORTAL • TESSIN & SCHWEIZ",
            heroTitle: "Titocci Metalcostruzioni",
            bookingTitle: "Direkt-Buchung: Aufmass & Technische Beratung vor Ort",
            bookingSub: "Wählen Sie Ihr Projektfenster und senden Sie Ihre Anfrage direkt per E-Mail oder im Mock-Modus.",
            namePlaceholder: "Firma / Verwaltung / Name",
            emailPlaceholder: "Geschäftliche E-Mail",
            phonePlaceholder: "Telefonnummer (optional)",
            projektDetails: "Beschreiben Sie kurz das Bauvorhaben (z.B. 45 lfm Balkongeländer, Sanierung Mehrfamilienhaus)...",
            bookingSubmit: "Termin verbindlich anfragen",
            bookingSuccess: "Vielen Dank! Ihre Anfrage wurde erfolgreich versendet bzw. im Mock gespeichert.",
            bookingError: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
        }
    };

    const t = translations[lang] || translations.de;

    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    const getStoredUsers = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem("titocci_kunden") || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const ensureSeedUsers = (force = false) => {
        const current = getStoredUsers();
        if (current.length === 0 || force) {
            localStorage.setItem("titocci_kunden", JSON.stringify(MOCK_USERS));
            return MOCK_USERS;
        }
        return current;
    };

    useEffect(() => {
        ensureSeedUsers(false);
    }, []);

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("titocci_current_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [protectPrivateSections, setProtectPrivateSections] = useState(true);
    const [useMockMode, setUseMockMode] = useState(
        !(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
    );
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [privacyAccepted, setPrivacyAccepted] = useState(true);
    const [kundenTyp] = useState("Immobilienverwaltung");
    const [firmaOderName] = useState("");
    const [immobilienObjekt] = useState("");
    const [authEmail, setAuthEmail] = useState("");
    const [hoveredLinkUrl, setHoveredLinkUrl] = useState("");

    const [authPassword, setAuthPassword] = useState("");
    const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");

    const [showPasswordMap, setShowPasswordMap] = useState({
        auth: false,
        confirm: false,
        current: false,
        resetNew: false
    });

    const togglePasswordVisibility = (fieldKey) => {
        setShowPasswordMap((prev) => ({
            ...prev,
            [fieldKey]: !prev[fieldKey]
        }));
    };

    const [isResetSending, setIsResetSending] = useState(false);
    const [authError, setAuthError] = useState("");
    const [authSuccess, setAuthSuccess] = useState("");

    const [selectedPropertyType] = useState("Mehrfamilienhaus / Wohnbau");
    const [selectedService, setSelectedService] = useState("Parapetti & Balkongeländer");
    const [locationInput, setLocationInput] = useState("Avegno / Vallemaggia");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [selectedTender] = useState("");

    const [lfm, setLfm] = useState(45);
    const [materialType, setMaterialType] = useState("Stahl feuerverzinkt & pulverbeschichtet");
    const [montageType, setMontageType] = useState("Standard-Montage");
    const [eigenmittelQuote, setEigenmittelQuote] = useState(20);

    const [companyName, setCompanyName] = useState(() => currentUser?.firmaOderName || "");
    const [email, setEmail] = useState(() => currentUser?.email || "");
    const [phone, setPhone] = useState("");
    const [projectNotes, setProjectNotes] = useState("");
    const [qm] = useState(120);
    const [canton] = useState("TI");
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

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

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

    const openAuthModal = (mode = "login") => {
        setAuthMode(mode);
        setAuthError("");
        setAuthSuccess("");
        setAuthPassword("");
        setAuthPasswordConfirm("");
        setCurrentPasswordInput("");
        setResetNewPassword("");
        if (!authEmail && currentUser?.email) {
            setAuthEmail(currentUser.email);
        }
        setShowAuthModal(true);
    };

    const quickMockLogin = (mockUser) => {
        const users = ensureSeedUsers(false);
        if (!users.some((u) => u.email === mockUser.email)) {
            localStorage.setItem("titocci_kunden", JSON.stringify([...users, mockUser]));
        }
        localStorage.setItem("titocci_current_user", JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        setShowAuthModal(false);
    };

    const resetMockUsers = () => {
        ensureSeedUsers(true);
        localStorage.removeItem("titocci_current_user");
        setCurrentUser(null);
        setAuthSuccess("Mock-Benutzer auf Standardwerte zurückgesetzt.");
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setAuthError("");
        setAuthSuccess("");

        const cleanEmail = authEmail.trim().toLowerCase();
        if (!cleanEmail || !isValidEmail(cleanEmail)) {
            setAuthError("Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }
        if (!currentPasswordInput) {
            setAuthError("Bitte gib dein aktuelles Passwort ein.");
            return;
        }
        if (resetNewPassword.length < 6) {
            setAuthError("Das neue Passwort muss mindestens 6 Zeichen lang sein.");
            return;
        }
        if (currentPasswordInput === resetNewPassword) {
            setAuthError("Das neue Passwort muss sich vom bisherigen Passwort unterscheiden.");
            return;
        }

        const storedUsers = ensureSeedUsers(false);
        const userIndex = storedUsers.findIndex((u) => u.email === cleanEmail);
        if (userIndex === -1) {
            setAuthError("Kein Konto mit dieser E-Mail-Adresse gefunden.");
            return;
        }

        if (storedUsers[userIndex].password !== currentPasswordInput) {
            setAuthError("Das bisherige Passwort stimmt nicht.");
            return;
        }

        const updatedUser = {
            ...storedUsers[userIndex],
            password: resetNewPassword
        };

        const updatedUsers = [...storedUsers];
        updatedUsers[userIndex] = updatedUser;
        localStorage.setItem("titocci_kunden", JSON.stringify(updatedUsers));

        if (currentUser?.email === cleanEmail) {
            localStorage.setItem("titocci_current_user", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
        }

        setIsResetSending(true);
        try {
            if (!useMockMode && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
                const now = new Date().toLocaleString("de-CH");
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        subject: "Passwort geändert – Titocci Metalcostruzioni Portal",
                        from_name: "Titocci Metalcostruzioni",
                        from_email: "info@titocci.ch",
                        reply_to: "info@titocci.ch",
                        to_email: cleanEmail,
                        signup_date: now,
                        message: `Passwort für ${cleanEmail} am ${now} geändert.`
                    },
                    EMAILJS_PUBLIC_KEY
                );
            }
        } catch (error) {
            console.error("Fehler beim Senden der Passwort-Reset-E-Mail:", error);
        } finally {
            setIsResetSending(false);
        }

        setCurrentPasswordInput("");
        setResetNewPassword("");
        setAuthSuccess(`Passwort für ${cleanEmail} erfolgreich aktualisiert. Du kannst dich jetzt einloggen.`);
        setAuthMode("login");
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

        const storedUsers = ensureSeedUsers(false);

        if (authMode === "register") {
            if (authPassword.length < 6) {
                setAuthError("Das Passwort muss mindestens 6 Zeichen lang sein.");
                return;
            }
            if (authPassword !== authPasswordConfirm) {
                setAuthError("Die beiden Passwörter stimmen nicht überein.");
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

            const derivedName =
                firmaOderName.trim() ||
                cleanEmail.split("@")[0].replace(/[._-]+/g, " ");

            const newUser = {
                id: Date.now(),
                kundenTyp,
                firmaOderName: derivedName,
                immobilienObjekt: immobilienObjekt.trim(),
                email: cleanEmail,
                password: authPassword
            };

            localStorage.setItem("titocci_kunden", JSON.stringify([...storedUsers, newUser]));
            localStorage.setItem("titocci_current_user", JSON.stringify(newUser));
            setCurrentUser(newUser);
            setAuthPassword("");
            setAuthPasswordConfirm("");
            setAuthSuccess("Konto erfolgreich erstellt!");
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

        if (useMockMode) {
            setIsSending(true);
            await new Promise((resolve) => setTimeout(resolve, 400));
            setIsSending(false);
            setBookingSubmitted(true);
            return true;
        }

        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            setSubmitError("EmailJS-Konfiguration fehlt (VITE_EMAILJS_* Umgebungsvariablen prüfen oder Mock-Modus aktivieren).");
            return false;
        }

        setIsSending(true);
        const safeQm = Math.max(1, Number(qm) || 1);
        const finalTotal = Number(calculatedTotalPrice) || estimatedMetalworkCost;
        const finalPerQm = Number(calculatedPricePerQm) || finalTotal / safeQm;

        try {
            const noteBlock = projectNotes.trim() ? `Projektnotizen:\n${projectNotes.trim()}\n\n` : "";
            const detailsBlock = customMessage ? `${customMessage}\n\n` : "";

            const templateParams = {
                subject: "Neue Immobilien- & Metallbau-Anfrage von Titocci Metalcostruzioni",
                from_name: companyName.trim() || "Nicht angegeben",
                from_email: email.trim(),
                reply_to: email.trim(),
                phone: phone.trim() || "Keine Telefonnummer angegeben",
                tender_ref: selectedTender.trim() || "Keine Referenz gewählt",
                property_type: selectedPropertyType,
                service_type: selectedService,
                location: locationInput || "Nicht angegeben",
                visit_date: visitDate ? `${visitDate}${visitTime ? ` (${visitTime})` : ""}` : "Kein Wunschdatum angegeben",
                message:
                    `${detailsBlock}${noteBlock}` +
                    `Kunde / Konto: ${currentUser ? `${currentUser.firmaOderName} (${currentUser.kundenTyp})` : "Gast"}\n` +
                    `Objekttyp: ${selectedPropertyType}\n` +
                    `Gewerk: ${selectedService} (${activeGewerk.bkp}, ${activeGewerk.normHint})\n` +
                    `Laufmeter (lfm): ${safeLfm} lfm (Richtpreis: ${effectiveRatePerLfm.toFixed(2)} CHF/lfm)\n` +
                    `Material / Oberfläche: ${activeMaterial.label}\n` +
                    `Montage / Ausführung: ${activeMontage.label}\n` +
                    `Richtpreis Metallbau: ${estimatedMetalworkCost.toFixed(2)} CHF\n` +
                    `Eigenmittel (${eigenmittelQuote}%): ${estimatedEigenmittel.toFixed(2)} CHF | Fremdkapital: ${estimatedFremdkapital.toFixed(2)} CHF\n` +
                    `Kalk. Jahreszins (${zinssatz}%): ${estimatedYearlyInterest.toFixed(2)} CHF\n` +
                    `Standort: ${locationInput}\n` +
                    `Wunschtermin: ${visitDate || "Nicht angegeben"}${visitTime ? ` (${visitTime})` : ""}\n` +
                    `Wohnfläche: ${safeQm} m²\n` +
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

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        await sendEmailCalc({
            calculatedTotalPrice: estimatedMetalworkCost
        });
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #383838",
        backgroundColor: "#141414",
        color: "#fff",
        fontSize: "14px",
        boxSizing: "border-box"
    };

    const passwordInputStyle = {
        ...inputStyle,
        paddingRight: "40px"
    };

    const eyeBtnStyle = {
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#bbb",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px"
    };

    const labelStyle = {
        display: "block",
        fontSize: "12px",
        color: "#bbb",
        marginBottom: "6px"
    };

    const renderPasswordInput = ({ id, value, onChange, fieldKey, placeholder = "", required = false }) => {
        const isVisible = Boolean(showPasswordMap[fieldKey]);
        return (
            <div style={{ position: "relative" }}>
                <input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={passwordInputStyle}
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(fieldKey)}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label={isVisible ? "Passwort verbergen" : "Passwort anzeigen"}
                    title={isVisible ? "Passwort verbergen" : "Passwort anzeigen"}
                    style={eyeBtnStyle}
                >
                    {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
        );
    };

    const privateContent = (
        <>
            {/* Kalkulator */}
            <section
                aria-label="Metallbau Kalkulator"
                style={{
                    maxWidth: "960px",
                    margin: "24px auto",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2e2e2e"
                }}
            >
                <h2 style={{ margin: "0 0 16px", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calculator size={19} color="#e62b2b" />
                    <span>Metallbau- & Finanzierungs-Richtpreisrechner</span>
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "18px" }}>
                    <div>
                        <label style={labelStyle}>Gewerk ({activeGewerk.bkp} • {activeGewerk.normHint})</label>
                        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={inputStyle}>
                            {Object.keys(GEWERK_CONFIG).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Material / Oberfläche</label>
                        <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} style={inputStyle}>
                            {Object.keys(MATERIAL_FACTORS).map((key) => (
                                <option key={key} value={key}>{MATERIAL_FACTORS[key].label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Montage / Ausführung</label>
                        <select value={montageType} onChange={(e) => setMontageType(e.target.value)} style={inputStyle}>
                            {Object.keys(MONTAGE_FACTORS).map((key) => (
                                <option key={key} value={key}>{MONTAGE_FACTORS[key].label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Laufmeter (lfm)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={lfm}
                            onChange={(e) => setLfm(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Eigenmittelquote (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={eigenmittelQuote}
                            onChange={(e) => setEigenmittelQuote(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Kalk. Zinssatz (% p.a.)</label>
                        <input
                            type="number"
                            min="0"
                            max="15"
                            step="0.05"
                            value={zinssatz}
                            onChange={(e) => setZinssatz(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" }}>
                    <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#141414", border: "1px solid #2b2b2b" }}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Effektiver lfm-Preis</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "4px" }}>
                            {effectiveRatePerLfm.toFixed(2)} CHF
                        </div>
                    </div>
                    <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#141414", border: "1px solid #e62b2b" }}>
                        <div style={{ fontSize: "12px", color: "#ffb4b4" }}>Richtpreis Metallbau</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ff6b6b", marginTop: "4px" }}>
                            {estimatedMetalworkCost.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CHF
                        </div>
                    </div>
                    <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#141414", border: "1px solid #2b2b2b" }}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Eigenmittel / Fremdkapital</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "bold", marginTop: "6px" }}>
                            {estimatedEigenmittel.toFixed(0)} / {estimatedFremdkapital.toFixed(0)} CHF
                        </div>
                    </div>
                    <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "#141414", border: "1px solid #2b2b2b" }}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Kalk. Jahreszins</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "4px" }}>
                            {estimatedYearlyInterest.toFixed(2)} CHF
                        </div>
                    </div>
                </div>
            </section>

            {/* Direkt-Buchung */}
            <section
                aria-label="Direkt-Buchung"
                style={{
                    maxWidth: "960px",
                    margin: "24px auto",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2e2e2e"
                }}
            >
                <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem" }}>{t.bookingTitle}</h2>
                <p style={{ margin: "0 0 16px", color: "#bbb", fontSize: "13px" }}>{t.bookingSub}</p>

                <form onSubmit={handleBookingSubmit} style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                        <div>
                            <label style={labelStyle}>Firma / Name</label>
                            <input
                                ref={companyInputRef}
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder={t.namePlaceholder}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>E-Mail *</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.emailPlaceholder}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Telefon</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={t.phonePlaceholder}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                        <div>
                            <label style={labelStyle}>Standort / Objekt</label>
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Wunschdatum</label>
                            <input
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Zeitfenster</label>
                            <input
                                type="text"
                                value={visitTime}
                                onChange={(e) => setVisitTime(e.target.value)}
                                placeholder="z.B. 09:00–11:00"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Projektnotizen</label>
                        <textarea
                            rows={3}
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            placeholder={t.projektDetails}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    {submitError && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff6b6b", fontSize: "13px" }}>
                            <AlertCircle size={16} />
                            <span>{submitError}</span>
                        </div>
                    )}

                    {bookingSubmitted && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#51cf66", fontSize: "13px" }}>
                            <CheckCircle2 size={16} />
                            <span>{t.bookingSuccess}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSending}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 18px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: isSending ? "not-allowed" : "pointer",
                                opacity: isSending ? 0.7 : 1
                            }}
                        >
                            <Send size={15} />
                            <span>{isSending ? "Wird gesendet..." : t.bookingSubmit}</span>
                        </button>
                    </div>
                </form>
            </section>
        </>
    );

    return (
        <div style={{ backgroundColor: "#111", color: "#fff", minHeight: "100vh", paddingBottom: "48px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {/* Topbar */}
            <header
                style={{
                    borderBottom: "1px solid #262626",
                    backgroundColor: "#161616",
                    padding: "14px 20px"
                }}
            >
                <div
                    style={{
                        maxWidth: "960px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}
                >
                    <div>
                        <div style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#ff6b6b", fontWeight: "bold" }}>
                            {t.heroTag}
                        </div>
                        <h1 style={{ margin: "2px 0 0", fontSize: "1.4rem" }}>{t.heroTitle}</h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#ccc", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={protectPrivateSections}
                                onChange={(e) => setProtectPrivateSections(e.target.checked)}
                            />
                            <span>Schutz aktiv</span>
                        </label>

                        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#ccc", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={useMockMode}
                                onChange={(e) => setUseMockMode(e.target.checked)}
                            />
                            <span>Mock-Modus</span>
                        </label>

                        {currentUser ? (
                            <>
                                <span style={{ fontSize: "12px", color: "#ffd166" }}>
                                    {currentUser.firmaOderName}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    style={{
                                        padding: "8px 12px",
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
                    </div>
                </div>
            </header>

            {protectPrivateSections ? (
                <ProtectedRoute user={currentUser} onRequireAuth={openAuthModal}>
                    {privateContent}
                </ProtectedRoute>
            ) : (
                privateContent
            )}

            {/* Über mich / Entwicklerprofil */}
            <section
                aria-label="Über den Entwickler"
                style={{
                    maxWidth: "960px",
                    margin: "24px auto",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2e2e2e"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                        <h2 style={{ margin: "0 0 4px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={18} color="#ff6b6b" />
                            <span>{ABOUT_ME_PROFILE.name}</span>
                        </h2>
                        <div style={{ fontSize: "13px", color: "#bbb", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Briefcase size={13} /> {ABOUT_ME_PROFILE.role}
                            </span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <MapPin size={13} /> {ABOUT_ME_PROFILE.location}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {ABOUT_ME_PROFILE.links.map((item) => (
                            <a
                                key={item.url}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                onMouseEnter={() => setHoveredLinkUrl(item.url)}
                                onMouseLeave={() => setHoveredLinkUrl("")}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #383838",
                                    backgroundColor: hoveredLinkUrl === item.url ? "#2a2a2a" : "#141414",
                                    color: "#fff",
                                    fontSize: "12px",
                                    textDecoration: "none"
                                }}
                            >
                                <span>{item.label}</span>
                                <ExternalLink size={12} />
                            </a>
                        ))}
                    </div>
                </div>

                <p style={{ margin: "12px 0", fontSize: "13px", color: "#ccc", lineHeight: 1.5 }}>
                    {ABOUT_ME_PROFILE.summary}
                </p>

                <ul style={{ margin: "0 0 12px", paddingLeft: "18px", fontSize: "13px", color: "#bbb" }}>
                    {ABOUT_ME_PROFILE.highlights.map((h) => (
                        <li key={h} style={{ marginBottom: "4px" }}>{h}</li>
                    ))}
                </ul>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {ABOUT_ME_PROFILE.skills.map((skill) => (
                        <span
                            key={skill}
                            style={{
                                fontSize: "11px",
                                padding: "4px 8px",
                                borderRadius: "999px",
                                backgroundColor: "#242424",
                                border: "1px solid #343434",
                                color: "#ddd"
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Auth Modal */}
            {showAuthModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Konto Authentifizierung"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        zIndex: 50
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "440px",
                            backgroundColor: "#1b1b1b",
                            border: "1px solid #333",
                            borderRadius: "10px",
                            padding: "20px",
                            color: "#fff"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                                {["login", "register", "reset"].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => {
                                            setAuthMode(mode);
                                            setAuthError("");
                                            setAuthSuccess("");
                                        }}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            border: "1px solid #3a3a3a",
                                            backgroundColor: authMode === mode ? "#e62b2b" : "#141414",
                                            color: "#fff",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {mode === "login" ? "Login" : mode === "register" ? "Registrieren" : "Passwort-Reset"}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAuthModal(false)}
                                aria-label="Modal schliessen"
                                style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer" }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {authError && (
                            <div style={{ marginBottom: "12px", padding: "10px", borderRadius: "6px", backgroundColor: "rgba(230,43,43,0.15)", color: "#ff8787", fontSize: "12px" }}>
                                {authError}
                            </div>
                        )}
                        {authSuccess && (
                            <div style={{ marginBottom: "12px", padding: "10px", borderRadius: "6px", backgroundColor: "rgba(81,207,102,0.15)", color: "#69db7c", fontSize: "12px" }}>
                                {authSuccess}
                            </div>
                        )}

                        {authMode === "reset" ? (
                            <form onSubmit={handlePasswordReset} style={{ display: "grid", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>E-Mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Aktuelles Passwort</label>
                                    {renderPasswordInput({
                                        id: "reset-current-pw",
                                        value: currentPasswordInput,
                                        onChange: (e) => setCurrentPasswordInput(e.target.value),
                                        fieldKey: "current",
                                        required: true
                                    })}
                                </div>
                                <div>
                                    <label style={labelStyle}>Neues Passwort (mind. 6 Zeichen)</label>
                                    {renderPasswordInput({
                                        id: "reset-new-pw",
                                        value: resetNewPassword,
                                        onChange: (e) => setResetNewPassword(e.target.value),
                                        fieldKey: "resetNew",
                                        required: true
                                    })}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isResetSending}
                                    style={{
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
                                    {isResetSending ? "Speichert..." : "Passwort aktualisieren"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit} style={{ display: "grid", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>E-Mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Passwort</label>
                                    {renderPasswordInput({
                                        id: "auth-pw",
                                        value: authPassword,
                                        onChange: (e) => setAuthPassword(e.target.value),
                                        fieldKey: "auth",
                                        required: true
                                    })}
                                </div>
                                {authMode === "register" && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Passwort bestätigen</label>
                                            {renderPasswordInput({
                                                id: "auth-pw-confirm",
                                                value: authPasswordConfirm,
                                                onChange: (e) => setAuthPasswordConfirm(e.target.value),
                                                fieldKey: "confirm",
                                                required: true
                                            })}
                                        </div>
                                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#ccc", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={privacyAccepted}
                                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                            />
                                            <span>Ich akzeptiere die Datenschutzerklärung (DSG/nDSG).</span>
                                        </label>
                                    </>
                                )}
                                <button
                                    type="submit"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
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
                                    <ShieldCheck size={15} />
                                    <span>{authMode === "register" ? "Konto erstellen" : "Einloggen"}</span>
                                </button>
                            </form>
                        )}

                        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #2b2b2b" }}>
                            <div style={{ fontSize: "11px", color: "#999", marginBottom: "8px" }}>
                                Demo-Zugänge (Passwort: <code>Password123</code>):
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {MOCK_USERS.map((u) => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => quickMockLogin(u)}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            border: "1px solid #3a3a3a",
                                            backgroundColor: "#242424",
                                            color: "#eee",
                                            fontSize: "11px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {u.firmaOderName}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={resetMockUsers}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #3a3a3a",
                                        backgroundColor: "#141414",
                                        color: "#ffd166",
                                        fontSize: "11px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <RotateCcw size={11} />
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImmobilienPortal;