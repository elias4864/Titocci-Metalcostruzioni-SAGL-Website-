import { useState } from 'react';
import { useImmer } from 'use-immer';

import ChatInput from '../pages/ChatInput.jsx';
import ChatMessages from '../pages/ChatMessages.jsx';

function Chatbot() {
    const [messages, setMessages] = useImmer([]);
    const [newMessage, setNewMessage] = useState('');

    const isLoading = messages.some(message => message.loading);

    async function submitNewMessage() {
        const messageText = newMessage.trim();

        if (!messageText || isLoading) return;

        setNewMessage('');

        // 1. Nachrichten im State aktualisieren (User-Nachricht + Loader für Assistant)
        setMessages(draft => {
            draft.push({ role: 'user', content: messageText });
            draft.push({ role: 'assistant', content: '', loading: true, error: false });
        });

        try {
            // Aktuellen Verlauf inklusive der neuen Nachricht holen
            // Wichtig: Wir filtern 'loading' und 'error' heraus, damit Ollama saubere Daten bekommt!
            const currentMessages = messages.concat({ role: 'user', content: messageText });
            const apiMessages = currentMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            // Direkter fetch an den lokalen Ollama-Server
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'qwen2.5', // Dein lokales Modell (z.B. gemma2 oder qwen2.5)
                    messages: apiMessages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('Ollama Server Fehler');
            }

            const data = await response.json();
            const replyText = data.message?.content || 'Keine Antwort erhalten.';

            // Letzte Nachricht (Assistant) mit der echten Antwort füllen
            setMessages(draft => {
                const lastMessage = draft[draft.length - 1];
                lastMessage.content = replyText;
                lastMessage.loading = false;
            });

        } catch (error) {
            console.error('Chat error:', error);

            setMessages(draft => {
                const lastMessage = draft[draft.length - 1];
                lastMessage.loading = false;
                lastMessage.error = true;
                lastMessage.content = 'Die Verbindung zu Ollama konnte nicht hergestellt werden.';
            });
        }
    }

    return (
        <div className="chatbot">

            {messages.length === 0 && (
                <div className="chatbot-welcome">
                    <h2>Willkommen!</h2>
                    <p>Wie kann ich dir helfen?</p>
                </div>
            )}

            <ChatMessages
                messages={messages}
            />

            <ChatInput
                newMessage={newMessage}
                isLoading={isLoading}
                setNewMessage={setNewMessage}
                submitNewMessage={submitNewMessage}
            />

        </div>
    );
}

export default Chatbot;