import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast } from '../utils/helpers';

const detectCardBrand = (cardNumber = '') => {
    const digits = cardNumber.replace(/\D/g, '');
    if (/^4/.test(digits)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
    if (/^3[47]/.test(digits)) return 'American Express';
    if (/^6(?:011|5)/.test(digits)) return 'Discover';
    return 'Card';
};

const formatMaskedCard = (last4 = '') => {
    return `**** **** **** ${last4}`.trim();
};

const Payments = () => {
    const navigate = useNavigate();
    const { paymentData } = useAppContext();
    const [showAddCard, setShowAddCard] = useState(false);
    const [noticeMessage, setNoticeMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
        billingAddress: '',
        city: '',
        state: '',
        zip: '',
        makeDefault: false
    });

    const cards = paymentData.cards || [];
    const sortedCards = [...cards].sort((a, b) => {
        if (a.isDefault === b.isDefault) return b.id - a.id;
        return a.isDefault ? -1 : 1;
    });

    const handleBack = () => {
        vibrate();
        navigate('/profile');
    };

    const handleShowAddCard = () => {
        vibrate();
        setShowAddCard(true);
        setErrorMessage('');
    };

    const handleCloseAddCard = () => {
        vibrate();
        setShowAddCard(false);
        setFormData({
            cardNumber: '',
            expiry: '',
            cvv: '',
            name: '',
            billingAddress: '',
            city: '',
            state: '',
            zip: '',
            makeDefault: false
        });
        setErrorMessage('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const formatCardNumber = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
        e.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, cardNumber: e.target.value }));
    };

    const formatExpiry = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        e.target.value = value;
        setFormData(prev => ({ ...prev, expiry: e.target.value }));
    };

    const formatCvv = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData(prev => ({ ...prev, cvv: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        vibrate();
        setErrorMessage('');

        const number = formData.cardNumber.replace(/\s+/g, '');
        const { expiry, cvv, name, billingAddress, city, state, zip, makeDefault } = formData;

        // Validation
        if (number.length < 13 || number.length > 19) {
            setErrorMessage('Enter a valid card number.');
            return;
        }
        if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) {
            setErrorMessage('Enter expiry as MM/YY.');
            return;
        }
        if (cvv.length < 3 || cvv.length > 4) {
            setErrorMessage('Enter a valid CVV.');
            return;
        }
        if (!name) {
            setErrorMessage('Enter the cardholder name.');
            return;
        }
        if (!billingAddress || !city || !state || !zip) {
            setErrorMessage('Complete the billing address.');
            return;
        }

        const stateCode = state.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase();
        if (stateCode.length !== 2) {
            setErrorMessage('Use a 2-letter state code.');
            return;
        }

        const postalCode = zip.replace(/\s+/g, '');
        if (postalCode.length < 3) {
            setErrorMessage('Enter a valid ZIP/postal code.');
            return;
        }

        const fullBillingAddress = `${billingAddress}, ${city}, ${stateCode} ${postalCode}`;

        // Create card (in a real app, this would call an API)
        const digits = number.replace(/\D/g, '');
        const newCard = {
            id: Date.now(),
            brand: detectCardBrand(digits),
            last4: digits.slice(-4),
            expiry,
            name,
            billingAddress: fullBillingAddress,
            isDefault: makeDefault || cards.length === 0
        };

        // Update all cards if this is default
        if (newCard.isDefault) {
            cards.forEach(card => { card.isDefault = false; });
        }

        cards.push(newCard);

        handleCloseAddCard();
        setNoticeMessage('New card saved.');
        showToast('Payment method added');
    };

    const handleMakeDefault = (cardId) => {
        vibrate();
        cards.forEach(card => {
            card.isDefault = card.id === cardId;
        });
        setNoticeMessage('Default payment method updated.');
        showToast('Default payment method updated');
    };

    useEffect(() => {
        if (noticeMessage) {
            const timer = setTimeout(() => setNoticeMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [noticeMessage]);

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>Payments</h1>
            </div>
            <div className="space-y-6">
                {noticeMessage && (
                    <div className="glass-card p-4 text-sm bg-[rgba(94,234,212,0.12)] border border-[var(--surface-border-strong)] text-white/80">
                        {noticeMessage}
                    </div>
                )}

                <div id="card-list" className="space-y-4">
                    {sortedCards.length > 0 ? (
                        sortedCards.map(card => (
                            <div key={card.id} className="glass-card p-5 space-y-4" data-card-id={card.id}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="uppercase tracking-[0.2em] text-xs text-soft">{card.brand}</span>
                                            {card.isDefault ? (
                                                <span className="badge-muted">Default</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="px-3 py-1 rounded-full border border-white/20 text-xs text-white/80 hover:border-[var(--surface-border-strong)] transition"
                                                    onClick={() => handleMakeDefault(card.id)}
                                                >
                                                    Make Default
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-2xl font-semibold text-white">{formatMaskedCard(card.last4)}</p>
                                        <div className="text-sm text-soft flex items-center gap-2">
                                            <span>Expiry</span>
                                            <span className="text-white font-medium">{card.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-soft">
                                    <div>
                                        <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-white/60">Cardholder</span>
                                        <p className="text-white font-medium">{card.name}</p>
                                    </div>
                                    <div>
                                        <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-white/60">Billing Address</span>
                                        <p>{card.billingAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card p-5 text-sm text-soft text-center">
                            No payment methods yet. Add a card to get started.
                        </div>
                    )}
                </div>

                {!showAddCard && (
                    <button className="btn btn-secondary w-full" onClick={handleShowAddCard}>
                        Add New Card
                    </button>
                )}

                {showAddCard && (
                    <div className="glass-card p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Add new payment method</h3>
                            <button
                                type="button"
                                className="icon-button"
                                onClick={handleCloseAddCard}
                                aria-label="Close add card form"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="card-number" className="block text-sm font-medium text-white/80">
                                    Card number
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="card-number"
                                        name="cardNumber"
                                        className="input-field"
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        value={formData.cardNumber}
                                        onInput={formatCardNumber}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="card-expiry" className="block text-sm font-medium text-white/80">
                                        Expiry
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="card-expiry"
                                            name="expiry"
                                            className="input-field"
                                            inputMode="numeric"
                                            autoComplete="cc-exp"
                                            placeholder="MM/YY"
                                            required
                                            value={formData.expiry}
                                            onInput={formatExpiry}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="card-cvv" className="block text-sm font-medium text-white/80">
                                        CVV
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="card-cvv"
                                            name="cvv"
                                            className="input-field"
                                            inputMode="numeric"
                                            autoComplete="cc-csc"
                                            placeholder="123"
                                            required
                                            value={formData.cvv}
                                            onInput={formatCvv}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="card-name" className="block text-sm font-medium text-white/80">
                                    Cardholder name
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="card-name"
                                        name="name"
                                        className="input-field"
                                        autoComplete="cc-name"
                                        placeholder="Alex Morgan"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="billing-address" className="block text-sm font-medium text-white/80">
                                    Billing address
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="billing-address"
                                        name="billingAddress"
                                        className="input-field"
                                        autoComplete="cc-address"
                                        placeholder="123 Bark Ave, Seattle, WA"
                                        required
                                        value={formData.billingAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="billing-city" className="block text-sm font-medium text-white/80">
                                        City
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="billing-city"
                                            name="city"
                                            className="input-field"
                                            autoComplete="address-level2"
                                            placeholder="Seattle"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label htmlFor="billing-state" className="block text-sm font-medium text-white/80">
                                            State
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="billing-state"
                                                name="state"
                                                className="input-field"
                                                autoComplete="address-level1"
                                                placeholder="WA"
                                                maxLength="2"
                                                required
                                                value={formData.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="billing-zip" className="block text-sm font-medium text-white/80">
                                            ZIP
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="billing-zip"
                                                name="zip"
                                                className="input-field"
                                                inputMode="numeric"
                                                autoComplete="postal-code"
                                                placeholder="98101"
                                                required
                                                value={formData.zip}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label className="flex items-center gap-3 text-sm text-soft">
                                <input
                                    type="checkbox"
                                    id="make-default-card"
                                    name="makeDefault"
                                    className="h-4 w-4 rounded border border-[var(--surface-border)] bg-transparent"
                                    checked={formData.makeDefault}
                                    onChange={handleChange}
                                />
                                Set as default payment method
                            </label>
                            {errorMessage && (
                                <p className="text-sm text-[#fca5a5]" role="alert">
                                    {errorMessage}
                                </p>
                            )}
                            <div className="flex gap-3">
                                <button type="submit" className="btn btn-primary flex-1">
                                    Save Card
                                </button>
                                <button type="button" className="btn btn-secondary flex-1" onClick={handleCloseAddCard}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-card p-5">
                    <h3 className="font-semibold mb-3">Transaction History</h3>
                    <div className="space-y-2">
                        {paymentData.transactions && paymentData.transactions.length > 0 ? (
                            paymentData.transactions.map((t, index) => (
                                <div key={index} className="flex justify-between text-sm text-soft">
                                    <p>{t.desc}</p>
                                    <p>${t.amount.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-soft">No transactions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
