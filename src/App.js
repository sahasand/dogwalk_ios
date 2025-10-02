import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import Dogs from './pages/Dogs';
import DogForm from './pages/DogForm';
import Inbox from './pages/Inbox';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import WalkSummary from './pages/WalkSummary';
import WalkerProfile from './pages/WalkerProfile';
import LiveTracking from './pages/LiveTracking';
import RecurringWalks from './pages/RecurringWalks';
import Payments from './pages/Payments';
import WalkHistory from './pages/WalkHistory';
import HelpSupport from './pages/HelpSupport';
import './styles.css';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [location.pathname]);

  return null;
};

const AppLayout = () => {
  const location = useLocation();

  // Hide bottom nav on full-screen pages
  const hideBottomNav = ['/book', '/live-tracking', '/chat'].some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app-container">
      <main className="main-content">
        <div className="page-content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingFlow />} />
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/dog/new" element={<DogForm />} />
            <Route path="/dog/edit/:id" element={<DogForm />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chat/:walkerId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/walk/:id" element={<WalkSummary />} />
            <Route path="/walker/:id" element={<WalkerProfile />} />
            <Route path="/live-tracking/:id" element={<LiveTracking />} />
            <Route path="/recurring-walks" element={<RecurringWalks />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/walk-history" element={<WalkHistory />} />
            <Route path="/help" element={<HelpSupport />} />
          </Routes>
        </div>
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AppProvider>
  );
}

export default App;
