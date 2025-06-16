import React, { useState, useEffect } from 'react';
import './Account.css';
import { LogOut, Bell, Globe, Edit2 } from 'lucide-react';
import profilePic from './profile-icon.jpeg';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

export default function Account() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [loginActivity, setLoginActivity] = useState([]);

  
  React.useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('loginActivity') || '[]');
    setLoginActivity(activity);
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('userEmail');
    
    window.location.href = '/login';
  };

  return (
    <div className="account-container" style={{ position: 'relative' }}>
      <div className="account-main">
        <button
          className="back-dashboard-btn"
          style={{
            marginBottom: 12,
            alignSelf: 'flex-start',
            background: '#fff',
            color: '#111',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '4px 10px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '13px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
          onClick={() => window.location.href = '/dashboard'}
        >
          ← Back to Dashboard
        </button>
        {}
        <div className="profile-section">
          <div className="profile-header">
            <div>
              <div className="profile-title">Profile</div>
              <div className="profile-desc">Your account information</div>
            </div>
            <button className="edit-btn" onClick={() => setEditing(!editing)}>
              <Edit2 size={18} /> {editing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div className="profile-fields">
            <img src={profilePic} alt="Profile" className="profile-avatar" />
            <div className="profile-inputs">
              <input
                type="text"
                value={name}
                readOnly={!editing}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
              />
              <input
                type="email"
                value={email}
                readOnly
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        
        <div className="settings-section">
          <div className="settings-title">Settings</div>
          <div className="settings-desc">Customize your experience</div>
          <div className="settings-list">
          
            <div className="settings-option">
              <span className="settings-icon"><Bell size={20} /></span>
              <span className="settings-label">Notifications</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(v => !v)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="option-description">Receive app notifications</div>

            
            <div className="settings-option">
              <span className="settings-icon"><Globe size={20} /></span>
              <span className="settings-label">Language</span>
              <select
                className="language-select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="option-description">Choose your language</div>
          </div>
        </div>
      </div>
      <div className="account-side" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
          <div className="profile-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3>Change Password</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                const oldPass = e.target.oldPassword.value;
                const newPass = e.target.newPassword.value;
                const confirmPass = e.target.confirmPassword.value;
                if (newPass !== confirmPass) {
                  alert("New passwords do not match");
                  return;
                }
                alert("Password changed successfully!");
                e.target.reset();
              }}
              className="change-password-form"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <input type="password" name="oldPassword" placeholder="Old Password" required />
              <input type="password" name="newPassword" placeholder="New Password" required />
              <input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
              <button type="submit" className="primary-btn">Change Password</button>
            </form>
          </div>
          
          <div className="profile-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3>Recent Login Activity</h3>
            <ul className="login-activity-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {loginActivity.length === 0 ? (
                <li>No recent activity</li>
              ) : (
                loginActivity.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.date} {item.time}</span> — <span>{item.browser}, {item.os}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}