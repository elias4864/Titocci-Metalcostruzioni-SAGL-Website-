import { useState } from 'react';
import { useImmer } from 'use-immer';

import ChatInput from '../pages/ChatInput.jsx';
import ChatMessages from '../pages/ChatMessages.jsx';
import '../Styles/Chatbot.css';

function Chatbot({ lang }) {
    const [messages, setMessages] = useImmer([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const isLoading = messages.some(message => message.loading);

    async function submitNewMessage() {
        const messageText = newMessage.trim();

        if (!messageText || isLoading) return;

        setNewMessage('');

        const currentMessages = [
            ...messages.filter(m => !m.error && !m.loading),
            { role: 'user', content: messageText }
        ];

        setMessages(draft => {
            draft.push({
                role: 'user',
                content: messageText
            });

            draft.push({
                role: 'assistant',
                content: '',
                loading: true,
                error: false
            });
        });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: currentMessages
                })
            });

            if (!response.ok) {
                throw new Error(`Server antwortete con Status ${response.status}`);
            }

            const data = await response.json();

            setMessages(draft => {
                const lastMessage = draft.at(-1);
                if (lastMessage) {
                    lastMessage.content = data.reply || 'Keine Antwort erhalten.';
                    lastMessage.loading = false;
                }
            });

        } catch (error) {
            console.warn('Backend API /api/chat nicht erreichbar:', error.message);

            // Fehler sauber im State abfangen, anstatt abzustürzen
            setMessages(draft => {
                const lastMessage = draft.at(-1);
                if (lastMessage) {
                    lastMessage.loading = false;
                    lastMessage.error = true;
                    lastMessage.content = 'Hinweis: Die Verbindung zum Server (/api/chat) ist aktuell nicht erreichbar. Bitte stelle sicher, dass der Backend-Server läuft.';
                }
            });
        }
    }

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : 'closed'}`}>
            {!isOpen && (
                <button
                    type="button"
                    className="chatbot-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    aria-label="Chat öffnen"
                >
                    💬
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>Leo KI-Chatbot</span>
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
                            <h2>Willkommen, Elias!</h2>
                            <p>Wie kann ich dir heute helfen?</p>
                        </div>
                    )}

                    <ChatMessages messages={messages} />

                    <ChatInput
                        newMessage={newMessage}
                        isLoading={isLoading}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                    />
                </div>
            )}
        </div>
    );
}

export default Chatbot;