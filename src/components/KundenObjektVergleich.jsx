import React from "react";
import { X, Check, Calendar, ArrowRight, ShieldCheck, Trash2, Home, Ruler, Users, Tag } from "lucide-react";

export default function KundenObjektVergleich({
    comparedItems = [],
    onRemove,
    onClear,
    onBookAppointment,
    lang = "de"
}) {
    const isIt = lang === "it";

    const t = {
        title: isIt ? "Confronto Immobili (Vista Cliente)" : "Objekt-Vergleich (Kundenansicht)",
        subtitle: isIt
            ? "Confronta fino a 3 immobili fianco a fianco e pianifica le tue opzioni di ristrutturazione."
            : "Vergleichen Sie bis zu 3 Immobilien Seite an Seite inklusive Metallbau- und Sanierungsvorteilen.",
        clearAll: isIt ? "Svuota confronto" : "Vergleich leeren",
        noItems: isIt
            ? "Nessun immobile selezionato per il confronto. Clicca su '+ Confronta' su almeno due immobili per visualizzarli qui."
            : "Noch keine Objekte zum Vergleich ausgewählt. Klicken Sie bei mindestens zwei Objekten auf '+ Vergleichen', um sie nebeneinanderzustellen.",
        price: isIt ? "Prezzo" : "Preis",
        pricePerM2: isIt ? "Prezzo stimato / m²" : "Geschätzter m²-Preis",
        rooms: isIt ? "Locali" : "Zimmer",
        area: isIt ? "Superficie" : "Wohnfläche",
        persons: isIt ? "Idoneità" : "Eignung / Personen",
        location: isIt ? "Posizione" : "Ort / Region",
        metalFeature: isIt ? "Elemento Metalcostruzioni" : "Titocci Metallbau & BKP",
        appointmentBtn: isIt ? "Richiedi visita" : "Besichtigung anfragen",
        removeBtn: isIt ? "Rimuovi" : "Entfernen"
    };

    // Calculate approximate price per m2
    const getPricePerM2 = (item) => {
        const rawPrice = parseInt(String(item.preis).replace(/[^0-9]/g, ""), 10);
        const rawFlaeche = parseInt(String(item.flaeche).replace(/[^0-9]/g, ""), 10);
        if (rawPrice && rawFlaeche) {
            return `${Math.round(rawPrice / rawFlaeche).toLocaleString("de-CH")} CHF / m²`;
        }
        return "–";
    };

    if (comparedItems.length === 0) {
        return (
            <div
                style={{
                    backgroundColor: "#181818",
                    border: "1px dashed #3a3a3a",
                    borderRadius: "12px",
                    padding: "36px 20px",
                    textAlign: "center",
                    marginBottom: "28px"
                }}
            >
                <Home size={36} color="#666" style={{ marginBottom: "12px" }} />
                <h3 style={{ margin: "0 0 8px", color: "#eee" }}>{t.title}</h3>
                <p style={{ margin: "0 auto", maxWidth: "540px", color: "#888", fontSize: "14px" }}>
                    {t.noItems}
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: "#161616",
                border: "1px solid #333",
                borderRadius: "14px",
                padding: "24px",
                marginBottom: "32px",
                boxShadow: "0 10px 32px rgba(0,0,0,0.4)"
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px",
                    borderBottom: "1px solid #282828",
                    paddingBottom: "14px"
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                            style={{
                                backgroundColor: "#e62b2b",
                                color: "#fff",
                                fontSize: "11px",
                                fontWeight: "bold",
                                padding: "2px 8px",
                                borderRadius: "4px"
                            }}
                        >
                            {comparedItems.length} / 3 {isIt ? "Selezionati" : "Ausgewählt"}
                        </span>
                        <h2 style={{ margin: 0, fontSize: "1.35rem", color: "#fff" }}>{t.title}</h2>
                    </div>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>{t.subtitle}</p>
                </div>

                <button
                    type="button"
                    onClick={onClear}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#222",
                        border: "1px solid #3a3a3a",
                        color: "#ccc",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer"
                    }}
                >
                    <Trash2 size={14} color="#ff6b6b" />
                    <span>{t.clearAll}</span>
                </button>
            </div>

            {/* Comparison Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${comparedItems.length}, minmax(260px, 1fr))`,
                    gap: "18px",
                    overflowX: "auto"
                }}
            >
                {comparedItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            backgroundColor: "#1f1f1f",
                            border: "1px solid #303030",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}
                    >
                        {/* Image Header with Remove Button */}
                        <div style={{ position: "relative", height: "170px", backgroundColor: "#2a2a2a" }}>
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#777"
                                    }}
                                >
                                    Kein Bild
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => onRemove(item.id)}
                                title={t.removeBtn}
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "rgba(0,0,0,0.75)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <X size={15} />
                            </button>

                            {item.tag && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {item.tag}
                                </span>
                            )}
                        </div>

                        {/* Property Info Table */}
                        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <h4 style={{ margin: "0 0 6px", fontSize: "1.05rem", color: "#fff" }}>
                                {item.title}
                            </h4>
                            <div style={{ fontSize: "13px", color: "#999", marginBottom: "14px" }}>
                                {item.ort}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    fontSize: "13px",
                                    marginBottom: "18px",
                                    borderTop: "1px solid #2b2b2b",
                                    paddingTop: "12px"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#777" }}>{t.price}:</span>
                                    <span style={{ fontWeight: "bold", color: "#e62b2b", fontSize: "14px" }}>
                                        {item.preis}
                                    </span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#777" }}>{t.pricePerM2}:</span>
                                    <span style={{ color: "#ddd" }}>{getPricePerM2(item)}</span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#777" }}>{t.rooms}:</span>
                                    <span style={{ color: "#ddd" }}>{item.zimmer}</span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#777" }}>{t.area}:</span>
                                    <span style={{ color: "#ddd" }}>{item.flaeche}</span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#777" }}>{t.persons}:</span>
                                    <span style={{ color: "#ddd" }}>{item.personen || "–"}</span>
                                </div>

                                {/* Metallbau Highlight */}
                                <div
                                    style={{
                                        backgroundColor: "#251515",
                                        border: "1px solid #4a1c1c",
                                        borderRadius: "6px",
                                        padding: "8px 10px",
                                        marginTop: "4px"
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#ff7b7b",
                                            fontWeight: "bold",
                                            marginBottom: "2px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}
                                    >
                                        <ShieldCheck size={13} />
                                        <span>{t.metalFeature}</span>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#f0f0f0" }}>
                                        {item.metallbauNote || "Geländer nach SIA 358 & Korrosionsschutz inklusive"}
                                    </div>
                                </div>
                            </div>

                            {/* Book Appointment CTA */}
                            <div style={{ marginTop: "auto" }}>
                                <button
                                    type="button"
                                    onClick={() => onBookAppointment && onBookAppointment(item)}
                                    style={{
                                        width: "100%",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        padding: "10px 14px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#e62b2b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s ease"
                                    }}
                                >
                                    <Calendar size={15} />
                                    <span>{t.appointmentBtn}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
