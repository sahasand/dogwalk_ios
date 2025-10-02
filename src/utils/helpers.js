import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Vibration helper
export const vibrate = async (duration = 10) => {
    try {
        await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
        // Haptics not supported in web
    }
};

// Toast notification
export const showToast = (message) => {
    if (!message) return;
    const existingToast = document.querySelector('.app-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 2600);
};

// Profile completion calculation
export const calculateProfileCompletion = (profile, fields) => {
    const total = fields.length;
    const filled = fields.reduce((count, field) => {
        const value = profile[field.key];
        return count + (typeof value === 'string' && value.trim() ? 1 : 0);
    }, 0);
    const percentage = total ? Math.round((filled / total) * 100) : 100;
    const missing = fields.filter(field => {
        const value = profile[field.key];
        return !(typeof value === 'string' && value.trim());
    }).map(field => field.label);
    return { percentage, filled, total, missing };
};

// Date formatting
export const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.valueOf())) return dateString;
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

// Time formatting
export const formatTimeDisplay = (timeString = '09:00') => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(Number.isNaN(hours) ? 9 : hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Normalize days for recurring walks
export const normalizeDays = (days = []) => {
    return Array.from(new Set(days.map(day => parseInt(day, 10)).filter(day => day >= 0 && day <= 6))).sort((a, b) => a - b);
};

// Format plan days
export const formatPlanDays = (days = [], dayLabels) => {
    if (!days.length) return 'No days selected';
    return days.map(day => dayLabels[day] || '').filter(Boolean).join(', ');
};

// Generate recurring plan occurrences
export const generatePlanOccurrences = (plan, count = 3, fromDate = new Date()) => {
    if (!plan || !Array.isArray(plan.daysOfWeek) || plan.daysOfWeek.length === 0) return [];
    const occurrences = [];
    const start = plan.startDate ? new Date(`${plan.startDate}T00:00:00`) : new Date();
    start.setHours(0, 0, 0, 0);
    const base = new Date(fromDate);
    base.setHours(0, 0, 0, 0);
    const cursor = base < start ? start : base;

    for (let offset = 0; occurrences.length < count && offset < 365; offset++) {
        const day = new Date(cursor);
        day.setDate(cursor.getDate() + offset);
        if (plan.daysOfWeek.includes(day.getDay()) && day >= start) {
            occurrences.push({
                date: day.toISOString().split('T')[0],
                time: plan.time
            });
        }
    }
    return occurrences;
};
