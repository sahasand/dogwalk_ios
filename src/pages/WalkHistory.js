import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, formatTimeDisplay } from '../utils/helpers';

const WalkHistory = () => {
    const navigate = useNavigate();
    const { walkHistory } = useAppContext();

    const completedWalks = walkHistory
        .filter(walk => walk.status === 'Completed')
        .sort((a, b) => {
            const aDate = new Date(`${a.date || ''}T${a.time || '00:00'}`);
            const bDate = new Date(`${b.date || ''}T${b.time || '00:00'}`);
            if (Number.isNaN(aDate.valueOf()) && Number.isNaN(bDate.valueOf())) return 0;
            if (Number.isNaN(aDate.valueOf())) return 1;
            if (Number.isNaN(bDate.valueOf())) return -1;
            return bDate - aDate;
        });

    const handleWalkClick = (walkId) => {
        vibrate();
        navigate(`/walk/${walkId}?back=history`);
    };

    return (
        <div className="space-y-4">
            {completedWalks.length > 0 ? (
                completedWalks.map(walk => {
                    const walkDate = new Date(`${walk.date || ''}T${walk.time || '00:00'}`);
                    const hasValidDate = !Number.isNaN(walkDate.valueOf());
                    const formattedDate = hasValidDate
                        ? walkDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : walk.date || 'Upcoming walk';
                    const formattedTime = hasValidDate && walk.time ? ` • ${formatTimeDisplay(walk.time)}` : '';
                    const walkerName = walk.walker?.name || 'Your walker';
                    const dogsLabel = (walk.dogs || []).map(dog => dog.name).join(', ');
                    const buttonLabel = `View walk summary for ${walkerName} on ${formattedDate}`;

                    return (
                        <button
                            key={walk.id}
                            type="button"
                            className="glass-card walk-history-item"
                            onClick={() => handleWalkClick(walk.id)}
                            aria-label={buttonLabel}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={walk.walker?.avatar || 'https://placehold.co/64x64/0F172A/F8FAFC?text=W'}
                                        alt={walkerName}
                                        className="recent-activity-avatar"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">Walk with {walkerName}</p>
                                        <p className="text-sm text-soft">
                                            {formattedDate}
                                            {formattedTime}
                                            {dogsLabel ? ` • ${dogsLabel}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="recent-activity-amount block">
                                        ${Number.isFinite(walk.price) ? walk.price.toFixed(2) : '—'}
                                    </span>
                                    <span className="text-xs uppercase tracking-wide text-soft">{walk.status}</span>
                                </div>
                            </div>
                        </button>
                    );
                })
            ) : (
                <div className="glass-card p-5 text-center space-y-2">
                    <div className="text-4xl">🐾</div>
                    <h2 className="text-lg font-semibold">No walk history yet</h2>
                    <p className="text-sm text-soft">Your completed walks will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default WalkHistory;
