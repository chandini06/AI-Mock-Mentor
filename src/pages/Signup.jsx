import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import TopNav from '../components/TopNav';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TopNav />

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Start your AI mentoring journey today</p>

          <form>
            <label>Full Name</label>
            <div className="input-icon">
              <User className="icon" size={18} />
              <input type="text" placeholder="Enter your full name" required />
            </div>

            <label>Email</label>
            <div className="input-icon">
              <Mail className="icon" size={18} />
              <input type="email" placeholder="Enter your email" required />
            </div>

            <label>Password</label>
            <div className="input-icon">
              <Lock className="icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                required
              />
              {showPassword ? (
                <EyeOff className="toggle-eye" onClick={() => setShowPassword(false)} size={18} />
              ) : (
                <Eye className="toggle-eye" onClick={() => setShowPassword(true)} size={18} />
              )}
            </div>

            <label>Confirm Password</label>
            <div className="input-icon">
              <Lock className="icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button className="primary-btn">Create Account</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
