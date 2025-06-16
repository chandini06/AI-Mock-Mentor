import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import AuthNav from '../components/AuthNav';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    localStorage.setItem('userEmail', email);

    // Log login activity (always add on login)
    const activity = JSON.parse(localStorage.getItem('loginActivity') || '[]');
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const browser = navigator.userAgent.match(/(Chrome|Firefox|Edge|Safari)/)?.[0] || 'Unknown';
    const os = navigator.userAgent.match(/Windows|Mac|Linux|Android|iOS/)?.[0] || 'Unknown';
    activity.unshift({ date, time, browser, os });
    localStorage.setItem('loginActivity', JSON.stringify(activity.slice(0, 3)));

    navigate('/dashboard');
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successful");
    setIsResetMode(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <AuthNav />

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>{isResetMode ? 'Reset Password' : 'Welcome Back'}</h2>
          <p>{isResetMode ? 'Enter your new password below' : 'Sign in to continue your mentoring journey'}</p>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <div className="input-icon">
              <Mail className="icon" size={18} />
              <input type="email" placeholder="Enter your email" required />
            </div>

            {!isResetMode ? (
              <>
                <label>Password</label>
                <div className="input-icon">
                  <Lock className="icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                  />
                  {showPassword ? (
                    <EyeOff className="toggle-eye" onClick={() => setShowPassword(false)} size={18} />
                  ) : (
                    <Eye className="toggle-eye" onClick={() => setShowPassword(true)} size={18} />
                  )}
                </div>
              </>
            ) : (
              <>
                <label>New Password</label>
                <div className="input-icon">
                  <Lock className="icon" size={18} />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <label>Confirm Password</label>
                <div className="input-icon">
                  <Lock className="icon" size={18} />
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {!isResetMode ? (
              <button type="submit" className="primary-btn">Sign In</button>
            ) : (
              <button
                type="button"
                className="primary-btn"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            )}

            {/* Forgot Password Button (centered, borderless) */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setIsResetMode(!isResetMode)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  padding: 0,
                }}
              >
                {isResetMode ? 'Back to Login' : 'Forgot your password?'}
              </button>
            </div>

            {!isResetMode && (
              <Link to="/signup" className="switch-link">
                Don’t have an account? <span>Create one</span>
              </Link>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
