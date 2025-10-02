import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const Home = () => {
    const navigate = useNavigate();
    const { walkHistory, dogs } = useAppContext();

    useEffect(() => {
        renderDashboard();
    }, [walkHistory, dogs]);

    const renderDashboard = () => {
        // Empty for now - all logic is in the return statement
    };

    const getUpcomingWalk = () => {
        const statusPriority = { 'In Progress': 0, 'Upcoming': 1 };
        const sortByDate = (a, b) => {
            if (a.date && b.date) {
                const timeA = new Date(`${a.date}T${a.time || '00:00'}`);
                const timeB = new Date(`${b.date}T${b.time || '00:00'}`);
                if (!Number.isNaN(timeA.valueOf()) && !Number.isNaN(timeB.valueOf())) {
                    return timeA - timeB;
                }
            }
            return 0;
        };
        return walkHistory
            .filter(walk => ['In Progress', 'Upcoming'].includes(walk.status))
            .sort((a, b) => {
                const statusDiff = (statusPriority[a.status] ?? 2) - (statusPriority[b.status] ?? 2);
                if (statusDiff !== 0) return statusDiff;
                return sortByDate(a, b);
            })[0];
    };

    const getCompletedWalks = () => {
        return walkHistory
            .filter(w => w.status === 'Completed')
            .sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'));
    };

    const getMetrics = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const walksThisWeek = walkHistory.filter(walk => {
            if (!walk.date) return false;
            const walkDate = new Date(`${walk.date}T00:00:00`);
            if (Number.isNaN(walkDate.valueOf())) return false;
            return walkDate >= startOfWeek && walkDate <= endOfWeek;
        }).length;

        const scheduledCount = walkHistory.filter(walk => ['In Progress', 'Upcoming'].includes(walk.status)).length;
        const totalMinutes = walkHistory.reduce((sum, walk) => sum + (walk.duration || 30), 0);
        const highlightedWalk = walkHistory.find(walk => ['In Progress', 'Upcoming'].includes(walk.status));
        const heroWalkerRating = highlightedWalk?.walker?.rating;

        return { walksThisWeek, scheduledCount, totalMinutes, heroWalkerRating };
    };

    const getOtherUpcoming = (heroWalkId) => {
        return walkHistory
            .filter(walk => ['In Progress', 'Upcoming'].includes(walk.status) && walk.id !== heroWalkId)
            .sort((a, b) => {
                const dateA = new Date(`${a.date || ''}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date || ''}T${b.time || '00:00'}`);
                if (Number.isNaN(dateA.valueOf()) || Number.isNaN(dateB.valueOf())) return 0;
                return dateA - dateB;
            });
    };

    const formatUpcomingTime = (walk) => {
        if (walk.status === 'In Progress') {
            return 'In progress now';
        } else if (walk.date) {
            const dateObj = new Date(`${walk.date}T${walk.time || '00:00'}`);
            if (!Number.isNaN(dateObj.valueOf())) {
                const now = new Date();
                const sameDay = dateObj.toDateString() === now.toDateString();
                const dateLabel = sameDay ? 'Today' : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeLabel = walk.time ? dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
                return timeLabel ? `${dateLabel} at ${timeLabel}` : dateLabel;
            }
        }
        return 'Scheduled';
    };

    const handleUpcomingWalkClick = (walkId) => {
        vibrate();
        navigate(`/live-tracking/${walkId}`);
    };

    const handleWalkerClick = (walkerId) => {
        vibrate();
        navigate(`/walker/${walkerId}?back=home`);
    };

    const handleWalkSummaryClick = (walkId) => {
        vibrate();
        navigate(`/walk/${walkId}?back=home`);
    };

    const upcomingWalk = getUpcomingWalk();
    const metrics = getMetrics();
    const completedWalks = getCompletedWalks();
    const otherUpcoming = getOtherUpcoming(upcomingWalk?.id);
    const recentWalks = completedWalks.slice(0, 2);

    return (
        <div className="space-y-10 stagger-in home-screen">
            <header className="home-header space-y-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="eyebrow block">Today</span>
                        <h1 className="hero-title">Hello, Alex!</h1>
                        <p className="text-soft" id="home-greeting-subtitle">Ready for a new adventure? 🐾</p>
                    </div>
                    <button className="icon-button" id="home-notifications" aria-label="Notifications">
                        <span className="icon-button-indicator"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-soft" id="home-weather">
                    <span className="weather-pill" id="home-weather-pill">🌤️ 68°F • Perfect walking weather</span>
                </div>
            </header>

            {upcomingWalk && (
                <div id="upcoming-walk-section" className="space-y-4">
                    <div className="home-section-header">
                        <h2 className="section-title">Next Walk</h2>
                    </div>
                    <article
                        id="upcoming-walk-card"
                        className="glass-card hero-card"
                        onClick={() => handleUpcomingWalkClick(upcomingWalk.id)}
                        aria-live={upcomingWalk.status === 'In Progress' ? 'assertive' : 'polite'}
                    >
                        <div className="hero-card-main">
                            <div className="hero-illustration" aria-hidden="true">
                                {(upcomingWalk.dogs || []).map(dog => dog.avatar || dog.name).join(' ') || '🐕'}
                            </div>
                            <div className="hero-card-copy">
                                <p className="hero-status" id="upcoming-walk-status">
                                    {upcomingWalk.status === 'In Progress' ? 'In progress' : 'Next walk'}
                                </p>
                                <h3 className="hero-card-title" id="upcoming-walk-title">
                                    With {upcomingWalk.walker?.name || 'Your walker'}
                                </h3>
                                <p className="hero-card-meta" id="upcoming-walk-time">
                                    {formatUpcomingTime(upcomingWalk)}
                                </p>
                                <div className="hero-pill-row">
                                    <span className="badge-muted" id="upcoming-walk-duration">
                                        {upcomingWalk.duration ? `${upcomingWalk.duration} min` : '30 min'}
                                    </span>
                                    <span className="hero-dogs" id="upcoming-walk-dogs">
                                        🐾 {(upcomingWalk.dogs || []).map(d => d.name).join(', ') || 'Buddy'}
                                    </span>
                                </div>
                            </div>
                            <img
                                id="upcoming-walk-avatar"
                                src={upcomingWalk.walker?.avatar || 'https://placehold.co/96x96/0F766E/0B1120?text=W'}
                                alt={upcomingWalk.walker?.name || 'Your walker'}
                                className="hero-avatar"
                            />
                        </div>
                        <div className="hero-card-actions">
                            <button
                                className="btn btn-primary hero-cta"
                                id="upcoming-walk-cta"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpcomingWalkClick(upcomingWalk.id);
                                }}
                            >
                                {upcomingWalk.status === 'In Progress' ? 'Join live walk' : 'Preview route'}
                            </button>
                            <button
                                className="ghost-link"
                                id="upcoming-walk-details"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (upcomingWalk.walker?.id) {
                                        handleWalkerClick(upcomingWalk.walker.id);
                                    } else {
                                        handleUpcomingWalkClick(upcomingWalk.id);
                                    }
                                }}
                            >
                                {upcomingWalk.walker?.id ? 'About your walker' : 'View walk details'}
                            </button>
                        </div>
                    </article>
                </div>
            )}

            <div id="home-metrics" className="grid grid-cols-3 gap-3">
                <div className="metric-card">
                    <span className="metric-label">Walks this week</span>
                    <span className="metric-value">{metrics.walksThisWeek}</span>
                    <span className="metric-trend">{metrics.scheduledCount} scheduled</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Active pups</span>
                    <span className="metric-value">{dogs.length}</span>
                    <span className="metric-trend">Buddy pack ready</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Minutes booked</span>
                    <span className="metric-value">{metrics.totalMinutes}</span>
                    <span className="metric-trend">{metrics.heroWalkerRating ? `★ ${metrics.heroWalkerRating.toFixed(1)} walker` : 'Keep exploring'}</span>
                </div>
            </div>

            <div className="quick-actions-grid">
                <button id="cta-book-walk" className="btn btn-primary w-full text-base py-4" onClick={() => { vibrate(); navigate('/book'); }}>
                    Book New Walk
                </button>
                <button id="cta-recurring-walk" className="btn btn-secondary w-full text-base py-4" onClick={() => { vibrate(); navigate('/recurring-walks'); }}>
                    Schedule Walk
                </button>
            </div>

            <section className="space-y-4">
                <div className="home-section-header">
                    <h2 className="section-title">Recent Activity</h2>
                    <button className="link-button" id="home-view-history" type="button" onClick={() => { vibrate(); navigate('/walk-history'); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 3h18v18H3z" />
                            <path d="M16 3v18" />
                            <path d="M8 3v18" />
                            <path d="M3 8h18" />
                            <path d="M3 16h18" />
                        </svg>
                        <span>View all</span>
                    </button>
                </div>
                <div className="space-y-3" id="recent-activity-list">
                    {recentWalks.map(walk => {
                        const walkDate = new Date(`${walk.date}T00:00:00`);
                        const isValidDate = !Number.isNaN(walkDate.valueOf());
                        const formattedDate = isValidDate ? walkDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : walk.date;
                        const buttonLabel = `View walk summary for ${walk.walker.name} on ${formattedDate}`;
                        return (
                            <button
                                key={walk.id}
                                type="button"
                                className="glass-card recent-activity-item"
                                onClick={() => handleWalkSummaryClick(walk.id)}
                                aria-label={buttonLabel}
                            >
                                <div className="recent-activity-left">
                                    <img src={walk.walker.avatar} className="recent-activity-avatar" alt={walk.walker.name} />
                                    <div>
                                        <p className="recent-activity-title">Walk with {walk.walker.name}</p>
                                        <p className="recent-activity-meta">{formattedDate}</p>
                                    </div>
                                </div>
                                <div className="recent-activity-right">
                                    <span className="recent-activity-amount">${walk.price.toFixed(2)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Home;
