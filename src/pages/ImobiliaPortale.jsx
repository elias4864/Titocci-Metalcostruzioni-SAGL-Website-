import React, { useState, useRef, useEffect } from "react";
import {
    Calculator,
    Send,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Lock,
    KeyRound,
    UserPlus,
    LogOut,
    LogIn,
    Calendar,
    Clock,
    MapPin,
    Building2,
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
    "Stahl feuerverzinkt & pulverbeschichtet": {
        factor: 1.15,
        label: "Stahl verzinkt + Pulver (RAL/Anthrazit)"
    },
    "Edelstahl V2A / V4A": {
        factor: 1.35,
        label: "Edelstahl (V2A / V4A)"
    },
    "Schmiedeeisen / Kunstschmiedearbeit": {
        factor: 1.45,
        label: "Schmiedeeisen (Massanfertigung)"
    },
    "Rohstahl geölt": {
        factor: 1.0,
        label: "Rohstahl (Innenbereich)"
    }
};

const MONTAGE_FACTORS = {
    "Standard-Montage": {
        factor: 1.0,
        label: "Standard-Montage"
    },
    "Sanierung inkl. Demontage & Entsorgung": {
        factor: 1.22,
        label: "Sanierung + Demontage/Entsorgung"
    },
    "Kran- / Gerüstbedarf / erschwerter Zugang": {
        factor: 1.18,
        label: "Kran / Gerüst / Zugang erschwert"
    }
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

const formatCHF = (amount) => {
    const safe = Number.isFinite(Number(amount)) ? Number(amount) : 0;
    return `${safe.toLocaleString("de-CH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} CHF`;
};

const formatCHFWhole = (amount) => {
    const safe = Number.isFinite(Number(amount)) ? Math.round(Number(amount)) : 0;
    return `${safe.toLocaleString("de-CH")} CHF`;
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
                {isAuthenticated
                    ? "Fehlende Berechtigung für diesen Bereich"
                    : "Geschützter Kunden- & Kalkulationsbereich"}
            </h2>

            <p
                style={{
                    margin: "0 auto 18px",
                    maxWidth: "560px",
                    color: "#bbb",
                    fontSize: "14px",
                    lineHeight: 1.5
                }}
            >
                {isAuthenticated
                    ? `Ihr Konto (${user.kundenTyp}) ist für diese Ansicht nicht freigeschaltet.`
                    : "Bitte melden Sie sich an, registrieren Sie ein Konto oder setzen Sie Ihr Passwort zurück, um Kalkulator und Direkt-Buchung zu nutzen."}
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

    const [protectPrivateSections, setProtectPrivateSections] = useState(false);
    const [useMockMode, setUseMockMode] = useState(
        !(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
    );

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [privacyAccepted, setPrivacyAccepted] = useState(true);
    const [kundenTyp, setKundenTyp] = useState("Immobilienverwaltung");
    const [firmaOderName, setFirmaOderName] = useState("");
    const [immobilienObjekt, setImmobilienObjekt] = useState("");
    const [authEmail, setAuthEmail] = useState("");

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
    const [locationInput, setLocationInput] = useState("Casa Locarno");
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [selectedTender] = useState("");

    const [lfm, setLfm] = useState(45);
    const [materialType, setMaterialType] = useState("Stahl feuerverzinkt & pulverbeschichtet");
    const [montageType, setMontageType] = useState("Standard-Montage");
    const [eigenmittelQuote, setEigenmittelQuote] = useState(20);
    const [zinssatz, setZinssatz] = useState(1.75);

    const [companyName, setCompanyName] = useState(() => currentUser?.firmaOderName || "Luca Bernasconi");
    const [email, setEmail] = useState(() => currentUser?.email || "luca@mock.ch");
    const [phone, setPhone] = useState("");
    const [projectNotes, setProjectNotes] = useState("");
    const [qm] = useState(120);
    const [canton] = useState("TI");

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
    const safeEigenmittelQuote = Math.min(100, Math.max(0, Number(eigenmittelQuote) || 0));
    const safeZinssatz = Math.min(25, Math.max(0, Number(zinssatz) || 0));

    const effectiveRatePerLfm = activeGewerk.baseRatePerLfm * activeMaterial.factor * activeMontage.factor;
    const estimatedMetalworkCost = safeLfm * effectiveRatePerLfm;
    const estimatedEigenmittel = estimatedMetalworkCost * (safeEigenmittelQuote / 100);
    const estimatedFremdkapital = Math.max(0, estimatedMetalworkCost - estimatedEigenmittel);
    const estimatedYearlyInterest = estimatedFremdkapital * (safeZinssatz / 100);

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
            if (authPassword.length < 8) {
                setAuthError("Das Passwort muss mindestens 8 Zeichen lang sein.");
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
            await new Promise((resolve) => setTimeout(resolve, 350));
            setIsSending(false);
            setBookingSubmitted(true);
            return true;
        }

        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            setSubmitError("EmailJS-Konfiguration fehlt (VITE_EMAILJS_* prüfen oder Mock-Modus aktivieren).");
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
                    `Laufmeter (lfm): ${safeLfm} lfm (Richtpreis: ${formatCHF(effectiveRatePerLfm)}/lfm)\n` +
                    `Material / Oberfläche: ${activeMaterial.label}\n` +
                    `Montage / Ausführung: ${activeMontage.label}\n` +
                    `Richtpreis Metallbau: ${formatCHF(estimatedMetalworkCost)}\n` +
                    `Eigenmittel (${safeEigenmittelQuote}%): ${formatCHFWhole(estimatedEigenmittel)} | Fremdkapital: ${formatCHFWhole(estimatedFremdkapital)}\n` +
                    `Kalk. Jahreszins (${safeZinssatz}%): ${formatCHF(estimatedYearlyInterest)}\n` +
                    `Standort: ${locationInput}\n` +
                    `Wunschtermin: ${visitDate || "Nicht angegeben"}${visitTime ? ` (${visitTime})` : ""}\n` +
                    `Wohnfläche: ${safeQm} m²\n` +
                    `Kanton: ${canton}\n` +
                    `Telefon: ${phone.trim() || "Keine Telefonnummer angegeben"}\n` +
                    `Geschätzter Quadratmeterpreis: ${formatCHF(finalPerQm)}\n` +
                    `Geschätzter Gesamtpreis: ${formatCHF(finalTotal)}\n` +
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

    const pageStyle = {
        minHeight: "100vh",
        backgroundColor: "#111111",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "16px 20px 48px"
    };

    const cardStyle = {
        maxWidth: "960px",
        margin: "20px auto",
        padding: "22px",
        borderRadius: "10px",
        backgroundColor: "#1a1a1a",
        border: "1px solid #2e2e2e"
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
        color: "#ccc",
        marginBottom: "6px"
    };

    const kpiCardStyle = (highlight = false) => ({
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#bbb",
        border: highlight ? "1px solid #e62b2b" : "1px solid #2c2c2c",
        textAlign: "center"
    });

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
            <section aria-label="Metallbau Kalkulator" style={cardStyle}>
                <h2
                    style={{
                        margin: "0 0 18px",
                        fontSize: "1.15rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <Calculator size={19} color="#e62b2b" />
                    <span>Metallbau- &amp; Finanzierungs-Richtpreisrechner</span>
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "14px",
                        marginBottom: "20px"
                    }}
                >
                    <div>
                        <label htmlFor="calc-gewerk" style={labelStyle}>
                            Gewerk ({activeGewerk.bkp} • {activeGewerk.normHint})
                        </label>
                        <select
                            id="calc-gewerk"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            style={inputStyle}
                        >
                            {Object.keys(GEWERK_CONFIG).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="calc-material" style={labelStyle}>
                            Material / Oberfläche
                        </label>
                        <select
                            id="calc-material"
                            value={materialType}
                            onChange={(e) => setMaterialType(e.target.value)}
                            style={inputStyle}
                        >
                            {Object.keys(MATERIAL_FACTORS).map((key) => (
                                <option key={key} value={key}>
                                    {MATERIAL_FACTORS[key].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="calc-montage" style={labelStyle}>
                            Montage / Ausführung
                        </label>
                        <select
                            id="calc-montage"
                            value={montageType}
                            onChange={(e) => setMontageType(e.target.value)}
                            style={inputStyle}
                        >
                            {Object.keys(MONTAGE_FACTORS).map((key) => (
                                <option key={key} value={key}>
                                    {MONTAGE_FACTORS[key].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="calc-lfm" style={labelStyle}>
                            Laufmeter (lfm)
                        </label>
                        <input
                            id="calc-lfm"
                            type="number"
                            min="0"
                            step="0.5"
                            value={lfm}
                            onChange={(e) => setLfm(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="calc-eigenmittel" style={labelStyle}>
                            Eigenmittelquote (%)
                        </label>
                        <input
                            id="calc-eigenmittel"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={eigenmittelQuote}
                            onChange={(e) => setEigenmittelQuote(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="calc-zins" style={labelStyle}>
                            Kalk. Zinssatz (%)
                        </label>
                        <input
                            id="calc-zins"
                            type="number"
                            min="0"
                            max="25"
                            step="0.05"
                            value={zinssatz}
                            onChange={(e) => setZinssatz(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: "12px"
                    }}
                >
                    <div style={kpiCardStyle(true)}>
                        <div style={{ fontSize: "12px", color: "#222" }}>Richtpreis Metallbau</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#111", marginTop: "4px" }}>
                            {formatCHF(estimatedMetalworkCost)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>
                            {formatCHF(effectiveRatePerLfm)} / lfm
                        </div>
                    </div>

                    <div style={kpiCardStyle(false)}>
                        <div style={{ fontSize: "12px", color: "#222" }}>Eigenmittel ({safeEigenmittelQuote}%)</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#111", marginTop: "4px" }}>
                            {formatCHFWhole(estimatedEigenmittel)}
                        </div>
                    </div>

                    <div style={kpiCardStyle(false)}>
                        <div style={{ fontSize: "12px", color: "#222" }}>Fremdkapital</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#111", marginTop: "4px" }}>
                            {formatCHFWhole(estimatedFremdkapital)}
                        </div>
                    </div>

                    <div style={kpiCardStyle(false)}>
                        <div style={{ fontSize: "12px", color: "#222" }}>Zins / Jahr ({safeZinssatz}%)</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#111", marginTop: "4px" }}>
                            {formatCHF(estimatedYearlyInterest)}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label="Direkt-Buchung" style={cardStyle}>
                <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem" }}>{t.bookingTitle}</h2>
                <p style={{ margin: "0 0 18px", color: "#bbb", fontSize: "14px" }}>{t.bookingSub}</p>

                <form onSubmit={handleBookingSubmit} style={{ display: "grid", gap: "14px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "12px"
                        }}
                    >
                        <input
                            ref={companyInputRef}
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={t.namePlaceholder}
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.emailPlaceholder}
                            style={inputStyle}
                        />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.phonePlaceholder}
                            style={inputStyle}
                        />
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "12px"
                        }}
                    >
                        <div>
                            <label htmlFor="booking-location" style={labelStyle}>
                                <MapPin size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                                Objekt / Standort
                            </label>
                            <input
                                id="booking-location"
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label htmlFor="booking-date" style={labelStyle}>
                                <Calendar size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                                Wunschdatum
                            </label>
                            <input
                                id="booking-date"
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label htmlFor="booking-time" style={labelStyle}>
                                <Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                                Wunschzeit
                            </label>
                            <input
                                id="booking-time"
                                type="time"
                                value={visitTime}
                                onChange={(e) => setVisitTime(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <textarea
                        rows={3}
                        value={projectNotes}
                        onChange={(e) => setProjectNotes(e.target.value)}
                        placeholder={t.projektDetails}
                        style={inputStyle}
                    />

                    {submitError && (
                        <div style={{ color: "#ff6b6b", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <AlertCircle size={16} />
                            <span>{submitError}</span>
                        </div>
                    )}

                    {bookingSubmitted && (
                        <div style={{ color: "#51cf66", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
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
                                padding: "11px 18px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
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
        <div style={pageStyle}>
            <header
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
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#ff6b6b" }}>
                        {t.heroTag}
                    </div>
                    <h1 style={{ margin: "4px 0 0", fontSize: "1.5rem" }}>{t.heroTitle}</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <label style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={protectPrivateSections}
                            onChange={(e) => setProtectPrivateSections(e.target.checked)}
                        />
                        <span>Bereich schützen</span>
                    </label>

                    <label style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={useMockMode}
                            onChange={(e) => setUseMockMode(e.target.checked)}
                        />
                        <span>Mock-Modus</span>
                    </label>

                    {currentUser ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #444",
                                backgroundColor: "#222",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            <LogOut size={14} />
                            <span>{t.logoutBtn} ({currentUser.firmaOderName})</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openAuthModal("login")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            <LogIn size={14} />
                            <span>{t.loginBtn}</span>
                        </button>
                    )}
                </div>
            </header>

            {protectPrivateSections ? (
                <ProtectedRoute user={currentUser} onRequireAuth={openAuthModal}>
                    {privateContent}
                </ProtectedRoute>
            ) : (
                privateContent
            )}

            {showAuthModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        zIndex: 1000
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
                            position: "relative"
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setShowAuthModal(false)}
                            aria-label="Schliessen"
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "12px",
                                background: "none",
                                border: "none",
                                color: "#ccc",
                                cursor: "pointer"
                            }}
                        >
                            <X size={18} />
                        </button>

                        <h2 style={{ margin: "0 0 12px", fontSize: "1.15rem" }}>
                            {authMode === "register"
                                ? "Konto registrieren"
                                : authMode === "reset"
                                    ? "Passwort zurücksetzen"
                                    : "Login"}
                        </h2>

                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                            <button type="button" onClick={() => setAuthMode("login")}>Login</button>
                            <button type="button" onClick={() => setAuthMode("register")}>Registrieren</button>
                            <button type="button" onClick={() => setAuthMode("reset")}>Passwort</button>
                        </div>

                        {authError && <div style={{ color: "#ff6b6b", fontSize: "13px", marginBottom: "10px" }}>{authError}</div>}
                        {authSuccess && <div style={{ color: "#51cf66", fontSize: "13px", marginBottom: "10px" }}>{authSuccess}</div>}

                        {authMode === "reset" ? (
                            <form onSubmit={handlePasswordReset} style={{ display: "grid", gap: "10px" }}>
                                <input
                                    type="email"
                                    required
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    placeholder="E-Mail-Adresse"
                                    style={inputStyle}
                                />
                                {renderPasswordInput({
                                    id: "reset-current-pw",
                                    value: currentPasswordInput,
                                    onChange: (e) => setCurrentPasswordInput(e.target.value),
                                    fieldKey: "current",
                                    placeholder: "Aktuelles Passwort",
                                    required: true
                                })}
                                {renderPasswordInput({
                                    id: "reset-new-pw",
                                    value: resetNewPassword,
                                    onChange: (e) => setResetNewPassword(e.target.value),
                                    fieldKey: "resetNew",
                                    placeholder: "Neues Passwort (mind. 8 Zeichen)",
                                    required: true
                                })}
                                <button type="submit" disabled={isResetSending} style={inputStyle}>
                                    {isResetSending ? "Wird gespeichert..." : "Passwort aktualisieren"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit} style={{ display: "grid", gap: "10px" }}>
                                {authMode === "register" && (
                                    <>
                                        <select
                                            value={kundenTyp}
                                            onChange={(e) => setKundenTyp(e.target.value)}
                                            style={inputStyle}
                                        >
                                            <option value="Immobilienverwaltung">Immobilienverwaltung</option>
                                            <option value="Privatkunde">Privatkunde</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={firmaOderName}
                                            onChange={(e) => setFirmaOderName(e.target.value)}
                                            placeholder="Firma oder Name"
                                            style={inputStyle}
                                        />
                                        <input
                                            type="text"
                                            value={immobilienObjekt}
                                            onChange={(e) => setImmobilienObjekt(e.target.value)}
                                            placeholder="Immobilienobjekt (optional)"
                                            style={inputStyle}
                                        />
                                    </>
                                )}

                                <input
                                    type="email"
                                    required
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    placeholder="E-Mail-Adresse"
                                    style={inputStyle}
                                />

                                {renderPasswordInput({
                                    id: "auth-password",
                                    value: authPassword,
                                    onChange: (e) => setAuthPassword(e.target.value),
                                    fieldKey: "auth",
                                    placeholder: "Passwort",
                                    required: true
                                })}

                                {authMode === "register" && (
                                    <>
                                        {renderPasswordInput({
                                            id: "auth-password-confirm",
                                            value: authPasswordConfirm,
                                            onChange: (e) => setAuthPasswordConfirm(e.target.value),
                                            fieldKey: "confirm",
                                            placeholder: "Passwort bestätigen",
                                            required: true
                                        })}
                                        <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <input
                                                type="checkbox"
                                                checked={privacyAccepted}
                                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                            />
                                            <span>Datenschutzerklärung akzeptieren</span>
                                        </label>
                                    </>
                                )}

                                <button type="submit" style={{ ...inputStyle, backgroundColor: "#e62b2b", border: "none", fontWeight: "bold" }}>
                                    {authMode === "register" ? "Registrieren" : "Einloggen"}
                                </button>
                            </form>
                        )}

                        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {MOCK_USERS.map((mu) => (
                                <button
                                    key={mu.id}
                                    type="button"
                                    onClick={() => quickMockLogin(mu)}
                                    style={{ fontSize: "11px", padding: "5px 8px", cursor: "pointer" }}
                                >
                                    <Building2 size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                                    {mu.firmaOderName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImmobilienPortal;