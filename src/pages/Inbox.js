import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const Inbox = () => {
    const navigate = useNavigate();
    const { inboxData, walkerData } = useAppContext();

    const handleConversationClick = (walkerId) => {
        vibrate();
        navigate(`/chat/${walkerId}`);
    };

    return (
        <div>
            <div className="page-header">
                <div className="placeholder"></div>
                <h1>Messages</h1>
            </div>
            <div className="space-y-3" id="inbox-list-container">
                {inboxData.map(convo => {
                    const walker = walkerData.find(w => w.id === convo.walkerId);
                    if (!walker) return null;
                    return (
                        <div
                            key={convo.id}
                            className="glass-card p-4 flex items-center gap-4 cursor-pointer inbox-item"
                            onClick={() => handleConversationClick(walker.id)}
                        >
                            <img src={walker.avatar} className="w-14 h-14 avatar-frame object-cover" alt={walker.name} />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-lg">{walker.name}</p>
                                    {convo.unread && <span className="w-3 h-3 bg-teal-300 rounded-full mt-1"></span>}
                                </div>
                                <p className="text-sm text-soft truncate">{convo.lastMessage}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Inbox;
