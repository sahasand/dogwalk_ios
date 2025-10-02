import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast, formatDateDisplay, formatTimeDisplay, formatPlanDays, generatePlanOccurrences } from '../utils/helpers';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RecurringWalks = () => {
    const navigate = useNavigate();
    const {
        dogs,
        walkerData,
        recurringPlans,
        createRecurringPlan,
        updateRecurringPlan,
        toggleRecurringPlanStatus,
        deleteRecurringPlan,
        getRecurringPlanById,
        addWalk
    } = useAppContext();

    const [showForm, setShowForm] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedDogIds, setSelectedDogIds] = useState([]);
    const [selectedWalkerId, setSelectedWalkerId] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [walkerFilter, setWalkerFilter] = useState('nearest');
    const [formData, setFormData] = useState({
        label: '',
        startDate: '',
        time: '09:00',
        address: '',
        notes: ''
    });

    const todayIso = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!formData.startDate) {
            setFormData(prev => ({ ...prev, startDate: todayIso }));
        }
    }, [todayIso]);

    const handleBack = () => {
        vibrate();
        navigate('/');
    };

    const handleShowForm = () => {
        vibrate();
        resetForm();
        setShowForm(true);
    };

    const handleCloseForm = () => {
        vibrate();
        resetForm();
        setShowForm(false);
    };

    const resetForm = () => {
        setEditingPlanId(null);
        setSelectedDays([]);
        setSelectedDogIds([]);
        setSelectedWalkerId(null);
        setSelectedDuration(30);
        setWalkerFilter('nearest');
        setFormData({
            label: '',
            startDate: todayIso,
            time: '09:00',
            address: '',
            notes: ''
        });
    };

    const populateForm = (plan) => {
        if (!plan) return;
        setEditingPlanId(plan.id);
        setSelectedDays(plan.daysOfWeek || []);
        setSelectedDogIds(plan.dogIds || []);
        setSelectedWalkerId(plan.walkerId || null);
        setSelectedDuration(plan.duration || 30);
        setFormData({
            label: plan.label || '',
            startDate: plan.startDate || todayIso,
            time: plan.time || '09:00',
            address: plan.address || '',
            notes: plan.notes || ''
        });
        setShowForm(true);
    };

    const handleDayToggle = (dayIndex) => {
        vibrate();
        setSelectedDays(prev =>
            prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort((a, b) => a - b)
        );
    };

    const handleDogToggle = (dogId) => {
        vibrate();
        setSelectedDogIds(prev =>
            prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId]
        );
    };

    const handleWalkerSelect = (walkerId) => {
        vibrate();
        setSelectedWalkerId(walkerId);
    };

    const handleFilterChange = (filter) => {
        vibrate();
        setWalkerFilter(filter);
    };

    const getFilteredWalkers = () => {
        let filtered = [...walkerData];
        if (walkerFilter === 'price') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (walkerFilter === 'top-rated') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (walkerFilter === 'favorites') {
            filtered = filtered.filter(w => w.favorite);
        }
        return filtered;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        vibrate();

        // Validation
        if (!selectedDays.length) {
            alert('Select at least one day of the week.');
            return;
        }
        if (!selectedDogIds.length) {
            alert('Select at least one dog.');
            return;
        }
        if (!selectedWalkerId) {
            alert('Choose a preferred walker.');
            return;
        }
        if (!formData.address.trim()) {
            alert('Add a pickup address so your walker knows where to go.');
            return;
        }

        const payload = {
            label: formData.label,
            daysOfWeek: selectedDays,
            dogIds: selectedDogIds,
            walkerId: selectedWalkerId,
            duration: selectedDuration,
            startDate: formData.startDate,
            time: formData.time,
            address: formData.address,
            notes: formData.notes
        };

        if (editingPlanId) {
            updateRecurringPlan(editingPlanId, payload);
            showToast('Schedule updated');
        } else {
            createRecurringPlan(payload);
            showToast('Schedule created');
        }

        handleCloseForm();
    };

    const handlePlanAction = (action, planId, occurrenceDate = null) => {
        vibrate();
        const plan = getRecurringPlanById(planId);
        if (!plan) return;

        if (action === 'edit') {
            populateForm(plan);
        } else if (action === 'toggle') {
            toggleRecurringPlanStatus(planId);
            showToast(plan.status === 'active' ? 'Plan paused' : 'Plan resumed');
        } else if (action === 'delete') {
            if (editingPlanId === planId) {
                handleCloseForm();
            }
            deleteRecurringPlan(planId);
            showToast('Plan deleted');
        } else if (action === 'confirm' && occurrenceDate) {
            if (plan.status !== 'active') return;
            const walker = walkerData.find(w => w.id === plan.walkerId);
            const planDogs = plan.dogIds.map(id => dogs.find(dog => dog.id === id)).filter(Boolean);
            if (!walker || planDogs.length === 0) return;

            const durationMultiplier = plan.duration === 60 ? 1.6 : plan.duration / 30;
            const computedPrice = Math.round(walker.price * durationMultiplier * 100) / 100;

            const newWalk = {
                date: occurrenceDate,
                time: plan.time,
                duration: plan.duration,
                walker,
                dogs: planDogs,
                price: computedPrice,
                status: 'Upcoming',
                address: plan.address,
                note: plan.notes,
                source: 'Recurring Plan'
            };

            addWalk(newWalk);
            updateRecurringPlan(planId, { lastConfirmedDate: occurrenceDate });
            showToast('Walk confirmed');
        } else if (action === 'review' && occurrenceDate) {
            // Navigate to booking flow with prefilled data
            navigate('/book', {
                state: {
                    prefill: {
                        date: occurrenceDate,
                        time: plan.time,
                        duration: plan.duration,
                        walkerId: plan.walkerId,
                        dogIds: plan.dogIds,
                        address: plan.address,
                        notes: plan.notes
                    }
                }
            });
        }
    };

    const filteredWalkers = getFilteredWalkers();

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack} aria-label="Back to Home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Scheduled Walks</h1>
            </div>
            <div className="space-y-6">
                {recurringPlans.length === 0 && !showForm && (
                    <div className="glass-card p-5 text-center space-y-2">
                        <div className="text-4xl">🗓️</div>
                        <h2 className="text-lg font-semibold">No recurring walks yet</h2>
                        <p className="text-sm text-soft">Create a schedule so your pups never miss their favorite stroll.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {recurringPlans.map(plan => {
                        const walker = walkerData.find(w => w.id === plan.walkerId);
                        const planDogs = plan.dogIds.map(id => dogs.find(d => d.id === id)?.name).filter(Boolean).join(', ');
                        const nextOccurrence = generatePlanOccurrences(plan, 1)[0];
                        const nextLabel = nextOccurrence
                            ? `${formatDateDisplay(nextOccurrence.date)} at ${formatTimeDisplay(plan.time)}`
                            : 'No upcoming days';
                        const statusClass = plan.status === 'active' ? 'status-badge--active' : 'status-badge--paused';
                        const statusLabel = plan.status === 'active' ? 'Active' : 'Paused';
                        const subtitle = plan.label ? (walker ? walker.name : 'Walker TBD') : formatPlanDays(plan.daysOfWeek, DAY_LABELS);

                        return (
                            <div key={plan.id} className="glass-card p-5 space-y-3 recurring-plan-card">
                                <div className="flex justify-between gap-3 items-start">
                                    <div>
                                        <p className="font-semibold text-base">{plan.label || formatPlanDays(plan.daysOfWeek, DAY_LABELS)}</p>
                                        <p className="text-sm text-soft">{subtitle}</p>
                                    </div>
                                    <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
                                </div>
                                <div className="text-sm text-soft space-y-1">
                                    <p>{formatPlanDays(plan.daysOfWeek, DAY_LABELS)} • {formatTimeDisplay(plan.time)} • {plan.duration} min</p>
                                    <p>Walker: {walker ? walker.name : 'Select during booking'}</p>
                                    <p>Dogs: {planDogs || 'Select dogs'}</p>
                                    <p className="next-occurrence">Next: {nextLabel}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button
                                        type="button"
                                        className="btn btn-secondary flex-1"
                                        disabled={!nextOccurrence}
                                        onClick={() => handlePlanAction('review', plan.id, nextOccurrence?.date)}
                                    >
                                        Review next walk
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary flex-1"
                                        disabled={plan.status !== 'active' || !nextOccurrence}
                                        onClick={() => handlePlanAction('confirm', plan.id, nextOccurrence?.date)}
                                    >
                                        Confirm next walk
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary flex-1"
                                        onClick={() => handlePlanAction('edit', plan.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary flex-1"
                                        onClick={() => handlePlanAction('toggle', plan.id)}
                                    >
                                        {plan.status === 'active' ? 'Pause' : 'Resume'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger flex-1"
                                        onClick={() => handlePlanAction('delete', plan.id)}
                                    >
                                        Cancel plan
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!showForm && (
                    <button className="btn btn-primary w-full" onClick={handleShowForm}>
                        Set Up New Schedule
                    </button>
                )}

                {showForm && (
                    <div className="scheduler-form active">
                        <form className="glass-card p-5 space-y-5" onSubmit={handleSubmit} noValidate>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {editingPlanId ? 'Edit Schedule' : 'Set Up New Schedule'}
                                    </h2>
                                    <p className="text-sm text-soft">
                                        {editingPlanId ? 'Tweak the routine without missing a beat.' : 'Pick the routine that fits your pups best.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={handleCloseForm}
                                    aria-label="Close schedule form"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold mb-2 text-white">
                                        Plan nickname <span className="text-soft">(optional)</span>
                                    </h3>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., Morning crew"
                                            value={formData.label}
                                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Pick days</h3>
                                    <div className="day-picker-grid">
                                        {DAY_LABELS.map((label, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`day-toggle ${selectedDays.includes(index) ? 'active' : ''}`}
                                                onClick={() => handleDayToggle(index)}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-2">Start date</h3>
                                        <div className="input-group">
                                            <input
                                                type="date"
                                                className="input-field"
                                                min={todayIso}
                                                value={formData.startDate}
                                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold mb-2">Walk time</h3>
                                        <div className="input-group">
                                            <input
                                                type="time"
                                                className="input-field"
                                                value={formData.time}
                                                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Duration</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: 30, label: '30 min', price: '$25' },
                                            { value: 60, label: '60 min', price: '$40' }
                                        ].map(option => (
                                            <label key={option.value} className="checkable-card">
                                                <input
                                                    type="radio"
                                                    name="recurring-duration"
                                                    value={option.value}
                                                    checked={selectedDuration === option.value}
                                                    onChange={() => setSelectedDuration(option.value)}
                                                />
                                                <div className="card-content glass-card p-4">
                                                    <div className="text-lg font-semibold">{option.label}</div>
                                                    <div className="text-sm text-soft">{option.price}</div>
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
                                    <h3 className="text-sm font-semibold mb-2">Select dogs</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {dogs.map(dog => (
                                            <label key={dog.id} className="checkable-card">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDogIds.includes(dog.id)}
                                                    onChange={() => handleDogToggle(dog.id)}
                                                />
                                                <div className="card-content glass-card p-4 flex flex-col items-center">
                                                    <span className="text-3xl">{dog.avatar}</span>
                                                    <span className="font-semibold mt-2 text-sm">{dog.name}</span>
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
                                    <h3 className="text-sm font-semibold mb-2">Preferred walker</h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {['nearest', 'favorites', 'price', 'top-rated'].map(filter => (
                                            <button
                                                key={filter}
                                                type="button"
                                                className={`chip btn btn-secondary ${walkerFilter === filter ? 'active' : ''}`}
                                                onClick={() => handleFilterChange(filter)}
                                            >
                                                {filter === 'nearest' ? 'Nearest' : filter === 'favorites' ? 'Favorites ★' : filter === 'price' ? 'Price' : 'Top Rated'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        {filteredWalkers.length > 0 ? (
                                            filteredWalkers.map(walker => (
                                                <label
                                                    key={walker.id}
                                                    className={`walker-option glass-card p-4 flex items-center gap-3 ${selectedWalkerId === walker.id ? 'selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="recurring-walker"
                                                        checked={selectedWalkerId === walker.id}
                                                        onChange={() => handleWalkerSelect(walker.id)}
                                                    />
                                                    <img src={walker.avatar} alt={walker.name} className="w-12 h-12 avatar-frame object-cover" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">{walker.name}</span>
                                                            {walker.verified && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#5eead4" stroke="#0b1120" strokeWidth="1">
                                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                    <polyline points="22 4 12 14.01 9 11.01" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-soft">★ {walker.rating.toFixed(1)} • ${walker.price.toFixed(0)}</p>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="selection-indicator">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-soft text-center">No walkers match your filters.</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Pickup address</h3>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., 123 Bark Ave"
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Notes for walker</h3>
                                    <div className="input-group">
                                        <textarea
                                            className="input-field h-24 resize-none"
                                            placeholder="Anything special to remember?"
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPlanId ? 'Update Schedule' : 'Save Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecurringWalks;
