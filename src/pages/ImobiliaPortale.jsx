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
    ShieldCheck
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

/**
 * Reine Frontend-Protected-Route (kein Backend):
 * Prüft `user` und optional `allowedTypes` im Client-State.
 */
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
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(230, 43, 43, 0.15)", marginBottom: "12px" }}>
                <Lock size={20} color="#ff6b6b" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>
                {isAuthenticated ? "Fehlende Berechtigung für diesen Bereich" : "Geschützter Kunden- & Kalkulationsbereich"}
            </h2>
            <p style={{ margin: "0 auto 18px", maxWidth: "540px", color: "#bbb", fontSize: "14px", lineHeight: 1.5 }}>
                {isAuthenticated
                    ? `Ihr Konto (${user.kundenTyp}) ist für diese Ansicht nicht freigeschaltet.`
                    : "Bitte melden Sie sich mit Ihrem Kundenkonto an oder registrieren Sie ein Konto, um Kalkulator, Richtpreise und Direkt-Buchung zu nutzen. (Hinweis: Ohne Backend erfolgt die Prüfung rein clientseitig.)"}
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
                    Konto registrieren
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

    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("titocci_current_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Optional: Schalter für Frontend-Route-Schutz (standardmäßig aktiv)
    const [protectPrivateSections, setProtectPrivateSections] = useState(true);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login"); // "login" | "register" | "reset"
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [kundenTyp, setKundenTyp] = useState("Immobilienverwaltung");
    const [firmaOderName, setFirmaOderName] = useState("");
    const [immobilienObjekt, setImmobilienObjekt] = useState("");
    const [authEmail, setAuthEmail] = useState("");

    const [authPassword, setAuthPassword] = useState("");
    const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");

    const [showPasswordMap, setShowPasswordMap] = useState({
        auth: false,
        confirm: false,
        current: false,
        resetNew: false,
        resetConfirm: false
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

    const [selectedPropertyType, setSelectedPropertyType] = useState("Mehrfamilienhaus / Wohnbau");
    const [selectedService, setSelectedService] = useState("Parapetti & Balkongeländer");
    const [locationInput, setLocationInput] = useState("Avegno / Vallemaggia");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [selectedTender, setSelectedTender] = useState("");

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
        setPrivacyAccepted(false);
        setShowAuthModal(true);
    };

    const getStoredUsers = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem("titocci_kunden") || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
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
        if (resetNewPassword.length < 8) {
            setAuthError("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
            return;
        }
        if (resetNewPassword !== resetConfirmPassword) {
            setAuthError("Die neuen Passwörter stimmen nicht überein.");
            return;
        }
        if (currentPasswordInput === resetNewPassword) {
            setAuthError("Das neue Passwort muss sich vom bisherigen Passwort unterscheiden.");
            return;
        }

        const storedUsers = getStoredUsers();
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
        let mailSent = false;
        let mailWarning = "";
        try {
            if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
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
                        message:
                            `Hallo ${updatedUser.firmaOderName || cleanEmail},\n\n` +
                            `dein Passwort für das Titocci Immobilien- & Metallbauportal wurde am ${now} erfolgreich geändert.\n` +
                            `Falls du diese Änderung nicht selbst vorgenommen hast, kontaktiere uns bitte umgehend unter info@titocci.ch.`
                    },
                    EMAILJS_PUBLIC_KEY
                );
                mailSent = true;
            } else {
                mailWarning = " (Hinweis: EmailJS-Keys fehlen in den Umgebungsvariablen – Bestätigungs-E-Mail wurde nicht versendet.)";
            }
        } catch (error) {
            console.error("Fehler beim Senden der Passwort-Reset-E-Mail:", error);
            mailWarning = " (Bestätigungs-E-Mail konnte nicht gesendet werden.)";
        } finally {
            setIsResetSending(false);
        }

        setAuthPassword("");
        setAuthPasswordConfirm("");
        setCurrentPasswordInput("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setAuthSuccess(
            mailSent
                ? `Passwort geändert! Eine Bestätigung wurde an ${cleanEmail} gesendet.`
                : `Passwort erfolgreich geändert. Du kannst dich jetzt einloggen.${mailWarning}`
        );
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

        const storedUsers = getStoredUsers();

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

        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            setSubmitError("EmailJS-Konfiguration fehlt (VITE_EMAILJS_* Umgebungsvariablen prüfen).");
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

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px", backgroundColor: "#141414", padding: "14px", borderRadius: "8px", border: "1px solid #2b2b2b" }}>
                    <div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Richtpreis / lfm</div>
                        <div style={{ fontSize: "1.05rem", fontWeight: "bold" }}>{effectiveRatePerLfm.toFixed(2)} CHF</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Geschätzter Metallbau-Preis</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#ff6b6b" }}>{estimatedMetalworkCost.toFixed(2)} CHF</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Eigenmittel / Fremdkapital</div>
                        <div style={{ fontSize: "0.95rem" }}>
                            {estimatedEigenmittel.toFixed(0)} / {estimatedFremdkapital.toFixed(0)} CHF
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Kalk. Jahreszins</div>
                        <div style={{ fontSize: "0.95rem" }}>{estimatedYearlyInterest.toFixed(2)} CHF / Jahr</div>
                    </div>
                </div>
            </section>

            {/* Direkt-Buchung & Anfrage */}
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
                <p style={{ margin: "0 0 16px", color: "#bbb", fontSize: "14px" }}>{t.bookingSub}</p>

                {bookingSubmitted && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "6px", backgroundColor: "rgba(46, 204, 113, 0.14)", border: "1px solid #2ecc71", color: "#2ecc71", marginBottom: "14px", fontSize: "14px" }}>
                        <CheckCircle2 size={18} />
                        <span>{t.bookingSuccess}</span>
                    </div>
                )}

                {submitError && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "6px", backgroundColor: "rgba(230, 43, 43, 0.14)", border: "1px solid #e62b2b", color: "#ff8080", marginBottom: "14px", fontSize: "14px" }}>
                        <AlertCircle size={18} />
                        <span>{submitError}</span>
                    </div>
                )}

                <form onSubmit={handleBookingSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                    <div>
                        <label style={labelStyle}>{t.namePlaceholder}</label>
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
                        <label style={labelStyle}>{t.emailPlaceholder} *</label>
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
                        <label style={labelStyle}>{t.phonePlaceholder}</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.phonePlaceholder}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Standort / Gemeinde</label>
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Immobilientyp</label>
                        <input
                            type="text"
                            value={selectedPropertyType}
                            onChange={(e) => setSelectedPropertyType(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Ausschreibungs- / Projekt-Ref.</label>
                        <input
                            type="text"
                            value={selectedTender}
                            onChange={(e) => setSelectedTender(e.target.value)}
                            placeholder="z.B. Ausschreibung 2026-04"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Wunschdatum Begehung</label>
                        <input
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Wunschzeitfenster</label>
                        <input
                            type="text"
                            value={visitTime}
                            onChange={(e) => setVisitTime(e.target.value)}
                            placeholder="z.B. 09:00 - 11:00"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Wohnfläche (m²)</label>
                        <input
                            type="number"
                            min="1"
                            value={qm}
                            onChange={(e) => setQm(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Kanton</label>
                        <input
                            type="text"
                            maxLength="5"
                            value={canton}
                            onChange={(e) => setCanton(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Projektbeschreibung</label>
                        <textarea
                            rows="3"
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            placeholder={t.projektDetails}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <button
                            type="submit"
                            disabled={isSending}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "11px 18px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: isSending ? "#7a1c1c" : "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                cursor: isSending ? "not-allowed" : "pointer"
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
        <div style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "48px" }}>
            <header
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    borderBottom: "1px solid #262626"
                }}
            >
                <div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#ff6b6b" }}>{t.heroTag}</div>
                    <h1 style={{ margin: "2px 0 0", fontSize: "1.35rem" }}>{t.heroTitle}</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={() => setProtectPrivateSections((prev) => !prev)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "7px 11px",
                            borderRadius: "6px",
                            border: "1px solid #3a3a3a",
                            backgroundColor: protectPrivateSections ? "#232a25" : "#222",
                            color: protectPrivateSections ? "#7be09c" : "#bbb",
                            fontSize: "12px",
                            cursor: "pointer"
                        }}
                        title="Clientseitigen Route-Schutz für Kalkulator & Buchung umschalten"
                    >
                        <ShieldCheck size={14} />
                        <span>Route-Guard: {protectPrivateSections ? "AN" : "AUS"}</span>
                    </button>

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

            {/* Öffentlicher Profilbereich */}
            <section
                aria-label="Profil Person"
                style={{
                    maxWidth: "960px",
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

            {/* Geschützter Bereich ohne Backend */}
            {protectPrivateSections ? (
                <ProtectedRoute user={currentUser} onRequireAuth={openAuthModal}>
                    {privateContent}
                </ProtectedRoute>
            ) : (
                privateContent
            )}

            {/* Auth Modal */}
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
                            position: "relative",
                            maxHeight: "90vh",
                            overflowY: "auto"
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

                        <h3 style={{ margin: "0 0 14px", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={20} color="#e62b2b" />
                            <span>
                                {authMode === "login"
                                    ? "Login-Ansicht"
                                    : authMode === "register"
                                        ? "Kunde & Immobilie registrieren"
                                        : "Passwort ändern"}
                            </span>
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "18px" }}>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccess(""); }}
                                style={{
                                    padding: "9px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    backgroundColor: authMode === "login" ? "#e62b2b" : "#282828",
                                    color: "#fff"
                                }}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("register"); setAuthError(""); setAuthSuccess(""); }}
                                style={{
                                    padding: "9px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    backgroundColor: authMode === "register" ? "#e62b2b" : "#282828",
                                    color: "#fff"
                                }}
                            >
                                Registrieren
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("reset"); setAuthError(""); setAuthSuccess(""); }}
                                style={{
                                    padding: "9px",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    backgroundColor: authMode === "reset" ? "#e62b2b" : "#282828",
                                    color: "#fff"
                                }}
                            >
                                Passwort
                            </button>
                        </div>

                        {authError && (
                            <div style={{ padding: "10px 12px", borderRadius: "6px", backgroundColor: "rgba(230,43,43,0.15)", border: "1px solid #e62b2b", color: "#ff8080", fontSize: "13px", marginBottom: "14px" }}>
                                {authError}
                            </div>
                        )}

                        {authSuccess && (
                            <div style={{ padding: "10px 12px", borderRadius: "6px", backgroundColor: "rgba(46,204,113,0.15)", border: "1px solid #2ecc71", color: "#2ecc71", fontSize: "13px", marginBottom: "14px" }}>
                                {authSuccess}
                            </div>
                        )}

                        {authMode === "reset" ? (
                            <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label htmlFor="reset-email" style={labelStyle}>E-Mail-Adresse</label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        required
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        placeholder="name@firma.ch"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reset-current-pw" style={labelStyle}>Aktuelles Passwort</label>
                                    {renderPasswordInput({
                                        id: "reset-current-pw",
                                        value: currentPasswordInput,
                                        onChange: (e) => setCurrentPasswordInput(e.target.value),
                                        fieldKey: "current",
                                        required: true
                                    })}
                                </div>
                                <div>
                                    <label htmlFor="reset-new-pw" style={labelStyle}>Neues Passwort (min. 8 Zeichen)</label>
                                    {renderPasswordInput({
                                        id: "reset-new-pw",
                                        value: resetNewPassword,
                                        onChange: (e) => setResetNewPassword(e.target.value),
                                        fieldKey: "resetNew",
                                        required: true
                                    })}
                                </div>
                                <div>
                                    <label htmlFor="reset-confirm-pw" style={labelStyle}>Neues Passwort bestätigen</label>
                                    {renderPasswordInput({
                                        id: "reset-confirm-pw",
                                        value: resetConfirmPassword,
                                        onChange: (e) => setResetConfirmPassword(e.target.value),
                                        fieldKey: "resetConfirm",
                                        required: true
                                    })}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isResetSending}
                                    style={{
                                        padding: "11px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        marginTop: "4px"
                                    }}
                                >
                                    {isResetSending ? "Wird gespeichert & gesendet..." : "Passwort aktualisieren & E-Mail senden"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {authMode === "register" && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Kundentyp</label>
                                            <select value={kundenTyp} onChange={(e) => setKundenTyp(e.target.value)} style={inputStyle}>
                                                <option value="Immobilienverwaltung">Immobilienverwaltung</option>
                                                <option value="Generalunternehmer / Bau">Generalunternehmer / Bau</option>
                                                <option value="Privatkunde / Eigentümer">Privatkunde / Eigentümer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Firma, Verwaltung oder Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={firmaOderName}
                                                onChange={(e) => setFirmaOderName(e.target.value)}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Immobilienobjekt / Standort (optional)</label>
                                            <input
                                                type="text"
                                                value={immobilienObjekt}
                                                onChange={(e) => setImmobilienObjekt(e.target.value)}
                                                placeholder="z.B. Via Cantonale 12, Locarno"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label style={labelStyle}>E-Mail-Adresse *</label>
                                    <input
                                        type="email"
                                        required
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        placeholder="name@firma.ch"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Passwort *</label>
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
                                            <label style={labelStyle}>Passwort bestätigen *</label>
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
                                            <span>Ich akzeptiere die Datenschutzerklärung (DSG / nDSG).</span>
                                        </label>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        padding: "11px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        marginTop: "4px"
                                    }}
                                >
                                    {authMode === "login" ? "Einloggen" : "Konto erstellen"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImmobilienPortal;