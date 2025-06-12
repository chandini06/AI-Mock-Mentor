import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCog } from 'lucide-react';
import './TopNav.css';

function TopNav({ isAuthPage = false }) {
 
  const location = useLocation();

  return (
    <header className="dashboard-navbar">
      <div className="logo-section">
        <BrainCog size={24} className="logo-icon" />
        <span className="app-name">AI Mentor</span>
      </div>
      <div className="user-section">
        {isAuthPage ? (
          <>
            <Link 
              to="/login" 
              className={`nav-btn ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`nav-btn ${location.pathname === '/signup' ? 'active' : ''}`}
            >
              Signup
            </Link>
          </>
        ) : (
          <button className="settings-btn">
            Settings
          </button>
        )}
      </div>
    </header>
  );
}

export default TopNav;
