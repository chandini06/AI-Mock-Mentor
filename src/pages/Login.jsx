import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import TopNav from '../components/TopNav';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TopNav />

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your mentoring journey</p>

          <form>
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
                placeholder="Enter your password"
                required
              />
              {showPassword ? (
                <EyeOff className="toggle-eye" onClick={() => setShowPassword(false)} size={18} />
              ) : (
                <Eye className="toggle-eye" onClick={() => setShowPassword(true)} size={18} />
              )}
            </div>

            <button className="primary-btn">Sign In</button>
            <Link to="#" className="forgot-link">Forgot your password?</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
