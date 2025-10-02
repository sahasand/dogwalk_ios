import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast, calculateProfileCompletion } from '../utils/helpers';

const PROFILE_COMPLETION_FIELDS = [
    { key: 'email', label: 'Add your email address' },
    { key: 'phone', label: 'Add a phone number' },
    { key: 'address', label: 'Add your home address' },
    { key: 'bio', label: 'Tell walkers about your dogs' },
    { key: 'emergencyContact', label: 'Add an emergency contact' },
    { key: 'preferredWalkTime', label: 'Share your preferred walk time' }
];

const Profile = () => {
    const navigate = useNavigate();
    const { userProfile } = useAppContext();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { percentage, missing } = calculateProfileCompletion(userProfile, PROFILE_COMPLETION_FIELDS);
    const safePercentage = Math.min(100, Math.max(0, percentage));
    const completionCopy = missing.length
        ? 'Complete a few more details to help walkers know your pups better.'
        : 'Amazing! Walkers have everything they need.';

    const detailRows = [
        { label: 'Email', value: userProfile.email, placeholder: 'Add your email address' },
        { label: 'Phone', value: userProfile.phone, placeholder: 'Add a phone number' },
        { label: 'Home Address', value: userProfile.address, placeholder: 'Add your home address' },
        { label: 'Preferred Walk Time', value: userProfile.preferredWalkTime, placeholder: 'Let walkers know your ideal time' },
        { label: 'Emergency Contact', value: userProfile.emergencyContact, placeholder: 'Add an emergency contact' }
    ];

    const handleNavigate = (path) => {
        vibrate();
        navigate(path);
    };

    const handleLogout = () => {
        vibrate(20);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        vibrate();
        setShowLogoutModal(false);
        showToast('You have been logged out');
        navigate('/');
    };

    const cancelLogout = () => {
        vibrate();
        setShowLogoutModal(false);
    };

    return (
        <div>
            <div className="page-header">
                <div className="placeholder"></div>
                <h1>My Profile</h1>
            </div>
            <div className="space-y-6" id="profile-page-content">
                <div className="flex flex-col items-center text-center">
                <img
                    src={userProfile.avatar || 'https://placehold.co/160x160/0B1120/1DD3B0?text=A'}
                    alt={userProfile.name}
                    className="w-24 h-24 avatar-frame object-cover"
                />
                <h2 className="text-2xl font-bold mt-4 text-white">{userProfile.name || 'Your Name'}</h2>
                <p className="text-soft text-sm">{userProfile.email || 'Add your email so walkers can reach you'}</p>
            </div>

            <div className="glass-card p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-white">Profile completion</h3>
                        <p className="text-xs text-soft">{completionCopy}</p>
                    </div>
                    <span className="text-lg font-semibold text-white">{safePercentage}%</span>
                </div>
                <div
                    className="profile-progress"
                    role="progressbar"
                    aria-valuenow={safePercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    <div className="profile-progress-fill" style={{ width: `${safePercentage}%` }}></div>
                </div>
                {missing.length ? (
                    <ul className="list-disc profile-task-list pl-5 space-y-1 text-sm text-soft">
                        {missing.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-soft">All set! Your profile looks great.</p>
                )}
            </div>

            <div className="glass-card p-4 divide-y divide-[var(--surface-border)]">
                <a
                    href="#"
                    className="profile-link py-3 flex justify-between items-center"
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('/profile/edit');
                    }}
                >
                    <span>Edit Profile</span>
                    <span>›</span>
                </a>
                <a
                    href="#"
                    className="profile-link py-3 flex justify-between items-center"
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('/payments');
                    }}
                >
                    <span>Payment Methods</span>
                    <span>›</span>
                </a>
                <a
                    href="#"
                    className="profile-link py-3 flex justify-between items-center"
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('/help');
                    }}
                >
                    <span>Help &amp; Support</span>
                    <span>›</span>
                </a>
            </div>

            <div className="glass-card p-5 space-y-3">
                <h3 className="font-semibold text-white">Account details</h3>
                <p className="text-sm text-soft">Keep this info current so walkers arrive prepared.</p>
                <div className="divide-y divide-[var(--surface-border)]">
                    {detailRows.map((row, index) => {
                        const value = row.value && row.value.trim();
                        return (
                            <div key={index} className="py-3 flex justify-between items-start gap-4">
                                <span className="text-sm text-soft">{row.label}</span>
                                <span className={`text-sm ${value ? 'text-white font-medium' : 'italic text-soft'} text-right`}>
                                    {value || row.placeholder}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-card p-5 space-y-3">
                <h3 className="font-semibold text-white">About your pack</h3>
                <p className="text-sm text-soft">
                    {userProfile.bio ? userProfile.bio : 'Add a short bio so walkers know what makes your pups special.'}
                </p>
            </div>

                <button className="btn btn-secondary w-full" onClick={handleLogout}>
                    Log Out
                </button>

                {showLogoutModal && (
                    <div className="modal-overlay active" onClick={cancelLogout}>
                        <div className="modal-content glass-card space-y-4" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold text-white">Log out?</h2>
                            <p className="text-sm text-soft">
                                We'll keep your preferences saved so you can jump back in anytime.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="btn btn-secondary" onClick={cancelLogout}>
                                    Stay Logged In
                                </button>
                                <button type="button" className="btn btn-primary" onClick={confirmLogout}>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
