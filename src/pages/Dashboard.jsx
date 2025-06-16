import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { MessageSquare, UserCheck, Clock } from 'lucide-react'; // Removed BrainCog, Settings, Users2 as they'll be in TopNav or specific sections
import TopNav from '../components/TopNav'; // Assuming TopNav is in a 'components' folder

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        // Replace '/api/stats' with your actual backend API URL
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Helper to show loading, error, or the stat value
  const renderStat = (value) => {
    if (loading) return '...';
    if (error) return '–';
    if (value === undefined || value === null) return '–';
    return value;
  };

  return (
    <div className="dashboard-wrapper">
      {/* Use the reusable TopNav component */}
      <TopNav /> 

      <div className="dashboard-stats">
        <div className="stat-card">
          <p>Total Chats</p>
          <div className="stat-content">
            <h3>{renderStat(stats?.totalChats)}</h3>
            <MessageSquare className="stat-icon" color="#3366ff" />
          </div>
        </div>
        <div className="stat-card">
          <p>Mock Interviews</p>
          <div className="stat-content">
            <h3>{renderStat(stats?.mockInterviews)}</h3>
            {/* Using a different icon for mock interviews now that UserCheck is for Account */}
            <UserCheck className="stat-icon" color="#28a745" /> 
          </div>
        </div>
        <div className="stat-card">
          <p>Hours Mentored</p>
          <div className="stat-content">
            <h3>{renderStat(stats?.hoursMentored)}</h3>
            <Clock className="stat-icon" color="#9b2cf3" />
          </div>
        </div>
      </div>

      <main className="dashboard-main">
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
              <UserCheck className="icon" size={22} /> {/* Reused UserCheck for interview card icon */}
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