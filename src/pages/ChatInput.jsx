import React from 'react';
import '../Styles/ChatInput.css';

function ChatInput({ newMessage = "", isLoading = false, setNewMessage, submitNewMessage }) {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (typeof submitNewMessage === 'function') {
                submitNewMessage();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof submitNewMessage === 'function') {
            submitNewMessage();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-container">
            <input
                type="text"
                className="chat-input-field"
                placeholder="Schreibe eine Nachricht..."
                value={newMessage}
                onChange={(e) => {
                    if (typeof setNewMessage === 'function') {
                        setNewMessage(e.target.value);
                    }
                }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
            />
            <button
                type="submit"
                className="chat-send-btn"
                disabled={isLoading || !newMessage?.trim()}
            >
                {isLoading ? '...' : 'Senden'}
            </button>
        </form>
    );
}

export default ChatInput;