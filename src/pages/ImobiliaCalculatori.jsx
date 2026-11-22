import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

// Innerhalb von HousePriceCalculator:
const reportRef = useRef(null);
const [uploadedPdf, setUploadedPdf] = useState(null); // { name, sizeKb, url }
const [pdfError, setPdfError] = useState('');

const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setPdfError('Bitte wähle eine gültige PDF-Datei aus.');
        return;
    }

    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxBytes) {
        setPdfError('Die PDF-Datei darf maximal 10 MB gross sein.');
        return;
    }

    setPdfError('');
    const url = URL.createObjectURL(file);
    setUploadedPdf({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        url,
    });
};

const handleRemovePdf = () => {
    if (uploadedPdf?.url) {
        URL.revokeObjectURL(uploadedPdf.url);
    }
    setUploadedPdf(null);
    setPdfError('');
};

useEffect(() => {
    if (!result || !exportPdf || !reportRef.current) return;

    const options = {
        margin: 10,
        filename: 'Immobilien-Kurzgutachten-Titocci.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(reportRef.current).set(options).save();
}, [result, exportPdf]);