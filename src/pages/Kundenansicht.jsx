import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Schleifbild from "../assets/Schleifen3.jpg";
import Impressumbild from "../assets/Impressum.jpg";
import Holztreppe from "../assets/Holztreppe.jpg";
import Seitengitter from "../assets/Seitengitter.jpg";
import Gitter4 from "../assets/Gitter4.jpg";
import Calculator from "../pages/ImobiliaCalculatori.jsx";

import emailjs from "@emailjs/browser";

const KundenansichtImmobilien = ({ lang = "de" }) => {
    const translations = {
        de: {
            home: "Home",
            chiSiamo: "Über uns",
            servizi: "Leistungen",
            galeria: "Galerie",
            immobilien: "Immobilien & Ausschreibungen",
            kundenAnsicht: "Kundenansicht",
            kontakte: "Kontakt",
            badge: "KUNDENANSICHT • IMMOBILIEN & VERWALTUNGEN",
            title: "Ihre Immobilie im Fokus",
            subtitle: "Transparente Metallbau-Lösungen, Richtpreise und direkte Terminbuchung für Eigentümer, Verwaltungen und Architekten.",
            searchLabel: "Objekt oder Leistung filtern",
            searchPlaceholder: "z.B. Balkon, Treppe, Avegno, Tor...",
            kategorieLabel: "Bereich",
            alleKategorien: "Alle Bereiche",
            buchenBtn: "Aufmass / Beratung buchen",
            detailsBtn: "Referenz ansehen",
            bookingTitle: "Termin für Aufmass & Beratung vor Ort reservieren",
            bookingSubtitle: "Wählen Sie Ihr gewünschtes Objekt und Zeitfenster – wir melden uns rasch mit einer Terminbestätigung.",
            objektAuswahl: "Gewähltes Objekt / Paket",
            nameLabel: "Name / Immobilienverwaltung / Firma",
            emailLabel: "E-Mail-Adresse",
            datumLabel: "Wunschdatum",
            wunschpersonLabel: "Wunschperson / Ansprechperson",
            wunschpersonPlaceholder: "z.B. Projektleitung / Berater",
            telefonLabel: "Wunschtelefonnummer",
            nachrichtLabel: "Angaben zum Objekt (z.B. Anzahl Einheiten, Laufmeter, Besonderheiten)",
            absendenBtn: "Buchungsanfrage senden",
            erfolgMsg: "Vielen Dank! Ihre Terminanfrage für die Kundenberatung wurde erfasst.",
            neueAnfrageBtn: "Weitere Anfrage erfassen",
            rechnerTitle: "Schnelle Richtwert-Kalkulation"
        },
        it: {
            home: "Home",
            chiSiamo: "Chi siamo",
            servizi: "Servizi",
            galeria: "Galleria",
            immobilien: "Immobili & Appalti",
            kundenAnsicht: "Vista Clienti",
            kontakte: "Contatti",
            badge: "VISTA CLIENTI • IMMOBILI & AMMINISTRAZIONI",
            title: "Il vostro immobile al centro",
            subtitle: "Soluzioni di metalcostruzione, stime orientative e prenotazione diretta per proprietari, amministrazioni e architetti.",
            searchLabel: "Filtra immobile o servizio",
            searchPlaceholder: "es. balcone, scala, Avegno, cancello...",
            kategorieLabel: "Categoria",
            alleKategorien: "Tutte le categorie",
            buchenBtn: "Prenota rilievo / consulenza",
            detailsBtn: "Vedi riferimento",
            bookingTitle: "Prenota sopralluogo e consulenza in loco",
            bookingSubtitle: "Seleziona l'oggetto e la data desiderata: ti confermeremo l'appuntamento al più presto.",
            objektAuswahl: "Oggetto / Pacchetto selezionato",
            nameLabel: "Nome / Amministrazione / Azienda",
            emailLabel: "Indirizzo e-mail",
            datumLabel: "Data desiderata",
            wunschpersonLabel: "Referente / Persona desiderata",
            wunschpersonPlaceholder: "es. responsabile progetto / consulente",
            telefonLabel: "Numero di telefono desiderato",
            nachrichtLabel: "Dettagli sull'immobile (es. unità, metri lineari, note)",
            absendenBtn: "Invia richiesta di prenotazione",
            erfolgMsg: "Grazie! La tua richiesta di appuntamento per la consulenza clienti è stata registrata.",
            neueAnfrageBtn: "Nuova richiesta",
            rechnerTitle: "Calcolo indicativo rapido"
        },
        en: {
            home: "Home",
            chiSiamo: "About Us",
            servizi: "Services",
            galeria: "Gallery",
            immobilien: "Real Estate & Tenders",
            kundenAnsicht: "Client View",
            kontakte: "Contact",
            badge: "CLIENT VIEW • REAL ESTATE & PROPERTY MANAGERS",
            title: "Your Property in Focus",
            subtitle: "Clear metalwork packages, indicative pricing, and direct appointment booking for owners, managers, and architects.",
            searchLabel: "Filter property or service",
            searchPlaceholder: "e.g. balcony, stairs, Avegno, gate...",
            kategorieLabel: "Category",
            alleKategorien: "All categories",
            buchenBtn: "Book measurement / consultation",
            detailsBtn: "View reference",
            bookingTitle: "Book On-Site Measurement & Consultation",
            bookingSubtitle: "Choose your property package and preferred date – we will confirm your appointment promptly.",
            objektAuswahl: "Selected Property / Package",
            nameLabel: "Name / Property Management / Company",
            emailLabel: "Email Address",
            datumLabel: "Preferred Date",
            wunschpersonLabel: "Preferred Contact Person",
            wunschpersonPlaceholder: "e.g. project lead / advisor",
            telefonLabel: "Preferred Phone Number",
            nachrichtLabel: "Property details (e.g. units, linear meters, access notes)",
            absendenBtn: "Send booking request",
            erfolgMsg: "Thank you! Your client consultation request has been received.",
            neueAnfrageBtn: "New request",
            rechnerTitle: "Quick Estimate Calculator"
        },
        fr: {
            home: "Accueil",
            chiSiamo: "À propos",
            servizi: "Services",
            galeria: "Galerie",
            immobilien: "Immobilier & Appels d'offres",
            kundenAnsicht: "Vue Clients",
            kontakte: "Contact",
            badge: "VUE CLIENTS • IMMOBILIER & RÉGIES",
            title: "Votre bien immobilier au centre",
            subtitle: "Solutions de métallerie, estimations indicatives et réservation directe pour propriétaires, régies et architectes.",
            searchLabel: "Filtrer un bien ou une prestation",
            searchPlaceholder: "ex. balcon, escalier, Avegno, portail...",
            kategorieLabel: "Catégorie",
            alleKategorien: "Toutes les catégories",
            buchenBtn: "Réserver relevé / conseil",
            detailsBtn: "Voir référence",
            bookingTitle: "Réserver un relevé et conseil sur site",
            bookingSubtitle: "Sélectionnez votre lot et votre date souhaitée – nous vous confirmerons le rendez-vous rapidement.",
            objektAuswahl: "Bien / Pack sélectionné",
            nameLabel: "Nom / Régie / Entreprise",
            emailLabel: "Adresse e-mail",
            datumLabel: "Date souhaitée",
            wunschpersonLabel: "Interlocuteur souhaité",
            wunschpersonPlaceholder: "ex. chef de projet / conseiller",
            telefonLabel: "Numéro de téléphone souhaité",
            nachrichtLabel: "Détails du bien (ex. logements, mètres linéaires, remarques)",
            absendenBtn: "Envoyer la demande",
            erfolgMsg: "Merci ! Votre demande de rendez-vous client a bien été enregistrée.",
            neueAnfrageBtn: "Nouvelle demande",
            rechnerTitle: "Calculateur indicatif rapide"
        }
    };

    const t = translations[lang] || translations.de;

    const kundenObjekte = [
        {
            id: "OBJ-01",
            category: "Balkone",
            title: "Mehrfamilienhaus – Balkonbrüstungen (SIA 358)",
            region: "Avegno / Vallemaggia",
            priceHint: "Ab CHF 320.– / lfm inkl. Montage",
            description: "Witterungsbeständige Geländer und Brüstungen für Neubau und Sanierung von Wohnliegenschaften.",
            image: Impressumbild,
            externalUrl: "https://titocci.ch/a/avegno/parapetti-ad-avegno/"
        },
        {
            id: "OBJ-02",
            category: "Treppen",
            title: "Wohn- & Geschäftshaus – Treppen & Handläufe",
            region: "Locarno & Umgebung",
            priceHint: "Ab CHF 290.– / lfm inkl. Montage",
            description: "Präzise Treppenanlagen und Geländerlösungen mit sauberer Integration in bestehende Gebäudestrukturen.",
            image: Holztreppe,
            externalUrl: "https://titocci.ch/a/avegno/ringhiere-ad-avegno/"
        },
        {
            id: "OBJ-03",
            category: "Tore",
            title: "Wohnanlage & Gewerbe – Einfahrts- & Schiebetore",
            region: "Ascona / Gambarogno",
            priceHint: "Richtpreis nach Aufmass",
            description: "Stabile Zufahrts- und Sicherheitslösungen für Mehrfamilienhäuser, Tiefgaragen und Gewerbeparks.",
            image: Gitter4,
            externalUrl: "https://titocci.ch/a/avegno/cancellate-in-ferro-ad-avegno/"
        },
        {
            id: "OBJ-04",
            category: "Zäune",
            title: "Areal & Garten – Einfriedungen & Sichtschutz",
            region: "Tessin",
            priceHint: "Ab CHF 240.– / lfm inkl. Montage",
            description: "Langlebige Grundstücksbegrenzungen und Sicherheitsgitter für gepflegte Aussenanlagen.",
            image: Seitengitter,
            externalUrl: "https://titocci.ch/a/avegno/cancellate-per-giardino-ad-avegno/"
        }
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedObjectTitle, setSelectedObjectTitle] = useState(kundenObjekte[0].title);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [preferredPerson, setPreferredPerson] = useState("");
    const [preferredTel, setPreferredTel] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const categories = ["ALL", ...new Set(kundenObjekte.map((item) => item.category))];

    const filteredObjekte = useMemo(() => {
        return kundenObjekte.filter((item) => {
            const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
            const q = searchQuery.trim().toLowerCase();
            const matchesQuery =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.region.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);
            return matchesCategory && matchesQuery;
        });
    }, [searchQuery, selectedCategory]);

    const handleSelectForBooking = (title) => {
        setSelectedObjectTitle(title);
        setSubmitted(false);
        const bookingEl = document.getElementById("kunden-buchung");
        if (bookingEl) {
            bookingEl.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif" }}>
            {/* HEADER / HERO */}
            <div style={{ position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <nav
                    style={{
                        position: "relative",
                        zIndex: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 50px",
                        background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                        flexWrap: "wrap",
                        gap: "16px"
                    }}
                >
                    <div style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "1px", color: "#e62b2b" }}>
                        TITOCCI <span style={{ color: "#fff", fontWeight: "300" }}>METALCOSTRUZIONI</span>
                    </div>
                    <ul style={{ display: "flex", listStyle: "none", gap: "24px", margin: 0, padding: 0, flexWrap: "wrap", alignItems: "center" }}>
                        <li><Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.home}</Link></li>
                        <li><Link to="/chi-siamo" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.chiSiamo}</Link></li>
                        <li><Link to="/servizi" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.servizi}</Link></li>
                        <li><Link to="/galeria" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.galeria}</Link></li>
                        <li><Link to="/immobilien" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.immobilien}</Link></li>
                        <li>
                            <span style={{ color: "#fff", fontWeight: "bold", borderBottom: "3px solid #e62b2b", paddingBottom: "4px", fontSize: "14px" }}>
                                {t.kundenAnsicht}
                            </span>
                        </li>
                        <li><Link to="/kontakte" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>{t.kontakte}</Link></li>
                    </ul>
                </nav>

                <img
                    src={Schleifbild}
                    alt="Titocci Kundenansicht Immobilien"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(17,17,17,0.96) 100%)",
                        zIndex: 2
                    }}
                />

                <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "30px auto 50px", padding: "0 20px", textAlign: "center" }}>
                    <span
                        style={{
                            display: "inline-block",
                            backgroundColor: "rgba(230, 43, 43, 0.2)",
                            border: "1px solid #e62b2b",
                            color: "#ff7b7b",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            letterSpacing: "1.2px"
                        }}
                    >
                        {t.badge}
                    </span>
                    <h1 style={{ fontSize: "3rem", margin: "16px 0 12px", fontWeight: "bold" }}>{t.title}</h1>
                    <p style={{ color: "#cccccc", maxWidth: "740px", margin: "0 auto", fontSize: "1.1rem", lineHeight: "1.5" }}>
                        {t.subtitle}
                    </p>
                </div>
            </div>

            {/* HAUPTBEREICH: FILTER + KUNDEN-OBJEKTE */}
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 80px" }}>
                {/* Filterleiste */}
                <div
                    style={{
                        backgroundColor: "#1b1b1b",
                        border: "1px solid #2e2e2e",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "16px",
                        marginBottom: "36px"
                    }}
                >
                    <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                            {t.searchLabel}
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            style={{
                                width: "100%",
                                padding: "11px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#272727",
                                color: "#ffffff",
                                border: "1px solid #404040",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                            {t.kategorieLabel}
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "11px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#272727",
                                color: "#ffffff",
                                border: "1px solid #404040"
                            }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "ALL" ? t.alleKategorien : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Objektkarten */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px", marginBottom: "64px" }}>
                    {filteredObjekte.map((obj) => (
                        <article
                            key={obj.id}
                            style={{
                                backgroundColor: "#191919",
                                border: "1px solid #2d2d2d",
                                borderRadius: "12px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <div>
                                <img
                                    src={obj.image}
                                    alt={obj.title}
                                    style={{ width: "100%", height: "195px", objectFit: "cover", display: "block" }}
                                />
                                <div style={{ padding: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px", fontSize: "12px" }}>
                                        <span style={{ color: "#e62b2b", fontWeight: "bold" }}>{obj.priceHint}</span>
                                        <span style={{ color: "#999999" }}>{obj.region}</span>
                                    </div>
                                    <h2 style={{ margin: "0 0 10px", fontSize: "1.15rem" }}>{obj.title}</h2>
                                    <p style={{ margin: 0, color: "#bbbbbb", fontSize: "14px", lineHeight: "1.5" }}>
                                        {obj.description}
                                    </p>
                                </div>
                            </div>

                            <div style={{ padding: "0 20px 20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectForBooking(obj.title)}
                                    style={{
                                        flex: 1,
                                        padding: "10px 12px",
                                        backgroundColor: "#e62b2b",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "13px"
                                    }}
                                >
                                    {t.buchenBtn}
                                </button>
                                <a
                                    href={obj.externalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        padding: "10px 12px",
                                        backgroundColor: "#282828",
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        borderRadius: "6px",
                                        fontSize: "13px"
                                    }}
                                >
                                    {t.detailsBtn}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {/* BUCHUNGSFORMULAR FÜR KUNDEN */}
                <section
                    id="kunden-buchung"
                    style={{
                        backgroundColor: "#181818",
                        border: "1px solid #2f2f2f",
                        borderRadius: "14px",
                        padding: "30px",
                        marginBottom: "56px"
                    }}
                >
                    <h2 style={{ margin: "0 0 8px", fontSize: "1.6rem" }}>{t.bookingTitle}</h2>
                    <p style={{ margin: "0 0 24px", color: "#bbbbbb", fontSize: "14px" }}>{t.bookingSubtitle}</p>

                    {submitted ? (
                        <div
                            style={{
                                backgroundColor: "rgba(46, 204, 113, 0.12)",
                                border: "1px solid #2ecc71",
                                borderRadius: "10px",
                                padding: "20px"
                            }}
                        >
                            <p style={{ margin: "0 0 14px", color: "#a3f7c4", fontWeight: "bold" }}>{t.erfolgMsg}</p>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                style={{
                                    padding: "9px 16px",
                                    backgroundColor: "#2ecc71",
                                    color: "#111111",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                {t.neueAnfrageBtn}
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}
                        >
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.objektAuswahl}
                                </label>
                                <select
                                    value={selectedObjectTitle}
                                    onChange={(e) => setSelectedObjectTitle(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f"
                                    }}
                                >
                                    {kundenObjekte.map((item) => (
                                        <option key={item.id} value={item.title}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.nameLabel}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.datumLabel}
                                </label>
                                <input
                                    type="date"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.wunschpersonLabel}
                                </label>
                                <input
                                    type="text"
                                    value={preferredPerson}
                                    onChange={(e) => setPreferredPerson(e.target.value)}
                                    placeholder={t.wunschpersonPlaceholder}
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.telefonLabel}
                                </label>
                                <input
                                    type="tel"
                                    value={preferredTel}
                                    onChange={(e) => setPreferredTel(e.target.value)}
                                    placeholder="+41 ..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaaaaa", marginBottom: "6px" }}>
                                    {t.nachrichtLabel}
                                </label>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        borderRadius: "6px",
                                        backgroundColor: "#252525",
                                        color: "#ffffff",
                                        border: "1px solid #3f3f3f",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#e62b2b",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >
                                    {t.absendenBtn}
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                {/* KALKULATOR */}
                <section style={{ backgroundColor: "#181818", border: "1px solid #2f2f2f", borderRadius: "14px", padding: "30px" }}>
                    <h2 style={{ margin: "0 0 20px", fontSize: "1.5rem" }}>{t.rechnerTitle}</h2>
                    <Calculator lang={lang} />
                </section>
            </main>
        </div>
    );
};

export default KundenansichtImmobilien;