import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const WalkerProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const walkerId = id;
    const [searchParams] = useSearchParams();
    const backTarget = searchParams.get('back') || 'home';
    const { getWalkerById, toggleWalkerFavorite } = useAppContext();

    const walker = getWalkerById(walkerId);
    const [isFavorite, setIsFavorite] = useState(walker?.favorite || false);

    const handleBack = () => {
        vibrate();
        if (backTarget === 'booking') {
            navigate('/book');
        } else {
            navigate('/');
        }
    };

    const handleFavoriteToggle = () => {
        vibrate();
        toggleWalkerFavorite(parseInt(walkerId));
        setIsFavorite(!isFavorite);
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
                <h1>Walker Profile</h1>
                <button
                    className={`favorite-btn p-2 ${isFavorite ? 'favorited' : ''}`}
                    onClick={handleFavoriteToggle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div className="space-y-6 stagger-in">
                <div className="flex flex-col items-center">
                    <img
                        src={walker.avatar}
                        className="w-28 h-28 avatar-frame object-cover border border-[var(--surface-border)]"
                        alt={walker.name}
                    />
                    <h2 className="text-2xl font-bold mt-4">{walker.name}</h2>
                    <p className="text-soft">★ {walker.rating} ({walker.reviews} Reviews)</p>
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                    {walker.badges.map((badge, index) => (
                        <span key={index} className="badge-muted">{badge}</span>
                    ))}
                </div>
                <div className="glass-card p-5">
                    <h3 className="font-semibold mb-2">About Me</h3>
                    <p className="text-soft">{walker.bio}</p>
                </div>
                <div className="glass-card p-5">
                    <h3 className="font-semibold mb-2">Reviews</h3>
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center text-soft">
                            <p className="font-bold text-white">Anna K.</p>
                            <p>★★★★★</p>
                        </div>
                        <p className="text-sm italic text-soft">"Alex was amazing with my energetic puppy!"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkerProfile;
