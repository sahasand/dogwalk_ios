import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast } from '../utils/helpers';

const BookingFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefill = location.state?.prefill;
    const { dogs, walkerData, addWalk, toggleWalkerFavorite } = useAppContext();

    const [currentScreen, setCurrentScreen] = useState(0);
    const [hasAppliedPrefillWalker, setHasAppliedPrefillWalker] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().split('T')[0];
    const minDate = prefill?.date && prefill.date < tomorrowIso ? prefill.date : tomorrowIso;

    const [bookingState, setBookingState] = useState({
        service: { duration: prefill?.duration || 30, price: prefill?.duration === 60 ? 40 : 25 },
        dateTime: { date: prefill?.date || tomorrowIso, time: prefill?.time || '10:00' },
        address: prefill?.address || '',
        selectedDogs: [],
        instructions: prefill?.notes || '',
        selectedWalker: null,
        total: 0
    });

    const [filteredWalkers, setFilteredWalkers] = useState([...walkerData]);
    const [activeFilter, setActiveFilter] = useState('nearest');

    useEffect(() => {
        // Preselect dogs if provided
        if (prefill?.dogIds && bookingState.selectedDogs.length === 0) {
            const preselectedDogs = prefill.dogIds.map(id => dogs.find(d => d.id === id)).filter(Boolean);
            setBookingState(prev => ({ ...prev, selectedDogs: preselectedDogs }));
        }
    }, [prefill, dogs, bookingState.selectedDogs.length]);

    const handleBack = () => {
        vibrate();
        navigate('/');
    };

    const updateProgressBar = (screen) => {
        const progressLine = document.getElementById('progressLineActive');
        if (progressLine) {
            progressLine.style.width = `${screen * 50}%`;
        }
    };

    const goToScreen = (screenIndex) => {
        vibrate();
        setCurrentScreen(screenIndex);
        updateProgressBar(screenIndex);
    };

    const handleServiceChange = (duration, price) => {
        setBookingState(prev => ({
            ...prev,
            service: { duration: parseInt(duration), price: parseFloat(price) }
        }));
    };

    const handleDogToggle = (dog) => {
        vibrate();
        setBookingState(prev => {
            const isSelected = prev.selectedDogs.some(d => d.id === dog.id);
            return {
                ...prev,
                selectedDogs: isSelected
                    ? prev.selectedDogs.filter(d => d.id !== dog.id)
                    : [...prev.selectedDogs, dog]
            };
        });
    };

    const isScreen1Valid = () => {
        return (
            bookingState.address.length > 2 &&
            bookingState.dateTime.date &&
            bookingState.dateTime.time &&
            bookingState.selectedDogs.length > 0
        );
    };

    const handleContinueToScreen2 = () => {
        goToScreen(1);
        // Apply prefill walker if available and not yet applied
        if (prefill?.walkerId && !hasAppliedPrefillWalker) {
            const walker = walkerData.find(w => w.id === prefill.walkerId);
            if (walker) {
                setTimeout(() => {
                    setBookingState(prev => ({ ...prev, selectedWalker: walker }));
                    setHasAppliedPrefillWalker(true);
                }, 100);
            }
        }
    };

    const handleFilterChange = (filter) => {
        vibrate();
        setActiveFilter(filter);
        let sorted = [...walkerData];
        if (filter === 'price') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (filter === 'top-rated') {
            sorted.sort((a, b) => b.rating - a.rating);
        } else if (filter === 'favorites') {
            sorted = sorted.filter(w => w.favorite);
        }
        setFilteredWalkers(sorted);
    };

    const handleWalkerSelect = (walker) => {
        vibrate();
        setBookingState(prev => ({ ...prev, selectedWalker: walker }));
    };

    const handleToggleFavorite = (walkerId, e) => {
        e.stopPropagation();
        vibrate();
        toggleWalkerFavorite(walkerId);
        // Re-apply filter to update the list
        handleFilterChange(activeFilter);
    };

    const handleContinueToScreen3 = () => {
        const servicePrice = bookingState.service.price;
        setBookingState(prev => ({ ...prev, total: servicePrice }));
        goToScreen(2);
    };

    const handleWalkerProfileClick = (walkerId, e) => {
        e.stopPropagation();
        vibrate();
        navigate(`/walker/${walkerId}?back=booking`);
    };

    const handleBookWalk = () => {
        vibrate(50);
        const newWalk = {
            date: bookingState.dateTime.date,
            time: bookingState.dateTime.time,
            duration: bookingState.service.duration,
            walker: bookingState.selectedWalker,
            dogs: bookingState.selectedDogs,
            price: bookingState.total,
            status: 'Upcoming',
            address: bookingState.address,
            note: bookingState.instructions
        };
        addWalk(newWalk);
        setShowSuccessModal(true);
    };

    const handleModalBackToHome = () => {
        vibrate();
        setShowSuccessModal(false);
        navigate('/');
    };

    return (
        <div className="page booking-flow-page">
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Book a Walk</h1>
            </div>
            <div className="progress-bar" id="progressBar">
                <div className="progress-line"></div>
                <div className="progress-line-active" id="progressLineActive" style={{ width: `${currentScreen * 50}%` }}></div>
                <div className={`progress-step ${currentScreen >= 0 ? 'active' : ''}`}>
                    <div className="progress-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                            <path d="m16 14-4 4-2-2" />
                        </svg>
                    </div>
                    <span className="progress-label">Plan</span>
                </div>
                <div className={`progress-step ${currentScreen >= 1 ? 'active' : ''}`}>
                    <div className="progress-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <span className="progress-label">Walker</span>
                </div>
                <div className={`progress-step ${currentScreen >= 2 ? 'active' : ''}`}>
                    <div className="progress-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <span className="progress-label">Review</span>
                </div>
            </div>

            <div id="booking-screens-container">
                {/* Screen 1: Plan */}
                <section className={`screen ${currentScreen === 0 ? 'active' : ''}`}>
                    <div className="space-y-6 stagger-in">
                        <h2 className="text-lg font-semibold">Service</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="checkable-card">
                                <input
                                    type="radio"
                                    name="service"
                                    value="30"
                                    checked={bookingState.service.duration === 30}
                                    onChange={() => handleServiceChange(30, 25)}
                                />
                                <div className="card-content glass-card p-4">
                                    <div className="text-2xl font-bold text-white">30 min</div>
                                    <div className="text-lg text-soft">$25</div>
                                </div>
                            </label>
                            <label className="checkable-card">
                                <input
                                    type="radio"
                                    name="service"
                                    value="60"
                                    checked={bookingState.service.duration === 60}
                                    onChange={() => handleServiceChange(60, 40)}
                                />
                                <div className="card-content glass-card p-4">
                                    <div className="text-2xl font-bold text-white">60 min</div>
                                    <div className="text-lg text-soft">$40</div>
                                </div>
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Date</h2>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        className="input-field"
                                        min={minDate}
                                        value={bookingState.dateTime.date}
                                        onChange={(e) => setBookingState(prev => ({
                                            ...prev,
                                            dateTime: { ...prev.dateTime, date: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Time</h2>
                                <div className="input-group">
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={bookingState.dateTime.time}
                                        onChange={(e) => setBookingState(prev => ({
                                            ...prev,
                                            dateTime: { ...prev.dateTime, time: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Address</h2>
                            <div className="input-group px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="e.g., 123 Bark Ave"
                                    className="input-field"
                                    value={bookingState.address}
                                    onChange={(e) => setBookingState(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Select Dogs</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {dogs.map(dog => (
                                    <label key={dog.id} className="checkable-card">
                                        <input
                                            type="checkbox"
                                            checked={bookingState.selectedDogs.some(d => d.id === dog.id)}
                                            onChange={() => handleDogToggle(dog)}
                                        />
                                        <div className="card-content glass-card p-4 flex flex-col items-center">
                                            <span className="text-4xl">{dog.avatar}</span>
                                            <span className="font-semibold mt-2">{dog.name}</span>
                                        </div>
                                        <div className="checkmark">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Special Instructions</h2>
                            <div className="input-group">
                                <textarea
                                    placeholder="He loves belly rubs!"
                                    className="input-field h-24 resize-none"
                                    value={bookingState.instructions}
                                    onChange={(e) => setBookingState(prev => ({ ...prev, instructions: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary w-full"
                            disabled={!isScreen1Valid()}
                            onClick={handleContinueToScreen2}
                        >
                            Continue
                        </button>
                    </div>
                </section>

                {/* Screen 2: Walker Selection */}
                <section className={`screen ${currentScreen === 1 ? 'active' : ''}`}>
                    <div className="space-y-6 stagger-in">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['nearest', 'favorites', 'price', 'top-rated'].map(filter => (
                                <button
                                    key={filter}
                                    type="button"
                                    className={`chip flex-1 btn btn-secondary ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(filter)}
                                    aria-pressed={activeFilter === filter}
                                >
                                    {filter === 'nearest' ? 'Nearest' : filter === 'favorites' ? 'Favorites ★' : filter === 'price' ? 'Price' : 'Top Rated'}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {filteredWalkers.length > 0 ? (
                                filteredWalkers.map(walker => (
                                    <div key={walker.id} className="walker-card-container">
                                        <input
                                            type="radio"
                                            name="walker"
                                            value={walker.id}
                                            className="hidden"
                                            id={`walker-radio-${walker.id}`}
                                            checked={bookingState.selectedWalker?.id === walker.id}
                                            onChange={() => handleWalkerSelect(walker)}
                                        />
                                        <label
                                            htmlFor={`walker-radio-${walker.id}`}
                                            className="glass-card p-4 flex gap-4 items-start cursor-pointer"
                                            style={{
                                                borderColor: bookingState.selectedWalker?.id === walker.id
                                                    ? 'var(--primary-color-light)'
                                                    : 'var(--surface-border)'
                                            }}
                                        >
                                            <img
                                                src={walker.avatar}
                                                alt={walker.name}
                                                className="w-16 h-16 avatar-frame object-cover view-profile-btn"
                                                onClick={(e) => handleWalkerProfileClick(walker.id, e)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg text-white">{walker.name}</h3>
                                                    {walker.verified && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#5eead4" stroke="#0b1120" strokeWidth="1">
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-sm text-soft">★ {walker.rating.toFixed(1)} ({walker.reviews} reviews)</p>
                                            </div>
                                            <div className="ml-auto flex flex-col items-end justify-between gap-3 self-stretch">
                                                <p className="text-xl font-bold text-white">${walker.price.toFixed(2)}</p>
                                                <button
                                                    type="button"
                                                    className={`favorite-btn ${walker.favorite ? 'favorited' : ''}`}
                                                    onClick={(e) => handleToggleFavorite(walker.id, e)}
                                                    aria-pressed={walker.favorite}
                                                    aria-label={`Toggle favorite for ${walker.name}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-soft">No walkers match your criteria.</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button className="btn btn-secondary" onClick={() => goToScreen(0)}>
                                Back
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!bookingState.selectedWalker}
                                onClick={handleContinueToScreen3}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </section>

                {/* Screen 3: Review */}
                <section className={`screen ${currentScreen === 2 ? 'active' : ''}`}>
                    <div className="space-y-6 stagger-in">
                        <div className="glass-card p-5 space-y-3">
                            <h2 className="text-lg font-semibold">Walk Details</h2>
                            <div className="divide-y divide-[var(--surface-border)]">
                                <div className="py-2 flex justify-between">
                                    <span>Date & Time</span>
                                    <span className="text-right font-semibold">
                                        {bookingState.dateTime.date} at {bookingState.dateTime.time}
                                    </span>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <span>Dogs</span>
                                    <span className="text-right font-semibold">
                                        {bookingState.selectedDogs.map(d => d.name).join(', ')}
                                    </span>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <span>Walker</span>
                                    <span className="text-right font-semibold">
                                        {bookingState.selectedWalker?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-5 space-y-3">
                            <h2 className="text-lg font-semibold">Price Summary</h2>
                            <div className="divide-y divide-[var(--surface-border)]">
                                <div className="py-2 flex justify-between">
                                    <span>{bookingState.service.duration} min walk</span>
                                    <span>${bookingState.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg border-t border-[var(--surface-border)] pt-3 mt-3">
                                <span>Total</span>
                                <span>${bookingState.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button className="btn btn-secondary" onClick={() => goToScreen(1)}>
                                Back
                            </button>
                            <button className="btn btn-primary" onClick={handleBookWalk}>
                                Book Walk
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay active">
                    <div className="modal-content glass-card">
                        <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2 text-white">Booking Confirmed!</h2>
                        <p className="text-soft">Your dog's adventure is scheduled.</p>
                        <button className="btn btn-primary mt-4 w-full" onClick={handleModalBackToHome}>
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
