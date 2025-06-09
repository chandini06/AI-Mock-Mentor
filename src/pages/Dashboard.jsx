// src/pages/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { MessageSquare, UserCheck, BrainCog, Settings } from 'lucide-react';

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* TOP NAVBAR STYLE HEADER */}
      <header className="dashboard-navbar">
        <div className="logo-section">
          <BrainCog size={24} className="logo-icon" />
          <span className="app-name">AI Mentor</span>
        </div>
        <div className="user-section">
          
          <button className="settings-btn">
            <Settings size={18} /> <span>Settings</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Welcome Back 👋</h2>
        <p>Select a mode to continue</p>

        <div className="mode-options">
          <div className="mode-card mentor">
            <div className="card-header">
              <MessageSquare className="icon" size={22} />
              <h3>Mock Mentor Chat</h3>
            </div>
            <p>Get personalized career guidance and advice from your AI mentor</p>
            <p className="label-title">Popular Topics:</p>
            <div className="labels">
              <span className="label blue">Career Growth</span>
              <span className="label green">Skill Development</span>
              <span className="label purple">Leadership</span>
            </div>
            <Link to="/mentor" className="primary-btn">Start Mentoring Session</Link>
          </div>

          <div className="mode-card interview">
            <div className="card-header">
              <UserCheck className="icon" size={22} />
              <h3>Mock Interview</h3>
            </div>
            <p>Practice interviews with realistic scenarios and get instant feedback</p>
            <p className="label-title">Interview Types:</p>
            <div className="labels">
              <span className="label green">Technical</span>
              <span className="label orange">Behavioral</span>
              <span className="label red">Case Study</span>
            </div>
            <Link to="/interview" className="secondary-btn">Start Interview Practice</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
