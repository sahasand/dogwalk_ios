import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { vibrate } from '../utils/helpers';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = async (path) => {
        await vibrate();
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${isActive('/') ? 'active' : ''}`}
                onClick={() => handleNavClick('/')}
            >
                <span className="nav-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>
                </span>
                <span className="nav-label">Home</span>
            </button>
            <button
                className={`nav-item ${isActive('/inbox') ? 'active' : ''}`}
                onClick={() => handleNavClick('/inbox')}
            >
                <span className="nav-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z"/></svg>
                </span>
                <span className="nav-label">Messages</span>
            </button>
            <button
                className="nav-item nav-item-primary"
                onClick={() => handleNavClick('/book')}
                aria-label="Book a walk"
            >
                <span className="nav-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                        <path d="M19 4.5a3.8 3.8 0 0 1 3.8 3.8c0 3.4-3.8 7.4-3.8 7.4s-3.8-4-3.8-7.4A3.8 3.8 0 0 1 19 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="19" cy="8.3" r="1.4" fill="currentColor"/>
                        <circle cx="8" cy="18.5" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
                        <circle cx="8" cy="18.5" r="1.1" fill="currentColor"/>
                        <path d="M8 15.6C10.3 15.6 11.7 13.9 12.8 11.8S16.4 8 19 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <span className="nav-label">Book Walk</span>
                <span className="nav-caption">Book a Walk</span>
            </button>
            <button
                className={`nav-item ${isActive('/dogs') ? 'active' : ''}`}
                onClick={() => handleNavClick('/dogs')}
            >
                <span className="nav-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 12.2c-3.24 0-5.9 2.4-5.9 5.23 0 1.97 1.64 3.57 5.9 3.57s5.9-1.6 5.9-3.57c0-2.83-2.66-5.23-5.9-5.23Z"/>
                        <circle cx="7.4" cy="9.2" r="2" fill="currentColor"/>
                        <circle cx="16.6" cy="9.2" r="2" fill="currentColor"/>
                        <circle cx="10" cy="6.1" r="1.8" fill="currentColor"/>
                        <circle cx="14" cy="6.1" r="1.8" fill="currentColor"/>
                    </svg>
                </span>
                <span className="nav-label">Dogs</span>
            </button>
            <button
                className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => handleNavClick('/profile')}
            >
                <span className="nav-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                </span>
                <span className="nav-label">Profile</span>
            </button>
        </nav>
    );
};

export default BottomNav;
