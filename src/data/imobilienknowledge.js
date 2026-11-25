export const IMMOBILIEN_KNOWLEDGE = {
    firma: {
        name: "Titocci Metalcostruzioni SAGL",
        region: "Tessin & ganze Schweiz (u.a. Avegno, Locarno, Vallemaggia)",
        kontaktEmail: "info@titocci.ch",
    },
    gewerke: [
        {
            name: "Parapetti & Balkongeländer",
            bkp: "BKP 272.1",
            preisProLfm: 320,
            norm: "SIA 358 Absturzsicherung",
            beschreibung: "Massgefertigte Balkongeländer und Absturzsicherungen für Mehrfamilienhäuser und Neubauten."
        },
        {
            name: "Treppen & Innengeländer",
            bkp: "BKP 272.2",
            preisProLfm: 290,
            norm: "SIA 358 & Brandschutz",
            beschreibung: "Innen- und Aussentreppen sowie Handläufe für Wohn- und Gewerbeimmobilien."
        },
        {
            name: "Einfahrtstore & Sicherheitsgitter",
            bkp: "BKP 272.4",
            preisProLfm: 410,
            norm: "Antrieb & Zutrittskontrolle",
            beschreibung: "Schiebe- und Flügeltore inkl. Automation für Tiefgaragen und Areale."
        },
        {
            name: "Areal- & Gartenzäune",
            bkp: "BKP 421",
            preisProLfm: 240,
            norm: "Korrosionsschutz C3/C4",
            beschreibung: "Witterungsbeständige Einfriedungen und Sichtschutzsysteme."
        }
    ],
    kantone: [
        { kuerzel: "ZH", name: "Zürich", faktor: 1.35 },
        { kuerzel: "GE", name: "Genf", faktor: 1.40 },
        { kuerzel: "BS", name: "Basel-Stadt", faktor: 1.25 },
        { kuerzel: "BE", name: "Bern", faktor: 1.00 },
        { kuerzel: "LU", name: "Luzern", faktor: 1.15 },
        { kuerzel: "SG", name: "St. Gallen", faktor: 0.90 },
        { kuerzel: "VS", name: "Wallis", faktor: 0.85 },
        { kuerzel: "TI", name: "Tessin", faktor: 1.00 }
    ],
    lagen: [
        { name: "Großstadt / Top-Lage", basisPreisQm: 8500 },
        { name: "Speckgürtel / Vorort", basisPreisQm: 6200 },
        { name: "Ländliche Region", basisPreisQm: 4100 },
        { name: "Am Seeufer", basisPreisQm: 11000 },
        { name: "Berg-/Panoramalage", basisPreisQm: 8000 }
    ]
};