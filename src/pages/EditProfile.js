import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast } from '../utils/helpers';

const EditProfile = () => {
    const navigate = useNavigate();
    const { userProfile, updateUserProfile } = useAppContext();

    const [formData, setFormData] = useState({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        preferredWalkTime: userProfile.preferredWalkTime || '',
        emergencyContact: userProfile.emergencyContact || '',
        bio: userProfile.bio || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        vibrate();

        updateUserProfile({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            preferredWalkTime: formData.preferredWalkTime.trim(),
            emergencyContact: formData.emergencyContact.trim(),
            bio: formData.bio.trim()
        });

        showToast('Profile updated');
        navigate('/profile');
    };

    const handleBack = () => {
        vibrate();
        navigate('/profile');
    };

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Edit Profile</h1>
            </div>
            <form id="edit-profile-form" className="space-y-5" onSubmit={handleSubmit}>
                <div className="glass-card p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold block mb-2">Full name</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                className="input-field"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-2">Email</label>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-2">Phone</label>
                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                className="input-field"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(555) 123-4567"
                            />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold block mb-2">Home address</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="address"
                                className="input-field"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street, City, State"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-2">Preferred walk time</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="preferredWalkTime"
                                className="input-field"
                                value={formData.preferredWalkTime}
                                onChange={handleChange}
                                placeholder="Mornings, evenings, etc."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-2">Emergency contact</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="emergencyContact"
                                className="input-field"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                placeholder="Name &amp; phone number"
                            />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-5 space-y-3">
                    <label className="text-sm font-semibold block">About your pack</label>
                    <div className="input-group">
                        <textarea
                            name="bio"
                            className="input-field h-28 resize-none"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Share quirks, routines, or favorite treats."
                        ></textarea>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Save changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
