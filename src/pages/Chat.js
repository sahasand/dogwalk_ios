import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const Chat = () => {
    const navigate = useNavigate();
    const { walkerId } = useParams();
    const { walkerData, chatData } = useAppContext();

    const walker = walkerData.find(w => w.id === parseInt(walkerId));
    const messages = chatData[walkerId] || [];
    const [messageText, setMessageText] = useState('');

    const handleBack = () => {
        vibrate();
        navigate('/inbox');
    };

    const handleSend = () => {
        vibrate();
        if (messageText.trim()) {
            // In a real app, this would send the message
            setMessageText('');
        }
    };

    if (!walker) {
        return <div>Walker not found</div>;
    }

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>{walker.name}</h1>
            </div>
            <div className="space-y-4 mb-20">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-4 left-0 right-0 max-w-xl mx-auto px-4">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="input-field pr-20"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSend();
                        }}
                    />
                    <button className="absolute right-2 btn btn-primary py-2 px-3 text-sm" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
