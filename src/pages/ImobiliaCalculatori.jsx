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

export default function HousePriceCalculator() {
    const [qm, setQm] = useState(75);
    const [canton, setCanton] = useState('ZH');
    const [location, setLocation] = useState('suburb');
    const [condition, setCondition] = useState('good');
    const [year, setYear] = useState(2000);
    const [personen, setPersonen] = useState(1);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [result, setResult] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [zinssatz, setZinssatz] = useState(2.5);
    const [exportPdf, setExportPdf] = useState(true);
    const[exportTxt, setExportTxt] = useState(true);

    // PDF-Upload & Export-States
    const [uploadedPdf, setUploadedPdf] = useState(null); // { name, sizeKb, url }
    const [pdfError, setPdfError] = useState('');
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const reportRef = useRef(null);

    const pdfInputRef = useRef(null);
    const currentYear = new Date().getFullYear();

    const getGroesseCategory = (qmValue) => {
        if (qmValue <= 45) return GROESSE.small;
        if (qmValue <= 90) return GROESSE.medium;
        if (qmValue <= 150) return GROESSE.large;
        return GROESSE.extra_large;
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
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

        const maxBytes = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxBytes) {
            setPdfError('Die PDF-Datei darf maximal 10 MB gross sein.');
            return;
        }

        if (uploadedPdf?.url) {
            URL.revokeObjectURL(uploadedPdf.url);
        }

        setPdfError('');
        setShowPdfPreview(false);
        const url = URL.createObjectURL(file);
        setUploadedPdf({
            name: file.name,
            sizeKb: Math.max(1, Math.round(file.size / 1024)),
            url,
        });
    };


    /**
     * Textexportfunktion
     */
    const handleExportTxt = () => {
        if (!result) return;

        const textContent = [
            `Immobilien-Marktwertanalyse (${result.date}) – Titocci Metalcostruzioni SAGL`,
            `--------------------------------------------------`,
            `Gesamtwert: ${Math.round(result.totalPrice).toLocaleString('de-CH')} CHF (${Math.round(result.pricePerQm).toLocaleString('de-CH')} CHF / m²)`,
            `Wohnfläche: ${result.qm} m² (${result.groesseName})`,
            `Kanton / Region: ${result.cantonName}`,
            `Lage: ${result.locationName}`,
            `Zustand: ${result.conditionName}`,
            `Baujahr: ${result.year}`,
            `Eigenkapital (20%): ${Math.round(result.eigenkapital20).toLocaleString('de-CH')} CHF`,
            `Monatliche Zinsbelastung (${result.zinssatz}%): ~${Math.round(result.monatlicherZins).toLocaleString('de-CH')} CHF`,
            `E-Mail: ${result.email}`,
            result.phone ? `Telefon: ${result.phone}` : null,
            result.pdfName ? `PDF-Dokument: ${result.pdfName}` : null,
        ]
            .filter(Boolean)
            .join('\n');

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Immobilien-Bewertung-${result.canton}-${new Date().toISOString().slice(0, 10)}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleRemovePdf = () => {
        if (uploadedPdf?.url) {
            URL.revokeObjectURL(uploadedPdf.url);
        }
        setUploadedPdf(null);
        setPdfError('');
        setShowPdfPreview(false);
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (uploadedPdf?.url) {
                URL.revokeObjectURL(uploadedPdf.url);
            }
        };
    }, [uploadedPdf]);

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

    useEffect(() => {
        if (!result || !exportPdf || !reportRef.current) return;
        triggerPdfDownload();
    }, [result, exportPdf]);

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

        const summary = [
            `Immobilien-Marktwertanalyse (${result.date}) – Titocci Metalcostruzioni SAGL`,
            `Gesamtwert: ${Math.round(result.totalPrice).toLocaleString('de-CH')} CHF (${Math.round(result.pricePerQm).toLocaleString('de-CH')} CHF / m²)`,
            `Objekt: ${result.qm} m², ${result.cantonName}, ${result.locationName}, ${result.conditionName}, Baujahr ${result.year}`,
            `Eigenkapital (20%): ${Math.round(result.eigenkapital20).toLocaleString('de-CH')} CHF | Zins/Mt. (${result.zinssatz}%): ~${Math.round(result.monatlicherZins).toLocaleString('de-CH')} CHF`,
            `Kontakt: ${result.email}${result.phone ? ` | Tel: ${result.phone}` : ''}`,
            result.pdfName ? `PDF-Dokument: ${result.pdfName}` : null,
        ]
            .filter(Boolean)
            .join('\n');

        try {
            await navigator.clipboard.writeText(summary);
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
        if (!email || email.length < 5 || !email.includes('@')) {
            alert('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        try {
            const EmailJS_serviceID = 'service_n9toe59';
            const EmailJS_templateID = 'template_mrshrnl';
            const EmailJS_publicKey = 'dFpVpt98rEIko4TLa';

            const templateParams = {
                subject: 'Neue Immobilien-Berechnung von Titocci Metalcostruzioni',
                from_email: email,
                phone: phone || 'Keine Telefonnummer angegeben',
                message: `Wohnfläche: ${qm} m²\nKanton: ${canton}\nTelefon: ${phone || 'Nicht angegeben'}\nZinssatz: ${zinssatz}%\nGeschätzter Quadratmeterpreis: ${calculatedPricePerQm.toFixed(2)} CHF\nGeschätzter Gesamtpreis: ${calculatedTotalPrice.toFixed(2)} CHF\nPDF-Dokument: ${attachedPdfName || 'Kein PDF hochgeladen'}`,
                to_email: 'info@titocci.ch',
                signup_date: new Date().toLocaleDateString('de-CH'),
                image_url: attachedImage || 'Kein Bild angehängt',
                pdf_filename: attachedPdfName || 'Kein PDF hochgeladen',
            };

            await emailjs.send(
                EmailJS_serviceID,
                EmailJS_templateID,
                templateParams,
                EmailJS_publicKey
            );

            alert(
                'Der Bericht wurde erfolgreich an ' +
                email +
                ' und an die Titocci Metalcostruzioni gesendet!'
            );
        } catch (error) {
            console.error('Fehler beim E-Mail-Versand:', error.message);
        }
    };

    const handleCalculate = (e) => {
        e.preventDefault();

        if (!qm || qm <= 0) {
            alert('Bitte gib eine gültige Wohnfläche ein.');
            return;
        }
        if (!email || !email.includes('@')) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
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

        alert('Der Gesamtpreis pro Quadratmeter beträgt ' + pricePerQm.toFixed(2) + ' CHF');
        alert('Der Gesamtpreis der Immobilie beträgt ' + totalPrice.toFixed(2) + ' CHF');

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
            email,
            phone,
            image: imagePreview,
            pdfName: uploadedPdf?.name || null,
            pdfSizeKb: uploadedPdf?.sizeKb || null,
            monatlicherZins,
            eigenkapital20,
            date: new Date().toLocaleDateString('de-CH'),
        };

        setResult(calculationResult);
        sendEmailCalc(
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
                maxWidth: '500px',
                margin: '20px auto',
                padding: '24px',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                borderRadius: '16px',
                background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 248, 0.9))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                color: 'black',
                backgroundColor: 'red',
            }}
        >
            <SEO title="Immobilienrechner - Titocci Metalcostruzioni SAGL" />

            {/* Header mit Toggle-Button */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isOpen ? '20px' : '0',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(241, 245, 249, 0.7)',
                    transition: 'all 0.3s ease',
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: '#0f172a',
                        fontSize: '20px',
                        fontWeight: '700',
                    }}
                >
                    Free Immobilienrechner
                </h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {isOpen ? 'Einklappen' : 'Öffnen'}
                </button>
            </div>

            {isOpen && (
                <>
                    <form
                        onSubmit={handleCalculate}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '5px',
                                    fontWeight: 'bold',
                                    color: 'red',
                                    fontSize: '20px',
                                    textShadow: 'brown 2px 2px',
                                }}
                            >
                                Foto der Immobilie hochladen:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
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
                                            borderRadius: '6px',
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
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            )}
                        </div>


                        <button
                            type="button"
                            onClick={handleExportTxt}
                            placeholder="Telefonnummer bitte eingeben..."

                            onFocus={reportRef}


                            style={{
                                backgroundColor: 'blue',
                                color: 'orangered',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '30px',
                                fontWeight: '600',
                            }}
                        >
                            Als TXT speichern
                        </button>

                        {/* PDF-Upload (Grundriss / Exposé / Dokument) */}
                        <div
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                border: '1px solid #cbd5e1',
                            }}
                        >
                            <label
                                htmlFor="pdfUploadInput"
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontWeight: 'bold',
                                    color: '#0f172a',
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
                                        fontWeight: '600',
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
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
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
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
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
                                                borderRadius: '6px',
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Ihre E-Mail-Adresse:
                            </label>
                            <input
                                type="email"
                                placeholder="name@beispiel.ch"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phoneInput"
                                style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
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
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px',
                                }}
                            >
                                <label style={{ fontWeight: 'bold' }}>Wohnfläche (m²):</label>
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{qm} m²</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="300"
                                value={qm}
                                onChange={(e) => setQm(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.85em', color: '#64748b' }}>
                                Kategorie: {currentGroesse.name}
                            </span>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Kanton / Region:
                            </label>
                            <select
                                value={canton}
                                onChange={(e) => setCanton(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                {Object.entries(CANTON_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>
                                        {val.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Lage:
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                {Object.entries(LOCATION_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>
                                        {val.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Zustand:
                            </label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                {Object.entries(CONDITION_FACTORS).map(([key, val]) => (
                                    <option key={key} value={key}>
                                        {val.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px',
                                }}
                            >
                                <label style={{ fontWeight: 'bold' }}>Hypothekarzins (%):</label>
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                                    {zinssatz.toFixed(1)} %
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="10.0"
                                step="0.1"
                                value={zinssatz}
                                onChange={(e) => setZinssatz(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Berechnen
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}