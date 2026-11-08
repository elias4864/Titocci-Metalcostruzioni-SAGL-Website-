import ReactMarkdown from 'react-markdown';
import Spinner from '../pages/Spinner.jsx';
import useAutoScroll from '../hooks/useAutoScroll.js';
import UserIcon from '../assets/robot-assistant.png';
import Error from '../assets/Error.png';

function ChatMessages({ messages, lang }) {
    const scrollContentRef = useAutoScroll(messages);

    return (
        <div className="chat-messages-container">
            {messages?.map(({ role, content, loading, error }, idx) => (
                <div key={idx} className={`message-item ${role}`}>
                    {/* User Icon */}
                    {role === 'user' && (
                        <img src={UserIcon} alt="user icon" />
                    )}

                    {/* Inhalt / Ladezustand / Antwort */}
                    {loading && !content ? (
                        <Spinner />
                    ) : role === 'assistant' ? (
                        <ReactMarkdown>{content || ''}</ReactMarkdown>
                    ) : (
                        <div>{content}</div>
                    )}

                    {/* Fehleranzeige */}
                    {error && (
                        <div className="error-container">
                            <img src={Error} alt="error icon" />
                            <span>Fehler beim Erstellen der Antwort</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Referenz für automatisches Scrollen */}
            <div ref={scrollContentRef} />
        </div>
    );
}

export default ChatMessages;