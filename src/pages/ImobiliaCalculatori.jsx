import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import html2pdf from 'html2pdf.js';
import SEO from '../pages/SEO.jsx';

const CANTON_FACTORS = {
    ZH: { name: 'Zürich (ZH)', factor: 1.35 },
    GE: { name: 'Genf (GE)', factor: 1.40 },
    BS: { name: 'Basel-Stadt (BS)', factor: 1.25 },
    BE: { name: 'Bern (BE)', factor: 1.00 },
    LU: { name: 'Luzern (LU)', factor: 1.15 },
    SG: { name: 'St. Gallen (SG)', factor: 0.90 },
    VS: { name: 'Wallis (VS)', factor: 0.85 },
    ACS: { name: 'Aargau Central South (ACS)', factor: 1.05 },
    EOX: { name: 'Ostschweiz Exklusiv (EOX)', factor: 1.10 },
    CH: { name: 'Übrige Schweiz', factor: 1.00 },
};

const LOCATION_FACTORS = {
    city: { name: 'Großstadt / Top-Lage', basePrice: 8500 },
    suburb: { name: 'Speckgürtel / Vorort', basePrice: 6200 },
    rural: { name: 'Ländliche Region', basePrice: 4100 },
    lake: { name: 'Am Seeufer', basePrice: 11000 },
    mountains: { name: 'Berg-/Panoramalage', basePrice: 8000 },
};

const CONDITION_FACTORS = {
    new: { name: 'Neubau / Erstbezug', multiplier: 1.2 },
    good: { name: 'Gepflegt / Saniert', multiplier: 1.0 },
    need_repair: { name: 'Renovierungsbedürftig', multiplier: 0.75 },
};

const GROESSE = {
    small: { name: 'Klein (bis 45 m²)', min: 0, max: 45, multiplier: 1.15 },
    medium: { name: 'Mittel (46 - 90 m²)', min: 46, max: 90, multiplier: 1.0 },
    large: { name: 'Groß (91 - 150 m²)', min: 91, max: 150, multiplier: 0.95 },
    extra_large: { name: 'Sehr groß (> 150 m²)', min: 151, max: 999, multiplier: 0.90 },
};

const MAX_PDF_BYTES = 10 * 1024 * 1024;

export default function HousePriceCalculator() {
    const [qm, setQm] = useState(75);
    const [canton, setCanton] = useState('ZH');
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [personen, setPersonen] = useState(1);
    const [zinssatz, setZinssatz] = useState(2.5);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [result, setResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const [uploadedPdf, setUploadedPdf] = useState(null);
    const [pdfError, setPdfError] = useState('');
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const reportRef = useRef(null);
    const pdfInputRef = useRef(null);
    const pdfUrlRef = useRef(null);
    const currentYear = new Date().getFullYear();

    const getGroesseCategory = (qmValue) => {
        if (qmValue <= 45) return GROESSE.small;
        if (qmValue <= 90) return GROESSE.medium;
        if (qmValue <= 150) return GROESSE.large;
        return GROESSE.extra_large;
    };

    const setPdfObjectUrl = (nextUrl) => {
        if (pdfUrlRef.current) {
            URL.revokeObjectURL(pdfUrlRef.current);
        }
        pdfUrlRef.current = nextUrl;
    };

    useEffect(() => {
        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
            }
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPdf =
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
            setPdfError('Bitte wähle eine gültige PDF-Datei aus.');
            return;
        }

        if (file.size > MAX_PDF_BYTES) {
            setPdfError('Die PDF-Datei darf maximal 10 MB gross sein.');
            return;
        }

        setPdfError('');
        setShowPdfPreview(false);
        const url = URL.createObjectURL(file);
        setPdfObjectUrl(url);

        setUploadedPdf({
            name: file.name,
            sizeKb: Math.max(1, Math.round(file.size / 1024)),
            url,
        });
    };

    const handleRemovePdf = () => {
        setPdfObjectUrl(null);
        setUploadedPdf(null);
        setPdfError('');
        setShowPdfPreview(false);
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
    };

    const buildSummaryText = (data) =>
        [
            `Immobilien-Marktwertanalyse (${data.date}) – Titocci Metalcostruzioni SAGL`,
            '--------------------------------------------------',
            `Gesamtwert: ${Math.round(data.totalPrice).toLocaleString('de-CH')} CHF (${Math.round(data.pricePerQm).toLocaleString('de-CH')} CHF / m²)`,
            `Wohnfläche: ${data.qm} m² (${data.groesseName})`,
            `Kanton / Region: ${data.cantonName}`,
            `Lage: ${data.locationName}`,
            `Zustand: ${data.conditionName}`,
            `Baujahr: ${data.year}`,
            `Eigenkapital (20%): ${Math.round(data.eigenkapital20).toLocaleString('de-CH')} CHF`,
            `Monatliche Zinsbelastung (${data.zinssatz}%): ~${Math.round(data.monatlicherZins).toLocaleString('de-CH')} CHF`,
            `E-Mail: ${data.email}`,
            data.phone ? `Telefon: ${data.phone}` : null,
            data.pdfName ? `PDF-Dokument: ${data.pdfName}` : null,
        ]
            .filter(Boolean)
            .join('\n');

    const handleExportTxt = () => {
        if (!result) return;

        const textContent = buildSummaryText(result);
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Immobilien-Bewertung-${result.canton}-${new Date().toISOString().slice(0, 10)}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const triggerPdfDownload = () => {
        if (!reportRef.current) return;

        const options = {
            margin: 10,
            filename: 'Immobilien-Kurzgutachten-Titocci.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().from(reportRef.current).set(options).save();
    };

    const handleExportCsv = () => {
        if (!result) return;

        const rows = [
            ['Kennzahl', 'Wert'],
            ['Datum', result.date],
            ['Wohnflaeche (m2)', String(result.qm)],
            ['Kategorie', result.groesseName],
            ['Kanton / Region', result.cantonName],
            ['Lage', result.locationName],
            ['Zustand', result.conditionName],
            ['Baujahr', String(result.year)],
            ['Hypothekarzins (%)', String(result.zinssatz)],
            ['Geschaetzter Preis pro m2 (CHF)', result.pricePerQm.toFixed(2)],
            ['Geschaetzter Gesamtwert (CHF)', result.totalPrice.toFixed(2)],
            ['Empfohlenes Eigenkapital 20% (CHF)', result.eigenkapital20.toFixed(2)],
            ['Monatliche Zinsbelastung (CHF)', result.monatlicherZins.toFixed(2)],
            ['Hochgeladenes PDF', result.pdfName || 'Keines'],
            ['E-Mail', result.email],
            ['Telefonnummer', result.phone || 'Keine'],
        ];

        const csvContent = rows
            .map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')
            )
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Immobilien-Bewertung-${result.canton}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportJson = () => {
        if (!result) return;

        const payload = {
            exportDate: new Date().toISOString(),
            provider: 'Titocci Metalcostruzioni SAGL',
            inputs: {
                qm: result.qm,
                canton: result.canton,
                cantonName: result.cantonName,
                location: result.location,
                locationName: result.locationName,
                condition: result.condition,
                conditionName: result.conditionName,
                year: result.year,
                personen: result.personen,
                zinssatz: result.zinssatz,
                email: result.email,
                phone: result.phone || null,
                uploadedPdfName: result.pdfName || null,
            },
            valuation: {
                pricePerQmChf: Number(result.pricePerQm.toFixed(2)),
                totalPriceChf: Number(result.totalPrice.toFixed(2)),
                eigenkapital20Chf: Number(result.eigenkapital20.toFixed(2)),
                monatlicherZinsChf: Number(result.monatlicherZins.toFixed(2)),
            },
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Immobilien-Bewertung-${result.canton}-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCopySummary = async () => {
        if (!result) return;

        try {
            await navigator.clipboard.writeText(buildSummaryText(result));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2500);
        } catch {
            alert('Zusammenfassung konnte nicht in die Zwischenablage kopiert werden.');
        }
    };

    const sendEmailCalc = async (
        calculatedTotalPrice,
        calculatedPricePerQm,
        attachedImage,
        attachedPdfName
    ) => {
        setIsSending(true);
        try {
            const serviceID = 'service_n9toe59';
            const templateID = 'template_mrshrnl';
            const publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                subject: 'Neue Immobilien-Berechnung von Titocci Metalcostruzioni',
                from_email: email,
                phone: phone || 'Keine Telefonnummer angegeben',
                message: [
                    `Wohnfläche: ${qm} m²`,
                    `Kanton: ${canton}`,
                    `Telefon: ${phone || 'Nicht angegeben'}`,
                    `Zinssatz: ${zinssatz}%`,
                    `Geschätzter Quadratmeterpreis: ${calculatedPricePerQm.toFixed(2)} CHF`,
                    `Geschätzter Gesamtpreis: ${calculatedTotalPrice.toFixed(2)} CHF`,
                    `PDF-Dokument: ${attachedPdfName || 'Kein PDF hochgeladen'}`,
                ].join('\n'),
                to_email: 'info@titocci.ch',
                signup_date: new Date().toLocaleDateString('de-CH'),
                image_url: attachedImage || 'Kein Bild angehängt',
                pdf_filename: attachedPdfName || 'Kein PDF hochgeladen',
            };

            await emailjs.send(serviceID, templateID, templateParams, publicKey);
            alert(
                `Der Bericht wurde erfolgreich an ${email} und an Titocci Metalcostruzioni gesendet!`
            );
        } catch (error) {
            console.error('Fehler beim E-Mail-Versand:', error);
            alert('Beim Senden des Berichts ist ein Fehler aufgetreten.');
        } finally {
            setIsSending(false);
        }
    };

    const handleCalculate = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!qm || qm <= 0) {
            alert('Bitte gib eine gültige Wohnfläche ein.');
            return;
        }
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            alert('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        const base = LOCATION_FACTORS[location].basePrice;
        const cantonFactor = CANTON_FACTORS[canton].factor;
        const conditionMult = CONDITION_FACTORS[condition].multiplier;
        const groesseObj = getGroesseCategory(qm);
        const groesseFactor = groesseObj.multiplier;

        const age = Math.max(0, currentYear - year);
        const ageFactor = Math.max(0.6, 1 - age * 0.005);
        const personenFactor = 1 + (personen - 1) * 0.01;
        const zinsFactor = Math.max(0.85, 1 + (zinssatz - 2.0) * 0.03);

        const pricePerQm =
            base *
            cantonFactor *
            conditionMult *
            groesseFactor *
            ageFactor *
            personenFactor *
            zinsFactor;
        const totalPrice = pricePerQm * qm;

        const jahresZins = totalPrice * (zinssatz / 100);
        const monatlicherZins = jahresZins / 12;
        const eigenkapital20 = totalPrice * 0.20;

        const calculationResult = {
            qm,
            canton,
            cantonName: CANTON_FACTORS[canton].name,
            location,
            locationName: LOCATION_FACTORS[location].name,
            condition,
            conditionName: CONDITION_FACTORS[condition].name,
            groesseName: groesseObj.name,
            year,
            personen,
            zinssatz,
            pricePerQm,
            totalPrice,
            email: trimmedEmail,
            phone: phone.trim(),
            image: imagePreview,
            pdfName: uploadedPdf?.name || null,
            pdfSizeKb: uploadedPdf?.sizeKb || null,
            monatlicherZins,
            eigenkapital20,
            date: new Date().toLocaleDateString('de-CH'),
        };

        setResult(calculationResult);
        await sendEmailCalc(
            totalPrice,
            pricePerQm,
            imagePreview,
            uploadedPdf?.name || null
        );
    };

    const currentGroesse = getGroesseCategory(qm);

    return (
        <div
            style={{
                maxWidth: '520px',
                margin: '20px auto',
                padding: '24px',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                borderRadius: '16px',
                background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.92))',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                color: '#0f172a',
            }}
        >
            <SEO title="Immobilienrechner - Titocci Metalcostruzioni SAGL" />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isOpen ? '20px' : '0',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                    Immobilienrechner
                </h2>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {isOpen ? 'Einklappen' : 'Öffnen'}
                </button>
            </div>

            {isOpen && (
                <form
                    onSubmit={handleCalculate}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    <div>
                        <label
                            htmlFor="imageUploadInput"
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: 600,
                                fontSize: '14px',
                            }}
                        >
                            Foto der Immobilie hochladen:
                        </label>
                        <input
                            id="imageUploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                        {imagePreview && (
                            <div
                                style={{
                                    marginTop: '10px',
                                    position: 'relative',
                                    textAlign: 'center',
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Vorschau"
                                    style={{
                                        width: '100%',
                                        maxHeight: '180px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        backgroundColor: '#dc2626',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 10px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                    }}
                                >
                                    Entfernen
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                        }}
                    >
                        <label
                            htmlFor="pdfUploadInput"
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: 600,
                                fontSize: '14px',
                            }}
                        >
                            Dokument / Grundriss (PDF) hochladen (max. 10 MB):
                        </label>
                        <input
                            id="pdfUploadInput"
                            ref={pdfInputRef}
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfUpload}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                        {pdfError && (
                            <p
                                style={{
                                    color: '#dc2626',
                                    fontSize: '13px',
                                    margin: '6px 0 0 0',
                                    fontWeight: 600,
                                }}
                            >
                                {pdfError}
                            </p>
                        )}
                        {uploadedPdf && (
                            <div style={{ marginTop: '8px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                        fontSize: '13px',
                                    }}
                                >
                                    <span>
                                        <strong>{uploadedPdf.name}</strong> ({uploadedPdf.sizeKb} KB)
                                    </span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowPdfPreview((prev) => !prev)}
                                            style={{
                                                backgroundColor: '#0284c7',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {showPdfPreview ? 'Vorschau ausblenden' : 'Vorschau'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemovePdf}
                                            style={{
                                                backgroundColor: '#dc2626',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            PDF entfernen
                                        </button>
                                    </div>
                                </div>
                                {showPdfPreview && (
                                    <iframe
                                        src={uploadedPdf.url}
                                        title="PDF Vorschau"
                                        style={{
                                            width: '100%',
                                            height: '220px',
                                            marginTop: '8px',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="emailInput"
                            style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}
                        >
                            E-Mail-Adresse:
                        </label>
                        <input
                            id="emailInput"
                            type="email"
                            placeholder="name@beispiel.ch"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phoneInput"
                            style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}
                        >
                            Ihre Telefonnummer:
                        </label>
                        <input
                            id="phoneInput"
                            type="tel"
                            placeholder="+41 44 000 00 00"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '6px',
                            }}
                        >
                            <label htmlFor="qmRange" style={{ fontWeight: 600, fontSize: '14px' }}>
                                Wohnfläche (m²):
                            </label>
                            <span style={{ fontWeight: 700, color: '#2563eb' }}>{qm} m²</span>
                        </div>
                        <input
                            id="qmRange"
                            type="range"
                            min="10"
                            max="300"
                            value={qm}
                            onChange={(e) => setQm(Number(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Kategorie: {currentGroesse.name}
                        </span>
                    </div>

                    <div>
                        <label
                            htmlFor="cantonSelect"
                            style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}
                        >
                            Kanton / Region:
                        </label>
                        <select
                            id="cantonSelect"
                            value={canton}
                            onChange={(e) => setCanton(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#fff',
                            }}
                        >
                            {Object.entries(CANTON_FACTORS).map(([key, val]) => (
                                <option key={key} value={key}>
                                    {val.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '15px',
                            cursor: isSending ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSending ? 'Wird berechnet & gesendet...' : 'Marktwert berechnen'}
                    </button>

                    {result && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={handleExportTxt}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                Als TXT speichern
                            </button>
                            <button
                                type="button"
                                onClick={handleExportCsv}
                                style={{
                                    backgroundColor: '#0f766e',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                Als CSV speichern
                            </button>
                            <button
                                type="button"
                                onClick={handleExportJson}
                                style={{
                                    backgroundColor: '#475569',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                Als JSON speichern
                            </button>
                            <button
                                type="button"
                                onClick={handleCopySummary}
                                style={{
                                    backgroundColor: '#334155',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                {copySuccess ? 'Kopiert!' : 'Kopieren'}
                            </button>
                            <button
                                type="button"
                                onClick={triggerPdfDownload}
                                style={{
                                    backgroundColor: '#7c3aed',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                PDF-Report
                            </button>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}