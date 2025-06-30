import React, { useState, useEffect } from 'react';
import './BotManagement.css';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_PRESETS_KEY = 'mentor_presets';

function BotManagement() {
  const navigate = useNavigate();

  const [bots, setBots] = useState([]);
  const [newBot, setNewBot] = useState({ name: '', type: 'Mentor', prompt: '' });

  useEffect(() => {
    const savedBots = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRESETS_KEY) || '[]');
    setBots(savedBots);
  }, []);

  
  const updateLocalStorage = (updatedBots) => {
    localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(updatedBots));
  };

  const handleAddBot = () => {
    if (!newBot.name.trim() || !newBot.prompt.trim()) return;

    const updatedBots = [
      ...bots,
      { ...newBot, id: Date.now() },
    ];

    setBots(updatedBots);
    updateLocalStorage(updatedBots);
    setNewBot({ name: '', type: 'Mentor', prompt: '' });
  };

  const handleDeleteBot = (id) => {
    const updatedBots = bots.filter(bot => bot.id !== id);
    setBots(updatedBots);
    updateLocalStorage(updatedBots);
  };

  return (
    <div className="bot-management-container">
      <div className="top-bar">
        <h2>Bot Management</h2>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>

      <div className="bot-form">
        <input
          type="text"
          placeholder="Bot Name"
          value={newBot.name}
          onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
        />
        <select
          value={newBot.type}
          onChange={(e) => setNewBot({ ...newBot, type: e.target.value })}
        >
          <option value="Mentor">Mentor</option>
          <option value="Interview">Interview</option>
        </select>
        <textarea
          placeholder="Bot Prompt/Instructions"
          value={newBot.prompt}
          onChange={(e) => setNewBot({ ...newBot, prompt: e.target.value })}
        ></textarea>
        <button className="add-btn" onClick={handleAddBot}>Add Bot</button>
      </div>

      <div className="bot-list">
        {bots.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>No bots added yet.</p>
        ) : (
          bots.map((bot) => (
            <div key={bot.id} className="bot-card">
              <h4>{bot.name} <span>({bot.type})</span></h4>
              <p>{bot.prompt}</p>
              <button className="delete-btn" onClick={() => handleDeleteBot(bot.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BotManagement;
