// src/components/AuthNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCog } from 'lucide-react';
import './TopNav.css';

function AuthNav() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isSignup = location.pathname === '/signup';

  return (
    <header className="dashboard-navbar">
      <div className="logo-section">
        <BrainCog size={24} className="logo-icon" />
        <span className="app-name">AI Mentor</span>
      </div>

      <div className="auth-buttons">
        <Link
          to="/login"
          className={`auth-btn ${isLogin ? 'active-btn' : 'inactive-btn'}`}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className={`auth-btn ${isSignup ? 'active-btn' : 'inactive-btn'}`}
        >
          Signup
        </Link>
      </div>
    </header>
  );
}

export default AuthNav;
