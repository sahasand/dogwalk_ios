import React, { createContext, useContext, useState } from 'react';
import { dogData as initialDogs, walkerData as initialWalkers, walkHistoryData as initialWalkHistory, recurringWalkPlans as initialRecurringPlans, inboxData, chatData, paymentData, userProfile as initialUserProfile } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [dogs, setDogs] = useState(initialDogs);
    const [walkers, setWalkers] = useState(initialWalkers);
    const [walkHistory, setWalkHistory] = useState(initialWalkHistory);
    const [recurringPlans, setRecurringPlans] = useState(initialRecurringPlans);
    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [bookingState, setBookingState] = useState({
        service: 30,
        price: 25,
        date: '',
        time: '',
        address: '',
        selectedDogs: [],
        instructions: '',
        selectedWalker: null
    });

    // Dog management
    const addDog = (dog) => {
        const newDog = { ...dog, id: Date.now() };
        setDogs([...dogs, newDog]);
        return newDog;
    };

    const updateDog = (id, updates) => {
        setDogs(dogs.map(dog => dog.id === id ? { ...dog, ...updates } : dog));
    };

    const deleteDog = (id) => {
        setDogs(dogs.filter(dog => dog.id !== id));
    };

    const getDogById = (id) => {
        return dogs.find(dog => dog.id === parseInt(id));
    };

    // Walk management
    const addWalk = (walk) => {
        const newWalk = { ...walk, id: Date.now() };
        setWalkHistory([newWalk, ...walkHistory]);
        return newWalk;
    };

    const getWalkById = (id) => {
        return walkHistory.find(walk => walk.id === parseInt(id));
    };

    // Recurring plans management
    const createRecurringPlan = (data) => {
        const plan = {
            id: Date.now(),
            label: data.label?.trim() || '',
            dogIds: Array.isArray(data.dogIds) ? Array.from(new Set(data.dogIds.map(id => parseInt(id, 10)))) : [],
            walkerId: data.walkerId ? parseInt(data.walkerId, 10) : null,
            daysOfWeek: Array.from(new Set(data.daysOfWeek.map(day => parseInt(day, 10)).filter(day => day >= 0 && day <= 6))).sort((a, b) => a - b),
            time: data.time || '09:00',
            duration: data.duration ? parseInt(data.duration, 10) : 30,
            startDate: data.startDate,
            address: data.address?.trim() || '',
            notes: data.notes?.trim() || '',
            status: 'active',
            lastConfirmedDate: null
        };
        setRecurringPlans([...recurringPlans, plan]);
        return plan;
    };

    const updateRecurringPlan = (planId, updates) => {
        setRecurringPlans(recurringPlans.map(plan => {
            if (plan.id === planId) {
                const updated = { ...plan };
                if (updates.daysOfWeek) updated.daysOfWeek = Array.from(new Set(updates.daysOfWeek.map(day => parseInt(day, 10)).filter(day => day >= 0 && day <= 6))).sort((a, b) => a - b);
                if (updates.dogIds) updated.dogIds = Array.from(new Set(updates.dogIds.map(id => parseInt(id, 10))));
                if (typeof updates.walkerId !== 'undefined') updated.walkerId = parseInt(updates.walkerId, 10);
                if (typeof updates.time === 'string') updated.time = updates.time;
                if (updates.duration) updated.duration = parseInt(updates.duration, 10);
                if (typeof updates.startDate === 'string') updated.startDate = updates.startDate;
                if (typeof updates.address === 'string') updated.address = updates.address.trim();
                if (typeof updates.notes === 'string') updated.notes = updates.notes.trim();
                if (typeof updates.label === 'string') updated.label = updates.label.trim();
                return updated;
            }
            return plan;
        }));
    };

    const toggleRecurringPlanStatus = (planId) => {
        setRecurringPlans(recurringPlans.map(plan => {
            if (plan.id === planId) {
                return { ...plan, status: plan.status === 'active' ? 'paused' : 'active' };
            }
            return plan;
        }));
    };

    const deleteRecurringPlan = (planId) => {
        setRecurringPlans(recurringPlans.filter(plan => plan.id !== planId));
    };

    const getRecurringPlanById = (planId) => {
        return recurringPlans.find(plan => plan.id === planId);
    };

    // Walker management
    const toggleWalkerFavorite = (walkerId) => {
        const numericId = typeof walkerId === 'string' ? parseInt(walkerId, 10) : walkerId;
        setWalkers(prevWalkers =>
            prevWalkers.map(walker =>
                walker.id === numericId
                    ? { ...walker, favorite: !walker.favorite }
                    : walker
            )
        );
    };

    const getWalkerById = (id) => {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return walkers.find(w => w.id === numericId);
    };

    // User profile management
    const updateUserProfile = (updates) => {
        setUserProfile({ ...userProfile, ...updates });
    };

    const value = {
        // Data
        dogs,
        walkerData: walkers,
        walkHistory,
        recurringPlans,
        inboxData,
        chatData,
        paymentData,
        userProfile,
        bookingState,

        // Dog methods
        addDog,
        updateDog,
        deleteDog,
        getDogById,

        // Walk methods
        addWalk,
        getWalkById,

        // Recurring plan methods
        createRecurringPlan,
        updateRecurringPlan,
        toggleRecurringPlanStatus,
        deleteRecurringPlan,
        getRecurringPlanById,

        // Walker methods
        toggleWalkerFavorite,
        getWalkerById,

        // User profile methods
        updateUserProfile,

        // Booking state
        setBookingState
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
