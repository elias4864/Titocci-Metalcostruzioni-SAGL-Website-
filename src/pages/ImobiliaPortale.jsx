import React, { useState, useRef, useEffect, useCallback } from "react";
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
    Users,
    Heart,
    Edit3,
    Save,
    X
} from "lucide-react";

const STORAGE_KEY_INSERATE = "titocci_immobilien_inserate";
const STORAGE_KEY_FAVORITES = "titocci_immobilien_favoriten";

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
            bookingSub: "Wählen Sie Ihr Projektfenster und speichern Sie Ihre Anfrage lokal im Portal.",
            namePlaceholder: "Firma / Verwaltung / Name",
            emailPlaceholder: "Geschäftliche E-Mail",
            phonePlaceholder: "Telefonnummer (optional)",
            projektDetails: "Beschreiben Sie kurz das Bauvorhaben (z.B. 45 lfm Balkongeländer, Sanierung Mehrfamilienhaus)...",
            bookingSubmit: "Termin verbindlich anfragen",
            bookingSuccess: "Vielen Dank! Ihre Anfrage wurde erfolgreich lokal erfasst.",
            bookingError: "Beim Speichern ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
        }
    };

    const t = translations[lang] || translations.de;

    const getStoredUsers = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem("titocci_kunden") || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const ensureSeedUsers = useCallback((force = false) => {
        const current = getStoredUsers();
        if (current.length === 0 || force) {
            localStorage.setItem("titocci_kunden", JSON.stringify(MOCK_USERS));
            return MOCK_USERS;
        }
        return current;
    }, []);

    useEffect(() => {
        ensureSeedUsers(false);
    }, [ensureSeedUsers]);

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("titocci_current_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isEditingProfileObjekt, setIsEditingProfileObjekt] = useState(false);
    const [profileObjektDraft, setProfileObjektDraft] = useState("");

    const [inserate, setInserate] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_INSERATE) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    });

    const [favoriteIds, setFavoriteIds] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITES) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    });

    const [protectPrivateSections] = useState(false);

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
            setProfileObjektDraft(currentUser.immobilienObjekt || "");
            if (currentUser.immobilienObjekt) {
                setLocationInput(currentUser.immobilienObjekt);
            }
        } else {
            setIsEditingProfileObjekt(false);
            setProfileObjektDraft("");
        }
    }, [currentUser]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favoriteIds));
        } catch {
            // Storage-Fehler ignorieren
        }
    }, [favoriteIds]);

    const handleSaveProfileObjekt = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const nextObjekt = profileObjektDraft.trim();
        const updatedUser = {
            ...currentUser,
            immobilienObjekt: nextObjekt
        };

        const storedUsers = ensureSeedUsers(false);
        const updatedUsers = storedUsers.map((u) =>
            u.email === currentUser.email ? { ...u, immobilienObjekt: nextObjekt } : u
        );

        localStorage.setItem("titocci_kunden", JSON.stringify(updatedUsers));
        localStorage.setItem("titocci_current_user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        if (nextObjekt) {
            setLocationInput(nextObjekt);
        }
        setIsEditingProfileObjekt(false);
    };

    const handleRemoveFavoriteInProfile = (id) => {
        setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
    };

    const favoriteImmobilien = inserate.filter((item) => favoriteIds.includes(item.id));

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

        setIsResetSending(true);
        try {
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

            setCurrentPasswordInput("");
            setResetNewPassword("");
            setAuthSuccess(`Passwort für ${cleanEmail} erfolgreich aktualisiert. Du kannst dich jetzt einloggen.`);
            setAuthMode("login");
        } catch (error) {
            console.error("Fehler beim Zurücksetzen des Passworts:", error);
            setAuthError("Passwort konnte nicht aktualisiert werden.");
        } finally {
            setIsResetSending(false);
        }
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

    const saveInquiryLocally = async ({
                                          calculatedTotalPrice = 0,
                                          calculatedPricePerQm = 0,
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
        const safeQm = Math.max(1, Number(qm) || 1);
        const finalTotal = Number(calculatedTotalPrice) || estimatedMetalworkCost;
        const finalPerQm = Number(calculatedPricePerQm) || finalTotal / safeQm;

        try {
            const inquiryRecord = {
                id: Date.now(),
                createdAt: new Date().toISOString(),
                customer: currentUser
                    ? `${currentUser.firmaOderName} (${currentUser.kundenTyp})`
                    : "Gast",
                companyName: companyName.trim() || "Nicht angegeben",
                email: email.trim(),
                phone: phone.trim() || "Keine Telefonnummer angegeben",
                tenderRef: selectedTender.trim() || "Keine Referenz gewählt",
                propertyType: selectedPropertyType,
                serviceType: selectedService,
                bkp: activeGewerk.bkp,
                material: activeMaterial.label,
                montage: activeMontage.label,
                lfm: safeLfm,
                estimatedMetalworkCost: finalTotal,
                estimatedPricePerQm: finalPerQm,
                eigenmittelQuote: safeEigenmittelQuote,
                estimatedEigenmittel,
                estimatedFremdkapital,
                zinssatz: safeZinssatz,
                estimatedYearlyInterest,
                location: locationInput || "Nicht angegeben",
                visitDate: visitDate || "Kein Wunschdatum angegeben",
                visitTime: visitTime || "",
                qm: safeQm,
                canton,
                pdfFilename: attachedPdfName || "",
                projectNotes: projectNotes.trim(),
                customMessage
            };

            const existing = JSON.parse(localStorage.getItem("titocci_anfragen") || "[]");
            const nextList = Array.isArray(existing) ? [inquiryRecord, ...existing] : [inquiryRecord];
            localStorage.setItem("titocci_anfragen", JSON.stringify(nextList));

            setBookingSubmitted(true);
            return true;
        } catch (error) {
            console.error("Fehler beim Speichern der Anfrage:", error);
            setSubmitError(t.bookingError);
            return false;
        } finally {
            setIsSending(false);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        await saveInquiryLocally({
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
        backgroundColor: "#141414",
        color: "#f5f5f5",
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

    const userProfileSection = currentUser && (
        <section aria-label="Benutzerprofil & Immobilien" style={cardStyle}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "16px"
                }}
            >
                <div>
                    <div style={{ fontSize: "11px", color: "#ff6b6b", fontWeight: "bold", letterSpacing: "0.06em" }}>
                        BENUTZERPROFIL • {currentUser.kundenTyp}
                    </div>
                    <h2 style={{ margin: "4px 0 0", fontSize: "1.15rem" }}>
                        {currentUser.firmaOderName}
                    </h2>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "2px" }}>
                        {currentUser.email}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setProfileObjektDraft(currentUser.immobilienObjekt || "");
                        setIsEditingProfileObjekt((prev) => !prev);
                    }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #3c3c3c",
                        backgroundColor: "#242424",
                        color: "#fff",
                        fontSize: "12px",
                        cursor: "pointer"
                    }}
                >
                    <Edit3 size={14} />
                    <span>{isEditingProfileObjekt ? "Abbrechen" : "Objekt bearbeiten"}</span>
                </button>
            </div>

            {/* Hinterlegtes Haupt-Immobilienobjekt */}
            <div
                style={{
                    padding: "14px",
                    borderRadius: "8px",
                    backgroundColor: "#141414",
                    border: "1px solid #2c2c2c",
                    marginBottom: "18px"
                }}
            >
                <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "6px", fontWeight: "bold" }}>
                    Hinterlegtes Immobilien-Objekt im Profil
                </div>

                {isEditingProfileObjekt ? (
                    <form onSubmit={handleSaveProfileObjekt} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            value={profileObjektDraft}
                            onChange={(e) => setProfileObjektDraft(e.target.value)}
                            placeholder="z.B. Casa Locarno / Residenza Avegno"
                            style={{ ...inputStyle, flex: "1 1 240px" }}
                        />
                        <button
                            type="submit"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
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
                            <Save size={14} />
                            <span>Speichern</span>
                        </button>
                    </form>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#fff" }}>
                        <Building2 size={16} color="#ff6b6b" />
                        <span>{currentUser.immobilienObjekt || "Kein Immobilien-Objekt hinterlegt"}</span>
                    </div>
                )}
            </div>

            {/* Gemerkte Favoriten-Immobilien aus dem Inserate-Bereich */}
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#fda4af",
                        marginBottom: "10px"
                    }}
                >
                    <Heart size={15} fill="#f43f5e" color="#f43f5e" />
                    <span>Gemerkte Immobilien ({favoriteImmobilien.length})</span>
                </div>

                {favoriteImmobilien.length === 0 ? (
                    <div
                        style={{
                            padding: "16px",
                            borderRadius: "8px",
                            backgroundColor: "#141414",
                            border: "1px solid #2c2c2c",
                            color: "#aaa",
                            fontSize: "13px"
                        }}
                    >
                        Aktuell sind keine favorisierten Immobilien gespeichert.
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "12px"
                        }}
                    >
                        {favoriteImmobilien.map((immo) => (
                            <div
                                key={immo.id}
                                style={{
                                    padding: "14px",
                                    borderRadius: "8px",
                                    backgroundColor: "#141414",
                                    border: "1px solid #f43f5e",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px"
                                }}
                            >
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
                                    {immo.title}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#bbb" }}>
                                    <MapPin size={13} color="#ff6b6b" />
                                    <span>{immo.ort}</span>
                                </div>
                                <div style={{ fontSize: "12px", color: "#bbb" }}>
                                    {immo.zimmer} • {immo.flaeche || "120 m²"}
                                </div>
                                {immo.personen && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#bbb" }}>
                                        <Users size={13} color="#ff6b6b" />
                                        <span>{immo.personen} im Haus</span>
                                    </div>
                                )}
                                <div
                                    style={{
                                        marginTop: "auto",
                                        paddingTop: "6px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <span style={{ fontWeight: "bold", fontSize: "13px", color: "#4ade80" }}>
                                        {immo.preis}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFavoriteInProfile(immo.id)}
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "5px",
                                            border: "1px solid #444",
                                            backgroundColor: "#222",
                                            color: "#fda4af",
                                            fontSize: "11px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

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
                            step="1"
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
                            Kalk. Zinssatz (% p.a.)
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
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Richtpreis Metallbau</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", marginTop: "4px" }}>
                            {formatCHF(estimatedMetalworkCost)}
                        </div>
                    </div>
                    <div style={kpiCardStyle()}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Eigenmittel</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", marginTop: "4px" }}>
                            {formatCHFWhole(estimatedEigenmittel)}
                        </div>
                    </div>
                    <div style={kpiCardStyle()}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Fremdkapital</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", marginTop: "4px" }}>
                            {formatCHFWhole(estimatedFremdkapital)}
                        </div>
                    </div>
                    <div style={kpiCardStyle()}>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>Kalk. Zins / Jahr</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: "bold", marginTop: "4px" }}>
                            {formatCHFWhole(estimatedYearlyInterest)}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label="Direkt-Buchung" style={cardStyle}>
                <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem" }}>{t.bookingTitle}</h2>
                <p style={{ margin: "0 0 18px", color: "#bbb", fontSize: "13px" }}>{t.bookingSub}</p>

                <form
                    onSubmit={handleBookingSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "12px"
                    }}
                >
                    <div>
                        <label htmlFor="booking-company" style={labelStyle}>Firma / Verwaltung / Name</label>
                        <input
                            id="booking-company"
                            ref={companyInputRef}
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={t.namePlaceholder}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="booking-email" style={labelStyle}>Geschäftliche E-Mail *</label>
                        <input
                            id="booking-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.emailPlaceholder}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="booking-phone" style={labelStyle}>Telefon (optional)</label>
                        <input
                            id="booking-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.phonePlaceholder}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="booking-location" style={labelStyle}>Objekt / Standort</label>
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
                            <Calendar size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
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
                            <Clock size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
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

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label htmlFor="booking-notes" style={labelStyle}>Projektbeschreibung</label>
                        <textarea
                            id="booking-notes"
                            rows={3}
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            placeholder={t.projektDetails}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
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
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                        >
                            <Send size={15} />
                            <span>{isSending ? "Wird gespeichert..." : t.bookingSubmit}</span>
                        </button>

                        {bookingSubmitted && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#4ade80", fontSize: "13px" }}>
                                <CheckCircle2 size={16} />
                                <span>{t.bookingSuccess}</span>
                            </span>
                        )}

                        {submitError && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ff6b6b", fontSize: "13px" }}>
                                <AlertCircle size={16} />
                                <span>{submitError}</span>
                            </span>
                        )}
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
                    paddingBottom: "16px",
                    borderBottom: "1px solid #262626",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                }}
            >
                <div>
                    <div style={{ fontSize: "11px", color: "#ff6b6b", fontWeight: "bold", letterSpacing: "0.06em" }}>
                        {t.heroTag}
                    </div>
                    <h1 style={{ margin: "4px 0 0", fontSize: "1.6rem" }}>{t.heroTitle}</h1>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontSize: "13px", color: "#ddd" }}>
                                {currentUser.firmaOderName}
                            </span>
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
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}
                            >
                                <LogOut size={14} />
                                <span>{t.logoutBtn}</span>
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
                                fontWeight: "bold",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            <LogIn size={14} />
                            <span>{t.loginBtn}</span>
                        </button>
                    )}
                </div>
            </header>

            {userProfileSection}

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
                        backgroundColor: "rgba(0,0,0,0.75)",
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
                            padding: "22px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <h2 style={{ margin: 0, fontSize: "1.15rem" }}>
                                {authMode === "register"
                                    ? "Konto registrieren"
                                    : authMode === "reset"
                                        ? "Passwort zurücksetzen"
                                        : "Login"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAuthModal(false)}
                                style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
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
                                        flex: 1,
                                        padding: "7px",
                                        borderRadius: "6px",
                                        border: "1px solid #383838",
                                        backgroundColor: authMode === mode ? "#e62b2b" : "#141414",
                                        color: "#fff",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {mode === "login" ? "Login" : mode === "register" ? "Registrieren" : "Passwort"}
                                </button>
                            ))}
                        </div>

                        {authError && (
                            <div style={{ color: "#ff6b6b", fontSize: "12px", marginBottom: "10px" }}>{authError}</div>
                        )}
                        {authSuccess && (
                            <div style={{ color: "#4ade80", fontSize: "12px", marginBottom: "10px" }}>{authSuccess}</div>
                        )}

                        {authMode === "reset" ? (
                            <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                                    <label style={labelStyle}>Neues Passwort (min. 8 Zeichen)</label>
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
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    {isResetSending ? "Speichert..." : "Passwort aktualisieren"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {authMode === "register" && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Kundentyp</label>
                                            <select
                                                value={kundenTyp}
                                                onChange={(e) => setKundenTyp(e.target.value)}
                                                style={inputStyle}
                                            >
                                                <option value="Immobilienverwaltung">Immobilienverwaltung</option>
                                                <option value="Privatkunde">Privatkunde</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Firma / Name</label>
                                            <input
                                                type="text"
                                                value={firmaOderName}
                                                onChange={(e) => setFirmaOderName(e.target.value)}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Immobilien-Objekt</label>
                                            <input
                                                type="text"
                                                value={immobilienObjekt}
                                                onChange={(e) => setImmobilienObjekt(e.target.value)}
                                                placeholder="z.B. Casa Locarno"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </>
                                )}

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
                                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#ccc" }}>
                                            <input
                                                type="checkbox"
                                                checked={privacyAccepted}
                                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                            />
                                            <span>Datenschutzerklärung (DSG) akzeptieren</span>
                                        </label>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    {authMode === "register" ? "Registrieren" : "Einloggen"}
                                </button>
                            </form>
                        )}

                        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #2c2c2c" }}>
                            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px" }}>Demo-Login:</div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {MOCK_USERS.map((mu) => (
                                    <button
                                        key={mu.id}
                                        type="button"
                                        onClick={() => quickMockLogin(mu)}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: "5px",
                                            border: "1px solid #3c3c3c",
                                            backgroundColor: "#141414",
                                            color: "#ddd",
                                            fontSize: "11px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {mu.firmaOderName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImmobilienPortal;