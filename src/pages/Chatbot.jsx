import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

import ChatInput from '../pages/ChatInput.jsx';
import ChatMessages from '../pages/ChatMessages.jsx';
import { IMMOBILIEN_KNOWLEDGE } from '../data/imobilienknowledge.js';
import '../Styles/Chatbot.css';

function getStoredKunden() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem('titocci_kunden');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function generateLocalReply(userText) {
    const q = userText.toLowerCase();
    const kundenListe = getStoredKunden();

    if (q.includes('objekt') || q.includes('immobilie') || q.includes('haus') || q.includes('häuser')) {
        const registrierteObjekte = kundenListe
            .filter(k => k?.immobilienObjekt)
            .map(k => `- **${k.immobilienObjekt}** (${k.firmaOderName}, ${k.kundenTyp})`);

        return [
            `### Immobilien & Objekte bei ${IMMOBILIEN_KNOWLEDGE.firma.name}`,
            `Wir betreuen **Mehrfamilienhäuser, Wohnbauten, Neubauten und Sanierungen** in ${IMMOBILIEN_KNOWLEDGE.firma.region}.`,
            registrierteObjekte.length > 0
                ? `\n**Aktuell im Portal hinterlegte Objekte:**\n${registrierteObjekte.join('\n')}`
                : `\n*Tipp:* Im Immobilienportal kannst du unter **Login / Konto** eigene Objekte erfassen.`,
            `\n**Richtpreise nach Lage (Wohnfläche):**`,
            ...IMMOBILIEN_KNOWLEDGE.lagen.map(
                l => `- **${l.name}:** ca. ${l.basisPreisQm.toLocaleString('de-CH')} CHF/m²`
            )
        ].join('\n');
    }

    if (q.includes('preis') || q.includes('kosten') || q.includes('rechner') || q.includes('kalkul')) {
        return [
            `### Richtpreise & Kalkulation`,
            `**Metallbau-Gewerke (Basispreis pro Laufmeter):**`,
            ...IMMOBILIEN_KNOWLEDGE.gewerke.map(
                g => `- **${g.name}** (${g.bkp}): ab **${g.preisProLfm} CHF/lfm** – *${g.norm}*`
            ),
            `\nIm **Immobilienrechner** kannst du Wohnfläche, Kanton, Baujahr, Zustand, Eigenkapital (20 %) und Hypothekarzins direkt berechnen und als PDF/CSV exportieren.`
        ].join('\n');
    }

    if (q.includes('geländer') || q.includes('treppe') || q.includes('tor') || q.includes('zaun') || q.includes('gewerk')) {
        return [
            `### Unsere Metallbau-Gewerke für Immobilien`,
            ...IMMOBILIEN_KNOWLEDGE.gewerke.map(
                g => `- **${g.name}** (${g.bkp}): ${g.beschreibung} *(Richtpreis: ${g.preisProLfm} CHF/lfm)*`
            )
        ].join('\n');
    }

    if (q.includes('kanton') || q.includes('zürich') || q.includes('tessin') || q.includes('region')) {
        return [
            `### Regionale Faktoren im Immobilienrechner`,
            ...IMMOBILIEN_KNOWLEDGE.kantone.map(
                k => `- **${k.name} (${k.kuerzel}):** Faktor ${k.faktor.toFixed(2)}x`
            )
        ].join('\n');
    }

    if (q.includes('kontakt') || q.includes('offerte') || q.includes('termin') || q.includes('email')) {
        return `Du erreichst **${IMMOBILIEN_KNOWLEDGE.firma.name}** direkt per E-Mail unter **${IMMOBILIEN_KNOWLEDGE.firma.kontaktEmail}** oder über das Anfrageformular im **Immobilien- & Ausschreibungsportal** für ein unverbindliches Aufmass vor Ort.`;
    }

    return [
        `Ich bin **Leo**, dein interner Assistent für **${IMMOBILIEN_KNOWLEDGE.firma.name}**. Frag mich gerne zu:`,
        `- **Immobilien & Objekten** (Lagen, Richtwerte pro m², hinterlegte Häuser)`,
        `- **Metallbau-Gewerken** (Balkongeländer, Treppen, Tore, Zäune & SIA-Normen)`,
        `- **Preisen & Kalkulation** (CHF/lfm, Kantonsfaktoren, Hypothekarzins)`,
        `- **Offerten & Kontakt**`
    ].join('\n');
}

const QUICK_QUESTIONS = [
    'Welche Immobilien & Objekte betreut ihr?',
    'Was kosten Balkongeländer & Metallbau?',
    'Wie funktioniert der Immobilienrechner?',
    'Kontakt & Offerte anfragen'
];

function Chatbot({ lang }) {
    const [messages, setMessages] = useImmer([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const isLoading = messages.some(message => message.loading);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const submitNewMessage = useCallback(async (overrideText) => {
        const rawText = typeof overrideText === 'string' ? overrideText : newMessage;
        const messageText = rawText.trim();

        if (!messageText || isLoading) return;

        setNewMessage('');

        const historyPayload = [
            ...messages.filter(m => !m.error && !m.loading),
            { role: 'user', content: messageText }
        ];

        setMessages(draft => {
            draft.push({ role: 'user', content: messageText });
            draft.push({ role: 'assistant', content: '', loading: true, error: false });
        });

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    messages: historyPayload,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const replyText = typeof data?.reply === 'string' && data.reply.trim()
                ? data.reply
                : generateLocalReply(messageText);

            setMessages(draft => {
                const lastMessage = draft.at(-1);
                if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = replyText;
                    lastMessage.loading = false;
                    lastMessage.error = false;
                }
            });
        } catch {
            const localReply = generateLocalReply(messageText);

            setMessages(draft => {
                const lastMessage = draft.at(-1);
                if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = localReply;
                    lastMessage.loading = false;
                    lastMessage.error = false;
                }
            });
        } finally {
            window.clearTimeout(timeoutId);
        }
    }, [isLoading, lang, messages, setMessages, newMessage]);

    return (
        <aside
            className={`chatbot-wrapper ${isOpen ? 'open' : 'closed'}`}
            aria-label="Leo KI-Chatbot"
        >
            {!isOpen ? (
                <button
                    type="button"
                    className="chatbot-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    aria-label="Chat öffnen"
                >
                    💬
                </button>
            ) : (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span >Leo KI-Chatbot</span>
                        <button
                            type="button"
                            className="chatbot-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Chat minimieren"
                        >
                            ✖
                        </button>
                    </div>

                    {messages.length === 0 && (
                        <div className="chatbot-welcome">
                            <h2>Willkommen!</h2>
                            <p className="chatbot-text-violet">
                                Frag mich zu Immobilien, Richtpreisen oder Metallbau-Gewerken:
                            </p>
                            <div className="chatbot-quick-questions">
                                {QUICK_QUESTIONS.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        className="chatbot-quick-btn"
                                        onClick={() => submitNewMessage(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <ChatMessages messages={messages} lang={lang} />

                    <ChatInput
                        newMessage={newMessage}
                        isLoading={isLoading}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                    />
                </div>
            )}
        </aside>
    );
}

export default Chatbot;