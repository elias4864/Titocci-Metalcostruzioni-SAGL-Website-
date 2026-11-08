import useAutosize from '../hooks/useAutoSize.js';
import Sendbutton from '../assets/Send.jpg';
import '../Styles/ChatInput.css';


function ChatInput({
                       newMessage,
                       isLoading,
                       setNewMessage,
                       submitNewMessage,lang
                   }) {
    const textareaRef = useAutosize(newMessage);

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            submitNewMessage();
        }
    }

    return (
        <div>
            <textarea
                ref={textareaRef}
                rows="1"
                value={newMessage}
                placeholder="Schreibe eine Nachricht..."
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />

            <button
                onClick={submitNewMessage}
                disabled={isLoading || !(newMessage || "").trim()}
            >
                <img className="send-btn" src={Sendbutton} alt="Senden" />
            </button>
        </div>
    );
}

export default ChatInput;