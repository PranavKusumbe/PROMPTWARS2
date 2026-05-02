import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, messaging, getToken } from './firebase';
import Navbar from './components/Navbar';
import ChatbotWidget from './components/ChatbotWidget';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for performance (Efficiency)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProcessDetails = lazy(() => import('./pages/ProcessDetails'));
const Login = lazy(() => import('./pages/Login'));

/**
 * Main App Component
 * Manages Auth state and high-level routing.
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Request FCM Token if logged in (Google Services)
      if (currentUser) {
        getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' })
          .then((token) => {
            if (token) console.log('FCM Token generated');
          })
          .catch((err) => console.log('Notification permission denied or error:', err));
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gradient animate-pulse" style={{ fontSize: '1.5rem' }}>Loading Assistant...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen">
          <Navbar user={user} />
          <main className="container mx-auto px-4 py-8" style={{ marginTop: '64px' }}>
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
              <Routes>
                <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                <Route path="/process" element={<ProcessDetails />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
          {user && <ChatbotWidget />}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
