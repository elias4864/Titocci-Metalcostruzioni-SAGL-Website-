import React, { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import SEO from '../pages/SEO.jsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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

const getGroesseCategory = (qmValue) => {
    if (qmValue <= 45) return GROESSE.small;
    if (qmValue <= 90) return GROESSE.medium;
    if (qmValue <= 150) return GROESSE.large;
    return GROESSE.extra_large;
};

const compressImageFile = (file, maxWidth = 400, quality = 0.5) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const scale = Math.min(1, maxWidth / (img.width || maxWidth));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round((img.width || maxWidth) * scale));
            canvas.height = Math.max(1, Math.round((img.height || maxWidth) * scale));

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas-Kontext nicht verfügbar'));
                return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
        };

        img.src = objectUrl;
    });

export default function HousePriceCalculator() {
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

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

    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiReply, setAiReply] = useState('');

    const [uploadedPdf, setUploadedPdf] = useState(null);
    const [pdfError, setPdfError] = useState('');
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const[aiMessages,setAiMessages]=useState([]);

    const reportRef = useRef(null);
    const pdfInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const qmInputRef = useRef(null);
    const yearInputRef = useRef(null);
    const personenInputRef = useRef(null);
    const zinsInputRef = useRef(null);
    const pdfUrlRef = useRef(null);

    const currentYear = new Date().getFullYear();
    const currentGroesse = useMemo(() => getGroesseCategory(Number(qm) || 0), [qm]);

    const setPdfObjectUrl = (nextUrl) => {
        if (pdfUrlRef.current) {
            URL.revokeObjectURL(pdfUrlRef.current);
        }
        pdfUrlRef.current = nextUrl;
    };

    const getActivePropertyContext = () => {
        if (result) {
            return {
                ...result,
                hasCalculatedResult: true,
            };
        }}

    useEffect(() => {
        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
            }
        };
    }, []);

    const focusInput = (targetRef) => {
        if (!targetRef?.current) return;
        requestAnimationFrame(() => {
            const el = targetRef.current;
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (typeof el.focus === 'function') {
                    el.focus({ preventScroll: true });
                }
            }
        });
    };

    const focusEmailField = () => focusInput(emailInputRef);
    const focusPhoneField = () => focusInput(phoneInputRef);

        const buildSmartLocalReply = (question, ctx) => {
            const q = question.toLowerCase();
            const totalStr = `${Math.round(ctx.totalPrice).toLocaleString('de-CH')} CHF`;
            const qmPriceStr = `${Math.round(ctx.pricePerQm).toLocaleString('de-CH')} CHF/m²`;
            const ekStr = `${Math.round(ctx.eigenkapital20).toLocaleString('de-CH')} CHF`;
            const zinsMonatStr = `${Math.round(ctx.monatlicherZins).toLocaleString('de-CH')} CHF`;
            const hypothek80 = ctx.totalPrice * 0.8;
            const tragbarkeitMonat = Math.round(((hypothek80 * 0.05) + (ctx.totalPrice * 0.01)) / 12);

            if (q.includes('eigenkapital') || q.includes('hypothek') || q.includes('zins') || q.includes('tragbarkeit')) {
                return `Beim Richtwert von ${totalStr} (${ctx.qm} m², ${ctx.cantonName}) liegen 20 % Eigenkapital bei ca. ${ekStr}. Bei ${ctx.zinssatz}% Zinssatz beträgt die reine monatliche Zinsbelastung ca. ${zinsMonatStr}. Für die Schweizer Tragbarkeit rechnen Banken oft mit ca. 5 % kalkulatorischem Zins plus ca. 1 % Nebenkosten/Unterhalt p. a. – das entspricht rund ${tragbarkeitMonat.toLocaleString('de-CH')} CHF/Monat.`;
            }

            if (q.includes('renov') || q.includes('sanier') || q.includes('baujahr') || q.includes('zustand') || q.includes('metall') || q.includes('balkon')) {
                return `Das Objekt (Baujahr ${ctx.year}, Zustand „${ctx.conditionName}“) liegt bei ${qmPriceStr}. Prüfe je nach Alter gezielt Heizsystem, Gebäudehülle, Fenster, Leitungen sowie Nasszellen/Küche. Für konkrete Bau-, Umbau- oder Metallbauarbeiten (z. B. Geländer, Balkone, Konstruktionen) empfiehlt sich eine direkte Anfrage bei Titocci Metalcostruzioni SAGL.`;
            }

            if (q.includes('lage') || q.includes('kanton') || q.includes('preis') || q.includes('m²') || q.includes('quadratmeter')) {
                return `Aktuell ergibt sich für ${ctx.qm} m² in ${ctx.cantonName} und der Lage „${ctx.locationName}“ ein Richtwert von ${qmPriceStr} bzw. ${totalStr} insgesamt. Kanton, Lageklasse und Wohnflächengruppe beeinflussen den m²-Preis am stärksten.`;
            }

            return `Für ${ctx.qm} m² in ${ctx.cantonName} (${ctx.locationName}, Baujahr ${ctx.year}, Zustand „${ctx.conditionName}“) liegt der geschätzte Wert bei ${totalStr} (${qmPriceStr}) und das 20-%-Eigenkapital bei ca. ${ekStr}. Frag gerne gezielt nach Eigenkapital/Tragbarkeit, Sanierung/Baujahr oder Lagefaktoren.`;
        };

        const callGeminiForPropertyQuestion = async (question, ctx, history) => {
            const endpoint = import.meta.env.VITE_AI_ENDPOINT || '';
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

            if (!endpoint && !apiKey) {
                return null;
            }

            const systemInstruction = [
                'Du bist ein hilfreicher, sachlicher KI-Assistent für einen Schweizer Immobilienrechner (Titocci Metalcostruzioni SAGL).',
                'Antworte auf Deutsch, präzise und praxisnah mit Bezug auf Schweizer Immobilien- und Finanzierungslogik (CHF, Eigenkapital, kalkulatorische Tragbarkeit, Unterhalt/Sanierung).',
                'Weise kurz darauf hin, dass Werte unverbindliche Richtwerte sind und keine verbindliche Schätzung oder Finanz-/Rechtsberatung ersetzen.',
                `Aktueller Kontext: Wohnfläche ${ctx.qm} m², Kanton ${ctx.cantonName}, Lage ${ctx.locationName}, Zustand ${ctx.conditionName}, Baujahr ${ctx.year}, Personen ${ctx.personen}, Zinssatz ${ctx.zinssatz}%, Richtwert ${Math.round(ctx.totalPrice)} CHF (${Math.round(ctx.pricePerQm)} CHF/m²), 20% Eigenkapital ${Math.round(ctx.eigenkapital20)} CHF, monatlicher Zins ca. ${Math.round(ctx.monatlicherZins)} CHF${ctx.pdfName ? `, PDF: ${ctx.pdfName}` : ''}.`,
            ].join(' ');

            if (endpoint) {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction,
                        question,
                        context: ctx,
                        history: history.slice(-6),
                    }),
                });
                if (!res.ok) throw new Error(`AI endpoint error: ${res.status}`);
                const data = await res.json();
                return data?.reply || data?.text || null;
            }

            const contents = [
                ...history.slice(-6).map((msg) => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }],
                })),
                {
                    role: 'user',
                    parts: [{ text: `${systemInstruction}\n\nFrage: ${question}` }],
                },
            ];

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents }),
                }
            );

            if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
            const data = await res.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        };







        const handleAskAiQuestion = async (e, presetQuestion = '') => {
            if (e) e.preventDefault();

            const trimmedQuestion = (presetQuestion || aiQuestion).trim();
            if (!trimmedQuestion) {
                setAiError('Bitte gib zuerst eine Frage ein.');
                return;
            }

            const activeCtx = getActivePropertyContext();
            const nextHistory = [...aiMessages, { role: 'user', content: trimmedQuestion }];

            setIsAiLoading(true);
            setAiError('');
            setAiMessages(nextHistory);
            if (!presetQuestion) {
                setAiQuestion('');
            }

            try {
                let answer = null;
                try {
                    answer = await callGeminiForPropertyQuestion(trimmedQuestion, activeCtx, nextHistory);
                } catch (apiErr) {
                    console.warn('Gemini-Aufruf fehlgeschlagen, nutze lokalen Assistenten:', apiErr);
                }

                if (!answer) {
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    answer = buildSmartLocalReply(trimmedQuestion, activeCtx);
                }

                setAiReply(answer);
                setAiMessages([...nextHistory, { role: 'assistant', content: answer }]);
            } catch (error) {
                console.error('Fehler bei der KI-Rückfrage:', error);
                setAiError('Antwort auf die Frage konnte nicht erzeugt werden.');
            } finally {
                setIsAiLoading(false);
            }
        };


        const buildLocalAiAnalysis = (data, hasImage) => {
            const age = Math.max(0, currentYear - (Number(data.year) || currentYear));
            const plausibilityNotes = [];

            if (data.condition === 'new' && age > 5) {
                plausibilityNotes.push(
                    `Hinweis: „Neubau / Erstbezug“ passt kaum zum Baujahr ${data.year} (ca. ${age} Jahre alt).`
                );
            }
            if (data.condition === 'need_repair' && age < 5) {
                plausibilityNotes.push(
                    `Hinweis: „Renovierungsbedürftig“ bei Baujahr ${data.year} ist untypisch – bitte Baujahr oder Zustand prüfen.`
                );
            }
            if (Number(data.zinssatz) > 5) {
                plausibilityNotes.push(
                    `Hinweis: Ein Zinssatz von ${data.zinssatz}% liegt über dem gängigen Richtwert und erhöht die laufende Zinslast spürbar.`
                );
            }
            if (data.qm < 25 && data.personen >= 3) {
                plausibilityNotes.push(
                    `Hinweis: ${data.qm} m² für ${data.personen} Personen ist kompakt – Platzbedarf und Stauraum genau prüfen.`
                );
            }
            if (plausibilityNotes.length === 0) {
                plausibilityNotes.push('Alle Angaben sind plausibel und stimmig zueinander.');
            }

            const hypothek80 = data.totalPrice * 0.8;
            const richttragbarkeitMonat = Math.round(((hypothek80 * 0.05) + (data.totalPrice * 0.01)) / 12);

            const recommendations = [
                age >= 25
                    ? 'Bei einem Objektalter ab ca. 25 Jahren empfiehlt sich ein Budget für Heizung, Fenster, Dach, Fassade und Leitungen.'
                    : age >= 12
                        ? 'Bei rund 12–24 Jahren lohnt sich ein Blick auf Haustechnik, Wärmeerzeugung und kommende Unterhaltsarbeiten.'
                        : 'Bei neueren Objekten sind Gewährleistungsfristen, Nebenkosten und langfristiger Unterhalt besonders relevant.',
                `20 % Eigenkapital entsprechen ca. ${Math.round(data.eigenkapital20).toLocaleString('de-CH')} CHF (bei ${data.zinssatz}% Zins ca. ${Math.round(data.monatlicherZins).toLocaleString('de-CH')} CHF/Monat reine Zinslast).`,
                `Schweizer Richtwert (80 % Hypothek à 5 % kalkulatorisch + ca. 1 % Unterhalt/Nebenkosten p. a.): ~${richttragbarkeitMonat.toLocaleString('de-CH')} CHF/Monat.`,
            ];

            if (hasImage) {
                recommendations.push(
                    'Ein Objektfoto wurde hinterlegt – ideal als visueller Anhaltspunkt (ohne verbindliche Bausubstanz-Garantie).'
                );
            }
            if (data.pdfName) {
                recommendations.push(
                    `PDF-Dokument „${data.pdfName}“ ist angehängt – Eckdaten aus dem Dossier sollten bei der Detailprüfung abgeglichen werden.`
                );
            }

            return {
                generatedAt: new Date().toLocaleString('de-CH'),
                headline: `${data.hasCalculatedResult ? 'KI-Einschätzung' : 'Vorschau-Einschätzung'} für ${data.cantonName} (${data.qm} m²)`,
                summary: `Richtwert von ca. ${Math.round(data.totalPrice).toLocaleString('de-CH')} CHF (${Math.round(data.pricePerQm).toLocaleString('de-CH')} CHF/m²) in der Lage „${data.locationName}“ (${data.conditionName}).`,
                plausibilityNotes,
                recommendations,
                disclaimer: 'Unverbindlicher Richtwert (keine amtliche Schätzung oder Finanz-/Rechtsberatung).',
            };
        };



    const handleRunAiAnalysis = async () => {
        if (!result) {
            setAiError('Bitte führe zuerst eine Immobilienwert-Berechnung durch.');
            return;
        }

        setIsAiLoading(true);
        setAiError('');
        setAiReply('');

        try {
            await new Promise((resolve) => setTimeout(resolve, 350));
            const analysis = buildLocalAiAnalysis(result, Boolean(imagePreview));
            setAiAnalysis(analysis);
        } catch (error) {
            console.error('Fehler bei der KI-Analyse:', error);
            setAiError('Die KI-Analyse konnte nicht erstellt werden.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const compressedDataUrl = await compressImageFile(file, 400, 0.5);
            setImagePreview(compressedDataUrl);
        } catch {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImagePreview(reader.result);
                }
            };
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

    const escapeXml = (value) =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

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
            `Personen: ${data.personen}`,
            `Eigenkapital (20%): ${Math.round(data.eigenkapital20).toLocaleString('de-CH')} CHF`,
            `Monatliche Zinsbelastung (${data.zinssatz}%): ~${Math.round(data.monatlicherZins).toLocaleString('de-CH')} CHF`,
            `E-Mail: ${data.email}`,
            data.phone ? `Telefon: ${data.phone}` : null,
            data.pdfName ? `PDF-Dokument: ${data.pdfName}` : null,
        ]
            .filter(Boolean)
            .join('\n');

    const buildMarkdownText = (data) =>
        [
            `# Immobilien-Marktwertanalyse (${data.date})`,
            `**Anbieter:** Titocci Metalcostruzioni SAGL`,
            '',
            '| Kennzahl | Wert |',
            '| --- | --- |',
            `| Geschätzter Gesamtwert | **${Math.round(data.totalPrice).toLocaleString('de-CH')} CHF** |`,
            `| Preis pro m² | ${Math.round(data.pricePerQm).toLocaleString('de-CH')} CHF / m² |`,
            `| Wohnfläche | ${data.qm} m² (${data.groesseName}) |`,
            `| Kanton / Region | ${data.cantonName} |`,
            `| Lage | ${data.locationName} |`,
            `| Zustand | ${data.conditionName} |`,
            `| Baujahr | ${data.year} |`,
            `| Personen | ${data.personen} |`,
            `| Eigenkapital (20%) | ${Math.round(data.eigenkapital20).toLocaleString('de-CH')} CHF |`,
            `| Monatliche Zinsbelastung (${data.zinssatz}%) | ~${Math.round(data.monatlicherZins).toLocaleString('de-CH')} CHF |`,
            `| E-Mail | ${data.email} |`,
            `| Telefon | ${data.phone || 'Keine'} |`,
            `| PDF-Dokument | ${data.pdfName || 'Keines'} |`,
        ].join('\n');

    const triggerDownload = (content, mimeType, extension) => {
        if (!result) return;
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Immobilien-Bewertung-${result.canton}-${new Date().toISOString().slice(0, 10)}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportXml = () => {
        if (!result) return;

        const xmlContent = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            `<immobilienBewertung datum="${escapeXml(result.date)}" anbieter="Titocci Metalcostruzioni SAGL">`,
            '  <eingaben>',
            `    <wohnflaeche einheit="m2">${Number(result.qm)}</wohnflaeche>`,
            `    <kategorie>${escapeXml(result.groesseName)}</kategorie>`,
            `    <kanton code="${escapeXml(result.canton)}">${escapeXml(result.cantonName)}</kanton>`,
            `    <lage code="${escapeXml(result.location)}">${escapeXml(result.locationName)}</lage>`,
            `    <zustand code="${escapeXml(result.condition)}">${escapeXml(result.conditionName)}</zustand>`,
            `    <baujahr>${Number(result.year)}</baujahr>`,
            `    <personen>${Number(result.personen)}</personen>`,
            `    <hypothekarzins einheit="prozent">${Number(result.zinssatz)}</hypothekarzins>`,
            `    <email>${escapeXml(result.email)}</email>`,
            `    <telefon>${escapeXml(result.phone || 'Keine')}</telefon>`,
            `    <pdfDokument>${escapeXml(result.pdfName || 'Keines')}</pdfDokument>`,
            '  </eingaben>',
            '  <ergebnis waehrung="CHF">',
            `    <preisProQm>${Number(result.pricePerQm).toFixed(2)}</preisProQm>`,
            `    <gesamtwert>${Number(result.totalPrice).toFixed(2)}</gesamtwert>`,
            `    <eigenkapital20Prozent>${Number(result.eigenkapital20).toFixed(2)}</eigenkapital20Prozent>`,
            `    <monatlicherZins>${Number(result.monatlicherZins).toFixed(2)}</monatlicherZins>`,
            '  </ergebnis>',
            '</immobilienBewertung>',
        ].join('\n');

        triggerDownload(xmlContent, 'application/xml;charset=utf-8;', 'xml');
    };

    const handleExportTxt = () => {
        if (!result) return;
        triggerDownload(buildSummaryText(result), 'text/plain;charset=utf-8;', 'txt');
    };

    const handleExportMd = () => {
        if (!result) return;
        triggerDownload(buildMarkdownText(result), 'text/markdown;charset=utf-8;', 'md');
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
            ['Personen', String(result.personen)],
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

        triggerDownload('\uFEFF' + csvContent, 'text/csv;charset=utf-8;', 'csv');
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

        triggerDownload(JSON.stringify(payload, null, 2), 'application/json', 'json');
    };

    const handleCopySummary = async () => {
        if (!result) return;

        try {
            await navigator.clipboard.writeText(buildSummaryText(result));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2500);
        } catch {
            setFormMessage({
                type: 'error',
                text: 'Zusammenfassung konnte nicht in die Zwischenablage kopiert werden.',
            });
        }
    };

    const sendEmailCalc = async (
        calculatedTotalPrice,
        calculatedPricePerQm,
        attachedImage,
        attachedPdfName
    ) => {
        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            return;
        }

        setIsSending(true);
        try {
            const safeImageParam =
                attachedImage && attachedImage.length <= 42000
                    ? attachedImage
                    : attachedImage
                        ? 'Bild komprimiert (zu gross für E-Mail-Variable)'
                        : 'Kein Bild angehängt';

            const templateParams = {
                subject: 'Neue Immobilien-Berechnung von Titocci Metalcostruzioni',
                from_email: email.trim(),
                phone: phone.trim() || 'Keine Telefonnummer angegeben',
                message: [
                    `Wohnfläche: ${qm} m²`,
                    `Kanton: ${canton}`,
                    `Lage: ${location}`,
                    `Zustand: ${condition}`,
                    `Baujahr: ${year}`,
                    `Personen: ${personen}`,
                    `Telefon: ${phone.trim() || 'Nicht angegeben'}`,
                    `Zinssatz: ${zinssatz}%`,
                    `Geschätzter Quadratmeterpreis: ${calculatedPricePerQm.toFixed(2)} CHF`,
                    `Geschätzter Gesamtpreis: ${calculatedTotalPrice.toFixed(2)} CHF`,
                    `PDF-Dokument: ${attachedPdfName || 'Kein PDF hochgeladen'}`,
                ].join('\n'),
                to_email: 'info@titocci.ch',
                signup_date: new Date().toLocaleDateString('de-CH'),
                image_url: safeImageParam,
                pdf_filename: attachedPdfName || 'Kein PDF hochgeladen',
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
        } catch (error) {
            console.error('Fehler beim E-Mail-Versand:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleCalculate = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        const trimmedEmail = email.trim();
        const numericQm = Number(qm);
        const numericPersonen = Number(personen);

        if (!numericQm || numericQm <= 0) {
            setFormMessage({ type: 'error', text: 'Bitte gib eine gültige Wohnfläche ein.' });
            focusInput(qmInputRef);
            return;
        }
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            setFormMessage({ type: 'error', text: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
            focusEmailField();
            return;
        }
        if (!numericPersonen || numericPersonen < 1) {
            setFormMessage({ type: 'error', text: 'Gib bitte mindestens 1 Person für eine gültige Berechnung ein.' });
            focusInput(personenInputRef);
            return;
        }

        const safeLocation = LOCATION_FACTORS[location] || LOCATION_FACTORS.suburb;
        const safeCanton = CANTON_FACTORS[canton] || CANTON_FACTORS.CH;
        const safeCondition = CONDITION_FACTORS[condition] || CONDITION_FACTORS.good;
        const groesseCat = getGroesseCategory(numericQm);

        const base = safeLocation.basePrice;
        const cantonFactor = safeCanton.factor;
        const conditionMult = safeCondition.multiplier;
        const groesseFactor = groesseCat.multiplier;

        const safeYear = Math.min(currentYear, Math.max(1850, Number(year) || currentYear));
        const safePersonen = Math.max(1, numericPersonen);
        const safeZins = Math.max(0, Number(zinssatz) || 0);

        const age = Math.max(0, currentYear - safeYear);
        const ageFactor = Math.max(0.6, 1 - age * 0.005);
        const personenFactor = 1 + (safePersonen - 1) * 0.01;
        const zinsFactor = Math.max(0.85, 1 + (safeZins - 2.0) * 0.03);

        const pricePerQm =
            base *
            cantonFactor *
            conditionMult *
            groesseFactor *
            ageFactor *
            personenFactor *
            zinsFactor;
        const totalPrice = pricePerQm * numericQm;

        const jahresZins = totalPrice * (safeZins / 100);
        const monatlicherZins = jahresZins / 12;
        const eigenkapital20 = totalPrice * 0.20;

        const calculationResult = {
            qm: numericQm,
            canton,
            cantonName: safeCanton.name,
            location,
            locationName: safeLocation.name,
            condition,
            conditionName: safeCondition.name,
            groesseName: groesseCat.name,
            year: safeYear,
            personen: safePersonen,
            zinssatz: safeZins,
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
        setFormMessage({ type: 'success', text: 'Immobilienwert erfolgreich berechnet.' });
        await sendEmailCalc(
            totalPrice,
            pricePerQm,
            imagePreview,
            uploadedPdf?.name || null
        );
    };

    const exportBtnStyle = (bgColor) => ({
        backgroundColor: bgColor,
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
    });

    const fieldInputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        boxSizing: 'border-box',
    };

    return (
        <div
            style={{
                maxWidth: '580px',
                margin: '20px auto',
                padding: '24px',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                borderRadius: '16px',
                background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.92))',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                backgroundColor:'#18c50f'
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
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
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
                            style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}
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
                            <div style={{ marginTop: '10px', position: 'relative', textAlign: 'center' }}>
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
                            style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}
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
                            <p style={{ color: '#dc2626', fontSize: '13px', margin: '6px 0 0 0', fontWeight: 600 }}>
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
                            ref={emailInputRef}
                            type="email"
                            placeholder="name@beispiel.ch"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={fieldInputStyle}
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
                            ref={phoneInputRef}
                            type="tel"
                            placeholder="+41 44 000 00 00"
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                            style={fieldInputStyle}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                            <label htmlFor="qmInput">Wohnfläche (m²): {currentGroesse.name}</label>
                            <span>{qm} m²</span>
                        </div>
                        <input
                            id="qmInput"
                            ref={qmInputRef}
                            type="number"
                            min="1"
                            max="2000"
                            value={qm}
                            onChange={(e) => setQm(e.target.value)}
                            style={fieldInputStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label htmlFor="cantonSelect" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Kanton / Region:
                            </label>
                            <select
                                id="cantonSelect"
                                value={canton}
                                onChange={(e) => setCanton(e.target.value)}
                                style={fieldInputStyle}
                            >
                                {Object.entries(CANTON_FACTORS).map(([code, item]) => (
                                    <option key={code} value={code}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="locationSelect" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Lage:
                            </label>
                            <select
                                id="locationSelect"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={fieldInputStyle}
                            >
                                {Object.entries(LOCATION_FACTORS).map(([key, item]) => (
                                    <option key={key} value={key}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label htmlFor="conditionSelect" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Zustand:
                            </label>
                            <select
                                id="conditionSelect"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                style={fieldInputStyle}
                            >
                                {Object.entries(CONDITION_FACTORS).map(([key, item]) => (
                                    <option key={key} value={key}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="yearInput" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Baujahr:
                            </label>
                            <input
                                id="yearInput"
                                ref={yearInputRef}
                                type="number"
                                min="1850"
                                max={currentYear}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={fieldInputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label htmlFor="personenInput" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Personen:
                            </label>
                            <input
                                id="personenInput"
                                ref={personenInputRef}
                                type="number"
                                min="1"
                                max="30"
                                value={personen}
                                onChange={(e) => setPersonen(e.target.value)}
                                style={fieldInputStyle}
                            />
                        </div>

                        <div>
                            <label htmlFor="zinsInput" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>
                                Zinssatz (%):
                            </label>
                            <input
                                id="zinsInput"
                                ref={zinsInputRef}
                                type="number"
                                min="0"
                                max="20"
                                step="0.05"
                                value={zinssatz}
                                onChange={(e) => setZinssatz(e.target.value)}
                                style={fieldInputStyle}
                            />
                        </div>
                    </div>

                    {formMessage.text && (
                        <div
                            role={formMessage.type === 'error' ? 'alert' : 'status'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                backgroundColor: formMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
                                color: formMessage.type === 'error' ? '#dc2626' : '#15803d',
                                border: `1px solid ${formMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                            }}
                        >
                            {formMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                            <span>{formMessage.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSending}
                        style={{
                            backgroundColor: isSending ? '#64748b' : '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 18px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '15px',
                            cursor: isSending ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSending ? 'Berechne & sende...' : 'Immobilienwert berechnen'}
                    </button>
                </form>
            )}

            {result && (
                <div style={{ marginTop: '24px' }}>
                    <div
                        ref={reportRef}
                        style={{
                            padding: '18px',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '17px' }}>
                            Auswertung ({result.date})
                        </h3>
                        <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: 700, color: '#1d4ed8' }}>
                            Gesamtwert: {Math.round(result.totalPrice).toLocaleString('de-CH')} CHF
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                            Preis pro m²: {Math.round(result.pricePerQm).toLocaleString('de-CH')} CHF / m²
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                            Eigenkapital (20%): {Math.round(result.eigenkapital20).toLocaleString('de-CH')} CHF
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                            Monatliche Zinsbelastung ({result.zinssatz}%): ~{Math.round(result.monatlicherZins).toLocaleString('de-CH')} CHF
                        </p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#475569' }}>
                            {result.qm} m² ({result.groesseName}) • {result.cantonName} • {result.locationName} • {result.conditionName} • Baujahr {result.year}
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '12px',
                        }}
                    >
                        <button type="button" onClick={triggerPdfDownload} style={exportBtnStyle('#dc2626')}>
                            PDF exportieren
                        </button>
                        <button type="button" onClick={handleExportCsv} style={exportBtnStyle('#16a34a')}>
                            CSV exportieren
                        </button>
                        <button type="button" onClick={handleExportJson} style={exportBtnStyle('#2563eb')}>
                            JSON exportieren
                        </button>
                        <button type="button" onClick={handleExportXml} style={exportBtnStyle('#7c3aed')}>
                            XML exportieren
                        </button>
                        <button type="button" onClick={handleExportMd} style={exportBtnStyle('#0f766e')}>
                            Markdown (.md)
                        </button>
                        <button type="button" onClick={handleExportTxt} style={exportBtnStyle('#475569')}>
                            Text (.txt)
                        </button>
                        <button type="button" onClick={handleCopySummary} style={exportBtnStyle('#d97706')}>
                            {copySuccess ? 'Kopiert!' : 'In Zwischenablage'}
                        </button>
                    </div>

                    <div
                        style={{
                            marginTop: '14px',
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#0f172a',
                        }}
                    >
                        <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <strong>KI-Immobilien-Assistent</strong>
                                <button
                                    type="button"
                                    onClick={handleRunAiAnalysis}
                                    disabled={isAiLoading}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                                >
                                    {isAiLoading ? 'Analysiere…' : 'KI-Analyse starten'}
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {[
                                    'Wie steht es um Eigenkapital und Tragbarkeit?',
                                    'Welche Sanierungen sind beim Baujahr relevant?',
                                    'Wie wirken sich Lage und Kanton aus?',
                                ].map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() => handleAskAiQuestion(null, chip)}
                                        disabled={isAiLoading}
                                        style={{ padding: '4px 10px', borderRadius: '999px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>

                            {aiError && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{aiError}</p>}

                            {aiAnalysis && (
                                <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                                    <div style={{ fontWeight: 700 }}>{aiAnalysis.headline}</div>
                                    <p style={{ margin: '6px 0' }}>{aiAnalysis.summary}</p>
                                    <ul style={{ margin: '6px 0', paddingLeft: '18px' }}>
                                        {aiAnalysis.plausibilityNotes.map((note, i) => <li key={i}>{note}</li>)}
                                        {aiAnalysis.recommendations.map((rec, i) => <li key={`r-${i}`}>{rec}</li>)}
                                    </ul>
                                    <small style={{ color: '#64748b' }}>{aiAnalysis.disclaimer}</small>
                                </div>
                            )}

                            {aiMessages.length > 0 && (
                                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                                    {aiMessages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '88%',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                fontSize: '13px',
                                                backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                                                color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                                                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <input
                                    type="text"
                                    value={aiQuestion}
                                    onChange={(e) => setAiQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAskAiQuestion(e);
                                    }}
                                    placeholder="Frage zu Preis, Eigenkapital, Zins oder Sanierung…"
                                    style={{ ...fieldInputStyle, flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => handleAskAiQuestion(e)}
                                    disabled={isAiLoading}
                                    style={{ padding: '0 14px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Fragen
                                </button>
                            </div>
                        </div>



                        {aiReply && (
                            <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                {aiReply}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}