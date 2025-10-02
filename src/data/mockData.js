// Mock data for the Walkies app
export const dogData = [
    { id: 1, name: 'Buddy', avatar: '🐶', breed: 'Golden Retriever', age: 4, notes: 'Loves fetch, avoids loud noises.', vet: 'Parkside Vet Clinic', allergies: 'None', likes: 'Squeaky toys', dislikes: 'Skateboards' },
    { id: 2, name: 'Lucy', avatar: '🐩', breed: 'Poodle', age: 7, notes: 'A bit shy at first. Prefers quiet streets.', vet: 'Uptown Animals', allergies: 'Chicken', likes: 'Belly rubs', dislikes: 'Loud trucks' },
    { id: 3, name: 'Max', avatar: '🐕', breed: 'German Shepherd', age: 2, notes: 'Very energetic! Needs a long run.', vet: 'Parkside Vet Clinic', allergies: 'None', likes: 'Frisbees', dislikes: 'Mail carriers' },
];

export const walkerData = [
    { id: 1, name: 'Alex Ray', avatar: 'https://placehold.co/100x100/0F766E/0B1120?text=A', verified: true, rating: 4.9, reviews: 124, price: 25, bio: "Hi, I'm Alex! I've been a passionate dog lover my whole life and have 5+ years of professional walking experience. I'm certified in Pet First Aid and can't wait to meet your furry friend!", badges: ["Pet CPR Certified", "5+ Years Exp."], favorite: true },
    { id: 2, name: 'Jordan Lee', avatar: 'https://placehold.co/100x100/14B8A6/0B1120?text=J', verified: true, rating: 4.8, reviews: 98, price: 24, bio: "Jordan is a marathon runner who loves taking high-energy dogs on long adventures. If your pup needs to burn off some steam, I'm your walker.", badges: ["Great with Large Dogs"], favorite: false },
    { id: 3, name: 'Casey Smith', avatar: 'https://placehold.co/100x100/0E7490/0B1120?text=C', verified: false, rating: 4.7, reviews: 75, price: 22, bio: "As a veterinary student, I have a deep understanding of animal care and behavior. I'm especially good with shy or anxious dogs.", badges: ["Experience with Puppies"], favorite: true },
];

export const walkHistoryData = [
    { id: 99, date: '2025-09-16', time: '16:00', duration: 30, walker: walkerData[1], dogs: [dogData[0]], price: 25.00, status: 'In Progress' },
    { id: 1, date: '2025-09-11', walker: walkerData[1], dogs: [dogData[0]], price: 25.00, status: 'Completed', photos: ['https://placehold.co/300x200/0B1120/1DD3B0?text=Buddy+Playing', 'https://placehold.co/300x200/0F766E/0B1120?text=Happy+Pup'], activity: { pee: true, poo: true, water: true }, note: "Buddy had a great time at the park. Full of energy today!" },
    { id: 2, date: '2025-09-09', walker: walkerData[0], dogs: [dogData[0], dogData[1]], price: 40.00, status: 'Completed', photos: [], activity: { pee: true, poo: false, water: true }, note: "Lucy was a little shy but warmed up. Buddy was great as always." },
    { id: 3, date: '2025-09-05', walker: walkerData[2], dogs: [dogData[2]], price: 22.00, status: 'Completed', photos: ['https://placehold.co/300x200/0E7490/0B1120?text=Max+Running'], activity: { pee: true, poo: true, water: false }, note: "Max loved the long run by the lake!" },
];

export const recurringWalkPlans = [
    {
        id: 1,
        label: 'Buddy Morning Crew',
        dogIds: [1],
        walkerId: 1,
        daysOfWeek: [1, 3, 5],
        time: '09:00',
        duration: 30,
        startDate: '2025-09-18',
        address: '123 Bark Ave',
        notes: 'Buddy likes a slow warm up.',
        status: 'active',
        lastConfirmedDate: null
    }
];

export const inboxData = [
    { id: 1, walkerId: 1, lastMessage: "Sounds good, see you then!", unread: false },
    { id: 3, walkerId: 3, lastMessage: "Yes, I can be there a few minutes early.", unread: true },
];

export const chatData = {
    1: [{sender:'walker', text:'Hi Alex, just confirming our walk with Buddy for tomorrow at 4pm!'}, {sender:'user', text:'Yep, looks good!'}, {sender:'walker', text:"Sounds good, see you then!"}],
    3: [{sender:'walker', text:'Hi, just wanted to check if Max has any issues with other dogs at the park.'}, {sender:'user', text:'He is usually very friendly!'}, {sender:'walker', text:"Yes, I can be there a few minutes early."}],
};

export const paymentData = {
    cards: [
        {
            id: 1,
            brand: 'Visa',
            last4: '4242',
            expiry: '12/26',
            name: 'Alex Morgan',
            billingAddress: '123 Bark Ave, Seattle, WA 98101',
            isDefault: true
        }
    ],
    transactions: [
        { date: '2025-09-11', desc: 'Walk with Jordan L.', amount: 25.00 },
        { date: '2025-09-09', desc: 'Walk with Alex R.', amount: 40.00 }
    ]
};

export const userProfile = {
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    phone: '555-123-4567',
    address: '123 Bark Ave, Seattle, WA',
    bio: 'Dog parent to Buddy, Lucy, and Max. Always looking for new adventures for the pack!',
    emergencyContact: '',
    preferredWalkTime: 'Evenings',
    avatar: 'https://placehold.co/160x160/0B1120/1DD3B0?text=A'
};

export const PROFILE_COMPLETION_FIELDS = [
    { key: 'email', label: 'Add your email address' },
    { key: 'phone', label: 'Add a phone number' },
    { key: 'address', label: 'Add your home address' },
    { key: 'bio', label: 'Tell walkers about your dogs' },
    { key: 'emergencyContact', label: 'Add an emergency contact' },
    { key: 'preferredWalkTime', label: 'Share your preferred walk time' }
];

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
