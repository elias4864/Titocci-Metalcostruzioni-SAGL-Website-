import React from 'react';

function ChatInput({ newMessage, isLoading, setNewMessage, submitNewMessage }) {

    // Senden per Enter-Taste (ohne Shift)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitNewMessage();
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); submitNewMessage(); }} className="chat-input-container">
            <input
                type="text"
                className="chat-input-field"
                placeholder="Schreibe bitte  eine Nachricht..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            <button
                type="submit"
                className="chat-send-btn"
                disabled={isLoading || !newMessage.trim()}
            >
                {isLoading ? '...' : 'Senden'}
            </button>
        </form>
    );
}

export default ChatInput;