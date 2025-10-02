import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const LiveTracking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { walkHistory } = useAppContext();
    const [message, setMessage] = useState('');

    // Find walk by ID from URL, or fallback to first "In Progress" walk
    const walk = walkHistory.find(w => w.id === parseInt(id)) || walkHistory.find(w => w.status === 'In Progress');

    const handleBack = () => {
        vibrate();
        navigate('/');
    };

    const handleSendMessage = () => {
        vibrate();
        if (message.trim()) {
            // In a real app, this would send the message to the walker
            setMessage('');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Live Walk</h1>
            </div>

            {!walk ? (
                <div className="glass-card p-4">
                    <p>Walk not found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="glass-card non-hover overflow-hidden h-64 flex items-center justify-center">
                        <img
                            src="https://placehold.co/600x400/3d1c5a/E0E0E0?text=Live+Map"
                            alt="Live Map"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="glass-card non-hover p-4 text-center">
                        <p className="text-lg">Time Remaining</p>
                        <p className="text-4xl font-bold">21:47</p>
                    </div>
                    <div className="glass-card non-hover p-4">
                        <div className="flex items-center gap-4">
                            <img src={walk.walker?.avatar} className="w-12 h-12 avatar-frame object-cover" alt={walk.walker?.name} />
                            <p className="font-semibold">
                                {walk.walker?.name} is walking {walk.dogs?.map(d => d.name).join(', ')}
                            </p>
                        </div>
                    </div>
                    <div className="glass-card non-hover p-4">
                        <h3 className="font-semibold mb-2">Send a Message</h3>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Great job!"
                                className="input-field pr-20"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                }}
                            />
                            <button className="absolute right-2 btn btn-primary py-2 px-3 text-sm" onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveTracking;
