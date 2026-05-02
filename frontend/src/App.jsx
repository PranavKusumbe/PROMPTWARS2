import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, googleProvider, messaging } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getToken } from 'firebase/messaging';

// Layout & Components
import Navbar from './components/Navbar';
import ChatbotWidget from './components/ChatbotWidget';

// Lazy loaded pages for efficiency
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProcessDetails = React.lazy(() => import('./pages/ProcessDetails'));
const Login = React.lazy(() => import('./pages/Login'));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Request FCM permission if logged in
      if (currentUser && messaging) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
            console.log('FCM Token received:', token);
          }
        } catch (error) {
          console.log('FCM permission denied or error:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full min-h-screen"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container pt-4 pb-8" style={{ marginTop: '80px' }} role="main">
          <Suspense fallback={<div className="flex justify-center p-8">Loading view...</div>}>
            <Routes>
              <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/process" element={user ? <ProcessDetails /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
        {user && <ChatbotWidget />}
      </div>
    </Router>
  );
}

export default App;
