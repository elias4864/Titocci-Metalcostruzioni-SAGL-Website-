
import { useState } from 'react';
import { useImmer } from 'use-immer';

import ChatInput from '../pages/ChatInput.jsx';
import ChatMessages from '../pages/ChatMessages.jsx';
import '../Styles/Chatbot.css';

function Chatbot({lang}) {
    const [messages, setMessages] = useImmer([]);
    const [newMessage, setNewMessage] = useState(""); // Richtig: Startet als leerer String

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
                throw new Error('Gemini Server Fehler');
            }

            const data = await response.json();

            setMessages(draft => {
                const lastMessage = draft[draft.length - 1];

                lastMessage.content =
                    data.reply || 'Keine Antwort erhalten.';

                lastMessage.loading = false;
            });

        } catch (error) {
            console.error('Chat error:', error);

            setMessages(draft => {
                const lastMessage = draft[draft.length - 1];

                lastMessage.loading = false;
                lastMessage.error = true;
                lastMessage.content =
                    'Die Verbindung zu Gemini konnte nicht hergestellt werden.';
            });
        }
    }

    return (
        <div className="chatbot">

            {messages.length === 0 && (
                <div className="chatbot-welcome">
                    <h2>Willkommen,Elias!</h2>
                    <p>Wie kann ich dir heute helfen?</p>
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
