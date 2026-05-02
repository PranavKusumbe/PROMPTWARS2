import React, { useState } from 'react';
import { Vote, AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

/**
 * Login component providing Google Authentication.
 * Handles loading and error states for improved UX and reliability.
 */
const Login = () => {
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Authentication Error:", err.message);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full" style={{ minHeight: '80vh' }} role="main">
      <div className="card glass-panel flex-col items-center justify-center text-center animate-fade-in" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem' }}>
        <Vote size={64} color="#4F46E5" className="mb-4" aria-hidden="true" />
        <h1 className="mb-2 text-gradient" style={{ fontSize: '2rem' }}>Election Assistant</h1>
        <p className="text-muted mb-6">Your intelligent guide to understanding and participating in the democratic process.</p>
        
        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.875rem' }} role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleLogin} 
          className="btn btn-primary w-full" 
          style={{ fontSize: '1.1rem', padding: '1rem' }}
          disabled={isLoggingIn}
          aria-label="Sign in with Google"
        >
          {isLoggingIn ? (
            <span className="animate-pulse">Signing in...</span>
          ) : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" style={{ width: '24px', height: '24px' }} aria-hidden="true" />
              Sign in with Google
            </>
          )}
        </button>
        
        <div className="mt-6 text-muted" style={{ fontSize: '0.875rem' }}>
          Secure authentication powered by Firebase Google Auth
        </div>
      </div>
    </div>
  );
};

export default Login;
