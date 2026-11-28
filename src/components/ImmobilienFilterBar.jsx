import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    SlidersHorizontal,
    X,
    MapPin,
    RotateCcw,
    Sparkles,
    ShieldCheck,
    ArrowUpDown
} from "lucide-react";

const TICINO_LOCATIONS = [
    "Locarno TI",
    "Ascona TI",
    "Avegno TI",
    "Minusio TI",
    "Maggia TI",
    "Losone TI",
    "Lugano TI",
    "Bellinzona TI",
    "Tenero TI",
    "Brissago TI",
    "Gordola TI",
    "Mendrisio TI"
];

export default function ImmobilienFilterBar({ lang = "de" }) {
    const initialFilters = {
        ortQuery: "",
        minZimmer: "",
        minPreis: "",
        maxPreis: "",
        metallFeature: "alle",
        transaktion: "alle",
        sortierung: "neu"
    };

    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

        const [filters, setFilters] = useState(initialFilters);

        const onChangeFilters = (newFilters) => {
            setFilters(newFilters);
        };

        const onReset = () => {
            setFilters(initialFilters);
        };

        const totalCount = 0;

    const isIt = lang === "it";


    // Text translations
    const t = {
        searchPlaceholder: isIt
            ? "Cerca per località, via o parola chiave..."
            : "Nach Ort, Region oder Stichwort suchen...",
        filterLabel: isIt ? "Filtri" : "Filter",
        advancedFilters: isIt ? "Filtri avanzati" : "Erweiterte Filter",
        resetAll: isIt ? "Ripristina filtri" : "Filter zurücksetzen",
        resultsFound: isIt ? "immobili trovati" : "Objekte gefunden",
        allTypes: isIt ? "Tutti i tipi" : "Alle Objekttypen",
        rooms: isIt ? "Locali" : "Zimmer",
        allRooms: isIt ? "Tutti i locali" : "Alle Zimmer",
        priceMin: isIt ? "Prezzo da (CHF)" : "Preis ab (CHF)",
        priceMax: isIt ? "Prezzo fino a (CHF)" : "Preis bis (CHF)",
        sortLabel: isIt ? "Ordinamento" : "Sortierung",
        sortNewest: isIt ? "Più recenti" : "Neueste zuerst",
        sortPriceAsc: isIt ? "Prezzo: dal più basso" : "Preis: aufsteigend",
        sortPriceDesc: isIt ? "Prezzo: dal più caro" : "Preis: absteigend",
        sortAreaDesc: isIt ? "Superficie: più grande" : "Wohnfläche: grösste",
        metalFeature: isIt ? "Specialità Metalcostruzioni" : "Metallbau & Handwerk (USP)",
        allMetal: isIt ? "Tutte le dotazioni" : "Alle Ausstattungen",
        balconyFeature: isIt ? "Balcone / Terrazza panoramica" : "Balkon / Dachterrasse",
        railingFeature: isIt ? "Parapetti moderni (SIA 358)" : "Moderne Geländer (SIA 358)",
        gateFeature: isIt ? "Cancello / Griglie di sicurezza" : "Einfahrtstor / Schutzgitter"
    };

    // Prepare combined location list
    const combinedLocations = Array.from(new Set(TICINO_LOCATIONS));

    // Filter autocomplete suggestions based on query
    const searchTrimmed = (filters.ortQuery || "").trim().toLowerCase();
    const suggestions = combinedLocations.filter((ort) =>
        ort.toLowerCase().includes(searchTrimmed)
    );



    // Close autocomplete on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
                setIsAutocompleteOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectLocation = (ort) => {
        onChangeFilters({ ...filters, ortQuery: ort });
        setIsAutocompleteOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isAutocompleteOpen || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelectLocation(suggestions[highlightedIndex]);
        } else if (e.key === "Escape") {
            setIsAutocompleteOpen(false);
        }
    };

    const activeFilterCount = [
        Boolean(filters.ortQuery),
        Boolean(filters.minZimmer),
        Boolean(filters.minPreis),
        Boolean(filters.maxPreis),
        filters.metallFeature && filters.metallFeature !== "alle",
        filters.transaktion && filters.transaktion !== "alle"
    ].filter(Boolean).length;

    return (
        <div
            style={{
                backgroundColor: "#191919",
                border: "1px solid #2d2d2d",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}
        >
            {/* Top row: Autocomplete search + Quick toggles */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Autocomplete Input Container */}
                <div
                    ref={autocompleteRef}
                    style={{ position: "relative", flex: "1 1 320px", minWidth: "260px" }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#222222",
                            border: isAutocompleteOpen ? "1px solid #e62b2b" : "1px solid #3a3a3a",
                            borderRadius: "8px",
                            padding: "0 12px",
                            transition: "border-color 0.2s ease"
                        }}
                    >
                        <Search size={18} color="#999" style={{ flexShrink: 0, marginRight: "8px" }} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={filters.ortQuery || ""}
                            onChange={(e) => {
                                onChangeFilters({ ...filters, ortQuery: e.target.value });
                                setIsAutocompleteOpen(true);
                                setHighlightedIndex(-1);
                            }}
                            onFocus={() => setIsAutocompleteOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.searchPlaceholder}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                backgroundColor: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#fff",
                                fontSize: "14px"
                            }}
                        />
                        {filters.ortQuery && (
                            <button
                                type="button"
                                onClick={() => onChangeFilters({ ...filters, ortQuery: "" })}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#888",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                                title="Löschen"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown List */}
                    {isAutocompleteOpen && suggestions.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "calc(100% + 6px)",
                                left: 0,
                                right: 0,
                                zIndex: 50,
                                backgroundColor: "#202020",
                                border: "1px solid #3d3d3d",
                                borderRadius: "8px",
                                maxHeight: "240px",
                                overflowY: "auto",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
                            }}
                        >
                            <div
                                style={{
                                    padding: "6px 12px",
                                    fontSize: "11px",
                                    color: "#888",
                                    textTransform: "uppercase",
                                    borderBottom: "1px solid #2d2d2d"
                                }}
                            >
                                {isIt ? "Suggerimenti località" : "Vorgeschlagene Orte (Tessin)"}
                            </div>
                            {suggestions.map((ort, idx) => {
                                const isHighlighted = idx === highlightedIndex;
                                return (
                                    <div
                                        key={ort}
                                        onClick={() => handleSelectLocation(ort)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        style={{
                                            padding: "10px 14px",
                                            cursor: "pointer",
                                            backgroundColor: isHighlighted ? "#2e2e2e" : "transparent",
                                            color: isHighlighted ? "#e62b2b" : "#f0f0f0",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            fontSize: "13px",
                                            borderBottom: "1px solid #262626"
                                        }}
                                    >
                                        <MapPin size={14} color="#e62b2b" />
                                        <span>{ort}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Zimmer Schnellauswahl */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#aaa", marginRight: "4px" }}>
                        {t.rooms}:
                    </span>
                    {["", "2.5", "3.5", "4.5", "5.5"].map((z) => {
                        const active = filters.minZimmer === z;
                        return (
                            <button
                                key={z || "all"}
                                type="button"
                                onClick={() => onChangeFilters({ ...filters, minZimmer: z })}
                                style={{
                                    padding: "8px 12px",
                                    fontSize: "12px",
                                    fontWeight: active ? "bold" : "normal",
                                    borderRadius: "6px",
                                    border: active ? "1px solid #e62b2b" : "1px solid #383838",
                                    backgroundColor: active ? "#3a1313" : "#242424",
                                    color: active ? "#ff7b7b" : "#ddd",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease"
                                }}
                            >
                                {z ? `${z}+` : t.allRooms}
                            </button>
                        );
                    })}
                </div>

                {/* Sortierung Dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                    <ArrowUpDown size={15} color="#888" />
                    <select
                        value={filters.sortierung || "neu"}
                        onChange={(e) => onChangeFilters({ ...filters, sortierung: e.target.value })}
                        style={{
                            backgroundColor: "#222",
                            color: "#eee",
                            border: "1px solid #3a3a3a",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            fontSize: "13px",
                            cursor: "pointer",
                            outline: "none"
                        }}
                    >
                        <option value="neu">{t.sortNewest}</option>
                        <option value="preis_asc">{t.sortPriceAsc}</option>
                        <option value="preis_desc">{t.sortPriceDesc}</option>
                        <option value="flaeche_desc">{t.sortAreaDesc}</option>
                    </select>

                    {/* Toggle Advanced Filters Button */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced((prev) => !prev)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: showAdvanced ? "1px solid #e62b2b" : "1px solid #3a3a3a",
                            backgroundColor: showAdvanced ? "#2b1414" : "#222",
                            color: showAdvanced ? "#ff7b7b" : "#ccc",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        <SlidersHorizontal size={14} />
                        <span>{t.advancedFilters}</span>
                        {activeFilterCount > 0 && (
                            <span
                                style={{
                                    backgroundColor: "#e62b2b",
                                    color: "#fff",
                                    borderRadius: "999px",
                                    padding: "1px 6px",
                                    fontSize: "11px",
                                    fontWeight: "bold"
                                }}
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Ausklappbare erweiterte Filter */}
            {showAdvanced && (
                <div
                    style={{
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: "1px solid #2d2d2d",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "14px"
                    }}
                >
                    {/* Preis Min */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                            {t.priceMin}
                        </label>
                        <input
                            type="number"
                            step="50000"
                            placeholder="z.B. 500000"
                            value={filters.minPreis || ""}
                            onChange={(e) => onChangeFilters({ ...filters, minPreis: e.target.value })}
                            style={{
                                width: "100%",
                                backgroundColor: "#222",
                                border: "1px solid #3a3a3a",
                                borderRadius: "6px",
                                padding: "8px 10px",
                                color: "#fff",
                                fontSize: "13px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {/* Preis Max */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>
                            {t.priceMax}
                        </label>
                        <input
                            type="number"
                            step="50000"
                            placeholder="z.B. 1500000"
                            value={filters.maxPreis || ""}
                            onChange={(e) => onChangeFilters({ ...filters, maxPreis: e.target.value })}
                            style={{
                                width: "100%",
                                backgroundColor: "#222",
                                border: "1px solid #3a3a3a",
                                borderRadius: "6px",
                                padding: "8px 10px",
                                color: "#fff",
                                fontSize: "13px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {/* USP Metallbau Feature Filter */}
                    <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#e62b2b", fontWeight: "bold", marginBottom: "6px" }}>
                            <ShieldCheck size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                            {t.metalFeature}
                        </label>
                        <select
                            value={filters.metallFeature || "alle"}
                            onChange={(e) => onChangeFilters({ ...filters, metallFeature: e.target.value })}
                            style={{
                                width: "100%",
                                backgroundColor: "#222",
                                border: "1px solid #3a3a3a",
                                borderRadius: "6px",
                                padding: "8px 10px",
                                color: "#fff",
                                fontSize: "13px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        >
                            <option value="alle">{t.allMetal}</option>
                            <option value="balkon">{t.balconyFeature}</option>
                            <option value="gelaender">{t.railingFeature}</option>
                            <option value="tor">{t.gateFeature}</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <button
                            type="button"
                            onClick={onReset}
                            style={{
                                width: "100%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #444",
                                backgroundColor: "#262626",
                                color: "#bbb",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                            }}
                        >
                            <RotateCcw size={14} />
                            <span>{t.resetAll}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom: Filter Chips & Trefferanzeige */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "14px",
                    paddingTop: "12px",
                    borderTop: "1px solid #262626",
                    fontSize: "12px",
                    color: "#888"
                }}
            >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", color: "#e62b2b" }}>
                        {totalCount} {t.resultsFound}
                    </span>

                    {/* Filter Badges */}
                    {filters.ortQuery && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#2d1616",
                                color: "#ff8b8b",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #551a1a"
                            }}
                        >
                            Ort: {filters.ortQuery}
                            <X
                                size={12}
                                style={{ cursor: "pointer" }}
                                onClick={() => onChangeFilters({ ...filters, ortQuery: "" })}
                            />
                        </span>
                    )}

                    {filters.minZimmer && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#262626",
                                color: "#ddd",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #3d3d3d"
                            }}
                        >
                            {filters.minZimmer}+ Zimmer
                            <X
                                size={12}
                                style={{ cursor: "pointer" }}
                                onClick={() => onChangeFilters({ ...filters, minZimmer: "" })}
                            />
                        </span>
                    )}

                    {(filters.minPreis || filters.maxPreis) && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#262626",
                                color: "#ddd",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #3d3d3d"
                            }}
                        >
                            Preis: {filters.minPreis || "0"} - {filters.maxPreis || "∞"} CHF
                            <X
                                size={12}
                                style={{ cursor: "pointer" }}
                                onClick={() => onChangeFilters({ ...filters, minPreis: "", maxPreis: "" })}
                            />
                        </span>
                    )}

                    {filters.metallFeature && filters.metallFeature !== "alle" && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#1e293b",
                                color: "#93c5fd",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #3b82f6"
                            }}
                        >
                            Metallbau: {filters.metallFeature}
                            <X
                                size={12}
                                style={{ cursor: "pointer" }}
                                onClick={() => onChangeFilters({ ...filters, metallFeature: "alle" })}
                            />
                        </span>
                    )}
                </div>

                {activeFilterCount > 0 && (
                    <button
                        type="button"
                        onClick={onReset}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#e62b2b",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: 0
                        }}
                    >
                        {t.resetAll}
                    </button>
                )}
            </div>
        </div>
    );
}
