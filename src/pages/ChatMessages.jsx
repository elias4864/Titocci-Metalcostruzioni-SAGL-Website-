
import ReactMarkdown from 'react-markdown';
import Spinner from '../pages/Spinner.jsx';
import useAutoScroll from '../hooks/useAutoScroll.js';
import UserIcon from '../assets/robot-assistant.png';
import Error from '../assets/Error.png';


function ChatMessages({ messages }) {
    const scrollContentRef = useAutoScroll(messages);

    return (
        <div>
            {messages.map(({ role, content, loading, error }, idx) => (
                <div key={idx}>
                    {role === 'user' && (
                        <img src={UserIcon} alt="user icon" />
                    )}

                    <div>
                        {loading && !content ? (
                            <Spinner />
                        ) : role === 'assistant' ? (
                            <ReactMarkdown>{content || ''}</ReactMarkdown>
                        ) : (
                            <div>{content}</div>
                        )}

                        {error && (
                            <div>
                                <img src={Error} alt="error icon" />
                                <span>Fehler beim Erstellen der Antwort</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <div ref={scrollContentRef} />
        </div>
    );
}

export default ChatMessages;