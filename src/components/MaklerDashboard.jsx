import React, { useState } from "react";
import {
    Building2,
    PlusCircle,
    Users,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    Edit3,
    FileText,
    Sparkles,
    ShieldCheck,
    MessageSquare,
    Save,
    MapPin,
    Tag,
    X
} from "lucide-react";

export default function MaklerDashboard({
    inserate = [],
    onUpdateStatus,
    onCreateInserat,
    onDeleteInserat,
    leads = [],
    onUpdateLeadStatus,
    onAddLead,
    lang = "de"
}) {
    const isIt = lang === "it";
    const [activeTab, setActiveTab] = useState("inserate"); // "inserate" | "neu" | "leads"
    const [statusFilter, setStatusFilter] = useState("alle");

    // Formular für neues Inserat
    const [formTitle, setFormTitle] = useState("");
    const [formOrt, setFormOrt] = useState("Locarno TI");
    const [formPreis, setFormPreis] = useState("");
    const [formZimmer, setFormZimmer] = useState("4.5 Zimmer");
    const [formFlaeche, setFormFlaeche] = useState("");
    const [formPersonen, setFormPersonen] = useState("4");
    const [formTag, setFormTag] = useState("Neu");
    const [formStatus, setFormStatus] = useState("Aktiv");
    const [formMetallbauNote, setFormMetallbauNote] = useState("");

    // Formular für neuen Lead (manuelle Erfassung)
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");
    const [leadPhone, setLeadPhone] = useState("");
    const [leadObjekt, setLeadObjekt] = useState("");
    const [leadNote, setLeadNote] = useState("");
    const [showNewLeadModal, setShowNewLeadModal] = useState(false);

    // KPI-Berechnungen
    const totalCount = inserate.length;
    const activeCount = inserate.filter((item) => (item.status || "Aktiv") === "Aktiv").length;
    const reservedCount = inserate.filter((item) => item.status === "Reserviert").length;
    const soldCount = inserate.filter((item) => item.status === "Verkauft").length;

    // Gesamtportfoliowert berechnen
    const totalVolume = inserate.reduce((acc, curr) => {
        const num = parseInt(String(curr.preis).replace(/[^0-9]/g, ""), 10);
        return acc + (isNaN(num) ? 0 : num);
    }, 0);

    const openLeadsCount = leads.filter((l) => l.status === "Neu" || l.status === "In Prüfung").length;

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!formTitle.trim()) {
            alert(isIt ? "Inserisci un titolo valido" : "Bitte geben Sie einen Objekttitel ein");
            return;
        }

        const newItem = {
            id: Date.now(),
            title: formTitle.trim(),
            ort: formOrt,
            preis: formPreis.includes("CHF") ? formPreis : `${formPreis || "Auf Anfrage"} CHF`,
            zimmer: formZimmer,
            flaeche: formFlaeche.includes("m²") ? formFlaeche : `${formFlaeche || "100"} m²`,
            personen: `${formPersonen || "4"} Personen`,
            tag: formTag,
            status: formStatus,
            metallbauNote: formMetallbauNote || "Geländer nach SIA 358 & Korrosionsschutz inklusive",
            image: null
        };

        onCreateInserat(newItem);

        // Reset
        setFormTitle("");
        setFormPreis("");
        setFormFlaeche("");
        setFormMetallbauNote("");
        setActiveTab("inserate");
    };

    const handleAddLeadSubmit = (e) => {
        e.preventDefault();
        if (!leadName.trim() || !leadEmail.trim()) {
            alert(isIt ? "Inserisci nome ed e-mail" : "Bitte Name und E-Mail eingeben");
            return;
        }

        const newLead = {
            id: Date.now(),
            name: leadName.trim(),
            email: leadEmail.trim(),
            phone: leadPhone.trim() || "+41 91 000 00 00",
            objektTitle: leadObjekt || (inserate[0]?.title || "Allgemeine Anfrage"),
            status: "Neu",
            date: new Date().toLocaleDateString("de-CH"),
            note: leadNote.trim() || "Direkte Anfrage über Portal"
        };

        onAddLead(newLead);
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
        setLeadNote("");
        setShowNewLeadModal(false);
    };

    const filteredInserate = inserate.filter((item) => {
        const itemStatus = item.status || "Aktiv";
        if (statusFilter === "alle") return true;
        return itemStatus === statusFilter;
    });

    return (
        <div
            style={{
                backgroundColor: "#161616",
                border: "1px solid #2d2d2d",
                borderRadius: "14px",
                padding: "24px",
                marginBottom: "32px",
                boxShadow: "0 12px 36px rgba(0,0,0,0.4)"
            }}
        >
            {/* Header & Tabs */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "14px",
                    paddingBottom: "18px",
                    borderBottom: "1px solid #262626"
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                            style={{
                                backgroundColor: "#b91c1c",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: "bold",
                                padding: "3px 8px",
                                borderRadius: "4px"
                            }}
                        >
                            MAKLER-PORTAL &amp; CRM
                        </span>
                        <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#fff" }}>
                            {isIt ? "Cockpit Agente Immobiliare" : "Makler- & Verwaltungscockpit"}
                        </h2>
                    </div>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
                        {isIt
                            ? "Gestisci annunci, lead, richieste e opzioni di ristrutturazione Titocci."
                            : "Verwalten Sie Objekte, Status-Workflows, Interessenten-Leads und Titocci-Metallbaunotizen."}
                    </p>
                </div>

                {/* Sub-Navigation Tabs */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab("inserate")}
                        style={{
                            padding: "9px 15px",
                            borderRadius: "6px",
                            border: activeTab === "inserate" ? "1px solid #e62b2b" : "1px solid #383838",
                            backgroundColor: activeTab === "inserate" ? "#381414" : "#222",
                            color: activeTab === "inserate" ? "#ff7b7b" : "#ccc",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        <Building2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                        {isIt ? "I Miei Annunci" : "Inserate-Manager"} ({inserate.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("neu")}
                        style={{
                            padding: "9px 15px",
                            borderRadius: "6px",
                            border: activeTab === "neu" ? "1px solid #e62b2b" : "1px solid #383838",
                            backgroundColor: activeTab === "neu" ? "#381414" : "#222",
                            color: activeTab === "neu" ? "#ff7b7b" : "#ccc",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        <PlusCircle size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                        {isIt ? "Nuovo Annuncio" : "Neues Inserat erfassen"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("leads")}
                        style={{
                            padding: "9px 15px",
                            borderRadius: "6px",
                            border: activeTab === "leads" ? "1px solid #e62b2b" : "1px solid #383838",
                            backgroundColor: activeTab === "leads" ? "#381414" : "#222",
                            color: activeTab === "leads" ? "#ff7b7b" : "#ccc",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        <Users size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                        {isIt ? "Richieste & Lead" : "Interessenten & Leads"} ({leads.length})
                    </button>
                </div>
            </div>

            {/* KPI Widgets */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "14px",
                    margin: "20px 0 24px"
                }}
            >
                <div style={{ backgroundColor: "#202020", border: "1px solid #303030", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#888" }}>{isIt ? "Totale Immobili" : "Gesamte Inserate"}</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{totalCount}</div>
                    <div style={{ fontSize: "11px", color: "#4ade80", marginTop: "2px" }}>{activeCount} {isIt ? "attivi online" : "aktiv online"}</div>
                </div>

                <div style={{ backgroundColor: "#202020", border: "1px solid #303030", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#888" }}>{isIt ? "Riservati / Venduti" : "Reserviert / Verkauft"}</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#38bdf8", marginTop: "4px" }}>
                        {reservedCount + soldCount}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                        {reservedCount} {isIt ? "riservati" : "reserviert"}, {soldCount} {isIt ? "venduti" : "verkauft"}
                    </div>
                </div>

                <div style={{ backgroundColor: "#202020", border: "1px solid #303030", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#888" }}>{isIt ? "Lead / Richieste aperte" : "Offene Kundenanfragen"}</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#f59e0b", marginTop: "4px" }}>{openLeadsCount}</div>
                    <div style={{ fontSize: "11px", color: "#fbbf24", marginTop: "2px" }}>{isIt ? "Necessitano contatto" : "Rückruf / Termin nötig"}</div>
                </div>

                <div style={{ backgroundColor: "#202020", border: "1px solid #303030", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#888" }}>{isIt ? "Volume Portafoglio" : "Portfoliovolumen (CHF)"}</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e62b2b", marginTop: "4px" }}>
                        {totalVolume > 0 ? `${(totalVolume / 1000000).toFixed(2)} Mio.` : "–"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Schätzwert Gesamtbestand</div>
                </div>
            </div>

            {/* TAB 1: Inserate-Verwaltung */}
            {activeTab === "inserate" && (
                <div>
                    {/* Status Filter Leiste */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginBottom: "16px"
                        }}
                    >
                        <div style={{ display: "flex", gap: "6px" }}>
                            {["alle", "Aktiv", "Entwurf", "Reserviert", "Verkauft"].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "5px",
                                        border: statusFilter === s ? "1px solid #e62b2b" : "1px solid #333",
                                        backgroundColor: statusFilter === s ? "#381414" : "#222",
                                        color: statusFilter === s ? "#ff7b7b" : "#aaa",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {s === "alle" ? (isIt ? "Tutti" : "Alle Status") : s}
                                </button>
                            ))}
                        </div>

                        <span style={{ fontSize: "12px", color: "#777" }}>
                            {filteredInserate.length} {isIt ? "annunci mostrati" : "Objekte gelistet"}
                        </span>
                    </div>

                    {/* Tabelle der Inserate */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#202020", color: "#999", textAlign: "left" }}>
                                    <th style={{ padding: "10px 12px", borderRadius: "6px 0 0 6px" }}>Objekt</th>
                                    <th style={{ padding: "10px 12px" }}>Ort</th>
                                    <th style={{ padding: "10px 12px" }}>Preis</th>
                                    <th style={{ padding: "10px 12px" }}>Zimmer & Fläche</th>
                                    <th style={{ padding: "10px 12px" }}>Status-Workflow</th>
                                    <th style={{ padding: "10px 12px", borderRadius: "0 6px 6px 0" }}>Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInserate.map((item) => {
                                    const currentStatus = item.status || "Aktiv";
                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: "1px solid #282828",
                                                transition: "background-color 0.15s ease"
                                            }}
                                        >
                                            <td style={{ padding: "12px", fontWeight: "bold", color: "#fff" }}>
                                                <div>{item.title}</div>
                                                <div style={{ fontSize: "11px", color: "#777", fontWeight: "normal" }}>
                                                    {item.metallbauNote || "Geländer SIA 358"}
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px", color: "#bbb" }}>{item.ort}</td>
                                            <td style={{ padding: "12px", color: "#e62b2b", fontWeight: "bold" }}>
                                                {item.preis}
                                            </td>
                                            <td style={{ padding: "12px", color: "#aaa" }}>
                                                {item.zimmer} • {item.flaeche}
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                <select
                                                    value={currentStatus}
                                                    onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                                                    style={{
                                                        backgroundColor:
                                                            currentStatus === "Aktiv"
                                                                ? "#14331e"
                                                                : currentStatus === "Reserviert"
                                                                ? "#382914"
                                                                : currentStatus === "Verkauft"
                                                                ? "#1e293b"
                                                                : "#2a2a2a",
                                                        color:
                                                            currentStatus === "Aktiv"
                                                                ? "#4ade80"
                                                                : currentStatus === "Reserviert"
                                                                ? "#f59e0b"
                                                                : currentStatus === "Verkauft"
                                                                ? "#93c5fd"
                                                                : "#aaa",
                                                        border: "1px solid #444",
                                                        borderRadius: "6px",
                                                        padding: "5px 8px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        cursor: "pointer",
                                                        outline: "none"
                                                    }}
                                                >
                                                    <option value="Aktiv">🟢 Aktiv</option>
                                                    <option value="Entwurf">⚪ Entwurf</option>
                                                    <option value="Reserviert">🟡 Reserviert</option>
                                                    <option value="Verkauft">🔵 Verkauft</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteInserat(item.id)}
                                                    title="Inserat löschen"
                                                    style={{
                                                        backgroundColor: "#2e1515",
                                                        border: "1px solid #552222",
                                                        color: "#ff8b8b",
                                                        borderRadius: "6px",
                                                        padding: "6px 8px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: Neues Inserat erfassen */}
            {activeTab === "neu" && (
                <form
                    onSubmit={handleCreateSubmit}
                    style={{
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #333",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3 style={{ margin: "0 0 16px", color: "#fff", fontSize: "1.15rem" }}>
                        {isIt ? "Crea nuovo annuncio immobiliare" : "Neues Objekt inserieren"}
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "14px",
                            marginBottom: "18px"
                        }}
                    >
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Titel / Bezeichnung *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="z.B. Attico panoramico con terrazza"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Ort / Region *
                            </label>
                            <input
                                type="text"
                                required
                                value={formOrt}
                                onChange={(e) => setFormOrt(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Richtpreis (CHF) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="z.B. 980'000"
                                value={formPreis}
                                onChange={(e) => setFormPreis(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Zimmeranzahl
                            </label>
                            <input
                                type="text"
                                placeholder="z.B. 4.5 Zimmer"
                                value={formZimmer}
                                onChange={(e) => setFormZimmer(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Wohnfläche (m²)
                            </label>
                            <input
                                type="text"
                                placeholder="z.B. 135"
                                value={formFlaeche}
                                onChange={(e) => setFormFlaeche(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                                Status bei Veröffentlichung
                            </label>
                            <select
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#262626",
                                    border: "1px solid #3d3d3d",
                                    borderRadius: "6px",
                                    padding: "9px 12px",
                                    color: "#fff",
                                    fontSize: "13px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="Aktiv">Aktiv (Öffentlich sichtbar)</option>
                                <option value="Entwurf">Entwurf (Nur intern)</option>
                                <option value="Reserviert">Reserviert</option>
                            </select>
                        </div>
                    </div>

                    {/* Titocci Handwerker / Metallbau Note */}
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{ display: "block", fontSize: "12px", color: "#ff7b7b", fontWeight: "bold", marginBottom: "6px" }}>
                            <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                            Titocci Metallbau &amp; BKP-Besonderheit
                        </label>
                        <input
                            type="text"
                            placeholder="z.B. BKP 272.1: Balkongeländer saniert, Treppengeländer pulverbeschichtet"
                            value={formMetallbauNote}
                            onChange={(e) => setFormMetallbauNote(e.target.value)}
                            style={{
                                width: "100%",
                                backgroundColor: "#262626",
                                border: "1px solid #3d3d3d",
                                borderRadius: "6px",
                                padding: "9px 12px",
                                color: "#fff",
                                fontSize: "13px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#e62b2b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 18px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        <Save size={15} />
                        <span>{isIt ? "Salva e pubblica annuncio" : "Inserat speichern & veröffentlichen"}</span>
                    </button>
                </form>
            )}

            {/* TAB 3: Leads & Interessenten CRM */}
            {activeTab === "leads" && (
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px"
                        }}
                    >
                        <span style={{ fontSize: "13px", color: "#aaa" }}>
                            Eingehende Interessenten &amp; Besichtigungsanfragen
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowNewLeadModal(true)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "#262626",
                                border: "1px solid #444",
                                color: "#fff",
                                padding: "7px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                cursor: "pointer"
                            }}
                        >
                            <PlusCircle size={14} color="#4ade80" />
                            <span>Manuellen Lead anlegen</span>
                        </button>
                    </div>

                    {/* Lead Modal */}
                    {showNewLeadModal && (
                        <div
                            style={{
                                backgroundColor: "#1e1e1e",
                                border: "1px solid #3b82f6",
                                borderRadius: "8px",
                                padding: "16px",
                                marginBottom: "16px"
                            }}
                        >
                            <h4 style={{ margin: "0 0 12px", color: "#fff" }}>Interessent manuell erfassen</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                                <input
                                    type="text"
                                    placeholder="Name des Kunden"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    style={{ padding: "8px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                                />
                                <input
                                    type="email"
                                    placeholder="E-Mail"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    style={{ padding: "8px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                                />
                                <input
                                    type="text"
                                    placeholder="Telefon"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    style={{ padding: "8px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                                />
                                <input
                                    type="text"
                                    placeholder="Notiz (z.B. Budget 1M)"
                                    value={leadNote}
                                    onChange={(e) => setLeadNote(e.target.value)}
                                    style={{ padding: "8px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    onClick={handleAddLeadSubmit}
                                    style={{ padding: "7px 14px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Lead speichern
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewLeadModal(false)}
                                    style={{ padding: "7px 14px", backgroundColor: "#333", color: "#aaa", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    )}

                    {leads.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px", color: "#777" }}>
                            Noch keine Kundenanfragen eingegangen. Sobald ein Kunde eine Besichtigung oder ein Exposé anfordert, erscheint der Lead hier.
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    style={{
                                        backgroundColor: "#202020",
                                        border: "1px solid #303030",
                                        borderRadius: "8px",
                                        padding: "14px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontWeight: "bold", color: "#fff" }}>{lead.name}</span>
                                            <span style={{ fontSize: "11px", color: "#888" }}>{lead.date}</span>
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
                                            {lead.email} • {lead.phone}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#e62b2b", marginTop: "4px" }}>
                                            Interesse an: <strong>{lead.objektTitle}</strong>
                                        </div>
                                        {lead.note && (
                                            <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic", marginTop: "4px" }}>
                                                "{lead.note}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Umschalter für Lead */}
                                    <div>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value)}
                                            style={{
                                                backgroundColor:
                                                    lead.status === "Neu"
                                                        ? "#382914"
                                                        : lead.status === "Besichtigung"
                                                        ? "#381438"
                                                        : lead.status === "Abgeschlossen"
                                                        ? "#14331e"
                                                        : "#242424",
                                                color:
                                                    lead.status === "Neu"
                                                        ? "#f59e0b"
                                                        : lead.status === "Besichtigung"
                                                        ? "#c084fc"
                                                        : lead.status === "Abgeschlossen"
                                                        ? "#4ade80"
                                                        : "#aaa",
                                                border: "1px solid #444",
                                                borderRadius: "6px",
                                                padding: "6px 10px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                outline: "none"
                                            }}
                                        >
                                            <option value="Neu">🟡 Neu</option>
                                            <option value="Kontaktiert">🔵 Kontaktiert</option>
                                            <option value="Besichtigung">🟣 Besichtigung vereinbart</option>
                                            <option value="Abgeschlossen">🟢 Abgeschlossen</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
