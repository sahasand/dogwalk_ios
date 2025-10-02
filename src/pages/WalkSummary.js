import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const WalkSummary = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const walkId = id;
    const [searchParams] = useSearchParams();
    const backTarget = searchParams.get('back') || 'home';
    const { getWalkById } = useAppContext();

    const walk = getWalkById(walkId);

    const handleBack = () => {
        vibrate();
        if (backTarget === 'history') {
            navigate('/walk-history');
        } else {
            navigate('/');
        }
    };

    if (!walk) {
        return <div>Walk not found</div>;
    }

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Walk Summary</h1>
            </div>
            <div className="space-y-6">
                <div className="glass-card overflow-hidden">
                    <img
                        src="https://placehold.co/600x300/3d1c5a/E0E0E0?text=Walk+Route+Map"
                        alt="Map of walk route"
                    />
                </div>
                <div className="glass-card p-4 flex items-center gap-4">
                    <img src={walk.walker.avatar} className="w-16 h-16 avatar-frame object-cover" alt={walk.walker.name} />
                    <div>
                        <p className="text-soft">Your walker was</p>
                        <p className="font-bold text-xl text-white">{walk.walker.name}</p>
                    </div>
                </div>
                {walk.photos && walk.photos.length > 0 && (
                    <div className="glass-card p-4">
                        <h3 className="font-semibold mb-3">Photo Gallery</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {walk.photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    className="rounded-lg w-full h-24 object-cover"
                                    alt={`Walk photo ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {walk.activity && (
                    <div className="glass-card p-4">
                        <h3 className="font-semibold mb-3">Activity Report</h3>
                        <div className="flex justify-around text-center">
                            {['Pee', 'Poo', 'Water'].map(act => {
                                const actKey = act.toLowerCase();
                                const completed = walk.activity[actKey];
                                return (
                                    <div key={act}>
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                                                completed
                                                    ? 'bg-emerald-500/40 text-emerald-200'
                                                    : 'bg-rose-500/35 text-rose-200'
                                            }`}
                                        >
                                            {completed ? '✓' : '✗'}
                                        </div>
                                        <p className="text-xs mt-2 text-soft uppercase tracking-wide">{act}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="glass-card p-4">
                    <h3 className="font-semibold mb-2">Walker's Note</h3>
                    <p className="text-soft italic">"{walk.note}"</p>
                </div>
            </div>
        </div>
    );
};

export default WalkSummary;
