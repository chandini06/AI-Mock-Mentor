import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
  const [userStats, setUserStats] = useState([]);
  const [botStats, setBotStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mentorChats = JSON.parse(localStorage.getItem('mentor_chat_history')) || [];
    const interviews = JSON.parse(localStorage.getItem('interview_history')) || [];

    const userUsageMap = {};

    mentorChats.forEach(chat => {
      const id = chat.userId || 'Unknown';
      if (!userUsageMap[id]) userUsageMap[id] = { mentor: 0, interview: 0 };
      userUsageMap[id].mentor += 1;
    });

    interviews.forEach(int => {
      const id = int.userId || 'Unknown';
      if (!userUsageMap[id]) userUsageMap[id] = { mentor: 0, interview: 0 };
      userUsageMap[id].interview += 1;
    });

    const formattedStats = Object.entries(userUsageMap).map(([userId, data]) => ({
      userId,
      mentor: data.mentor,
      interview: data.interview,
    }));

    setUserStats(formattedStats);

    // --- Bot Stats ---
    const currentStats = JSON.parse(localStorage.getItem('bot_stats')) || {
      totalBots: 2, // default for now
      activeBots: 2,
      inactiveBots: 0,
      totalResponses: 0
    };
    setBotStats(currentStats);

    // --- Logs ---
    const storedLogs = JSON.parse(localStorage.getItem('system_logs')) || [];
    setLogs(storedLogs);
  }, []);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2 className="reports-title">📊 Reports & Logs</h2>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="section-card usage-card">
        <h3 className="section-title">👥 User AI Usage</h3>
        {userStats.length > 0 ? (
          <table className="usage-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Mentor AI Uses</th>
                <th>Interview AI Uses</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.mentor}</td>
                  <td>{user.interview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-msg">No user usage data available.</p>
        )}
      </div>

      <div className="double-section">
        <div className="section-card">
          <h3 className="section-title">🤖 Bot Stats</h3>
          {botStats ? (
            <ul className="bot-list">
              <li>Total Bots: <span>{botStats.totalBots}</span></li>
              <li>Active Bots: <span>{botStats.activeBots}</span></li>
              <li>Inactive Bots: <span>{botStats.inactiveBots}</span></li>
              <li>Total Responses: <span>{botStats.totalResponses}</span></li>
            </ul>
          ) : (
            <p className="empty-msg">No bot stats available</p>
          )}
        </div>

        <div className="section-card">
          <h3 className="section-title">📋 System Logs</h3>
          {logs.length > 0 ? (
            <ul className="log-list">
              {logs.map(log => (
                <li key={log.id}>
                  <span className={log.type === 'Error' ? 'text-error' : 'text-info'}>
                    {log.type}
                  </span>: {log.message}
                  <span className="log-time">{log.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-msg">No logs yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
