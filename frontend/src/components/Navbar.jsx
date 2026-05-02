import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, LogOut, Info, Home } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  if (!user) return null;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }} className="flex items-center gap-2">
          <Vote className="text-primary" size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Election<span className="text-gradient">Assistant</span></span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/" style={{ color: location.pathname === '/' ? '#4F46E5' : '#F8FAFC', textDecoration: 'none' }} className="flex items-center gap-2">
            <Home size={20} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/process" style={{ color: location.pathname === '/process' ? '#4F46E5' : '#F8FAFC', textDecoration: 'none' }} className="flex items-center gap-2">
            <Info size={20} />
            <span className="hidden sm:inline">Process Guide</span>
          </Link>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }}></div>
          
          <div className="flex items-center gap-2">
            <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
