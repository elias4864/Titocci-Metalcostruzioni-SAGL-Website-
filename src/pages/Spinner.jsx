
function Spinner() {
    return (
        <div className="spinner">
            <div className="spinner-circle"></div>

            <style>{`
                .spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 12px;
                }

                .spinner-circle {
                    width: 28px;
                    height: 28px;
                    border: 3px solid #ddd;
                    border-top-color: #2563eb;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default Spinner;
