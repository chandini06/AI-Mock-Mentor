import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.css';

function TopNav() {
  const location = useLocation();

  return (
    <div className="top-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Login
      </Link>
      <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
        Sign Up
      </Link>
    </div>
  );
}

export default TopNav;
