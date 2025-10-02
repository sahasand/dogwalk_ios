import React from 'react';
import { useNavigate } from 'react-router-dom';
import { vibrate, showToast } from '../utils/helpers';

const HelpSupport = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        vibrate();
        navigate('/profile');
    };

    const handleStartChat = () => {
        vibrate();
        showToast('Support will be in touch shortly.');
    };

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Help &amp; Support</h1>
            </div>
            <div className="space-y-5">
                <div className="glass-card p-5 space-y-3">
                    <h2 className="text-lg font-semibold text-white">We're here for you</h2>
                    <p className="text-sm text-soft">Browse quick answers or reach out to our support team 24/7.</p>
                </div>
                <div className="glass-card p-5 space-y-3">
                    <h3 className="font-semibold text-white">Popular topics</h3>
                    <ul className="list-disc profile-task-list pl-5 space-y-2 text-sm text-soft">
                        <li>Managing walkers and recurring schedules</li>
                        <li>Updating payment and billing details</li>
                        <li>Preparing your pup for their walk</li>
                    </ul>
                </div>
                <div className="glass-card p-5 space-y-4">
                    <h3 className="font-semibold text-white">Contact options</h3>
                    <div className="space-y-3 text-sm text-soft">
                        <div className="flex items-start gap-3">
                            <span className="text-lg">💬</span>
                            <div>
                                <p className="text-white font-medium">Live chat</p>
                                <p>Connect with a specialist in under 2 minutes.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">📧</span>
                            <div>
                                <p className="text-white font-medium">Email</p>
                                <p>support@walkies.app</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">📞</span>
                            <div>
                                <p className="text-white font-medium">Phone</p>
                                <p>(800) 555-0199</p>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-secondary w-full" onClick={handleStartChat}>
                        Message support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
