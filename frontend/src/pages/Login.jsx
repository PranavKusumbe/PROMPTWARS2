import React from 'react';
import { Vote } from 'lucide-react';

const Login = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-full" style={{ minHeight: '80vh' }}>
      <div className="card glass-panel flex-col items-center justify-center text-center animate-fade-in" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem' }}>
        <Vote size={64} color="#4F46E5" className="mb-4" />
        <h1 className="mb-2 text-gradient" style={{ fontSize: '2rem' }}>Election Assistant</h1>
        <p className="text-muted mb-4">Your intelligent guide to understanding and participating in the democratic process.</p>
        
        <button onClick={onLogin} className="btn btn-primary w-full" style={{ fontSize: '1.1rem', padding: '1rem' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
          Sign in with Google
        </button>
        
        <div className="mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
          Secure authentication powered by Firebase
        </div>
      </div>
    </div>
  );
};

export default Login;
