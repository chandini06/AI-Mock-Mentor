import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, X, Menu } from 'lucide-react';
import './MentorChat.css';

const LOCAL_STORAGE_HISTORY_KEY = 'mentor_chat_history';
const LOCAL_STORAGE_CURRENT_CHAT_KEY = 'mentor_current_chat_id';
const LOCAL_STORAGE_PRESETS_KEY = 'mentor_presets';

const MentorChat = () => {
  const navigate = useNavigate();

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || '[]');
    const storedCurrentChatId = localStorage.getItem(LOCAL_STORAGE_CURRENT_CHAT_KEY);
    const storedPresets = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRESETS_KEY) || '[]');
const mentorPresets = storedPresets.filter(p => p.type === 'Mentor'); 
setPresets(mentorPresets);


    if (storedHistory.length) {
      setChatHistory(storedHistory);
      const currentId = storedCurrentChatId && storedHistory.find(c => c.id === Number(storedCurrentChatId))
        ? Number(storedCurrentChatId)
        : storedHistory[storedHistory.length - 1].id;

      setCurrentChatId(currentId);
      const selectedChat = storedHistory.find(chat => chat.id === currentId);
      setMessages(selectedChat?.messages || []);
    }
  }, []);

  useEffect(() => {
    if (currentChatId === null) return;
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(chatHistory));
    localStorage.setItem(LOCAL_STORAGE_CURRENT_CHAT_KEY, currentChatId.toString());
  }, [chatHistory, currentChatId]);

  const createNewChat = () => {
    if (!selectedPresetId) {
      alert("Please select a preset before starting a chat.");
      return;
    }

    const selectedPreset = presets.find(p => p.id === Number(selectedPresetId));
    if (!selectedPreset) return;

    const newId = Date.now();
    const starterMessage = {
      id: newId + 1,
      text: selectedPreset.prompt,
      time: new Date().toLocaleTimeString(),
      isUser: false,
    };

    const newChat = {
      id: newId,
      title: selectedPreset.title || selectedPreset.name || 'Untitled Preset',
      preview: selectedPreset.prompt.substring(0, 40),
      time: new Date().toLocaleTimeString(),
      messages: [starterMessage],
    };

    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);
    setCurrentChatId(newId);
    setMessages([starterMessage]);
    setInput('');
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      time: new Date().toLocaleTimeString(),
      isUser: true,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: "Thanks for your question! (This is a placeholder reply from AI.)",
        time: new Date().toLocaleTimeString(),
        isUser: false,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setIsTyping(false);

      const updatedHistory = chatHistory.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              preview: userMessage.text.substring(0, 40),
              time: new Date().toLocaleTimeString(),
              messages: finalMessages,
            }
          : chat
      );

      setChatHistory(updatedHistory);
    }, 1000);
  };

  const handleDeleteChat = (id) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(updatedHistory);

    if (id === currentChatId) {
      if (updatedHistory.length > 0) {
        const lastChat = updatedHistory[updatedHistory.length - 1];
        setCurrentChatId(lastChat.id);
        setMessages(lastChat.messages || []);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const handleSelectChat = (id) => {
    if (id === currentChatId) return;
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages || []);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="mentor-chat-container">
      {sidebarOpen && (
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Chat History</h2>
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}><X size={16} /></button>
          </div>
          {chatHistory.length === 0 ? (
            <p className="no-history">No chats yet</p>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="chat-item-text">
                  <h4>{chat.title}</h4>
                  <p>{chat.preview || 'No messages yet'}</p>
                  <span>{chat.time}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={e => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="chat-main" style={{ width: sidebarOpen ? '80%' : '100%' }}>
        <div className="chat-header">
          <div className="left-header-buttons">
            {!sidebarOpen && (
              <button className="back-btn" onClick={toggleSidebar}><Menu size={16} /></button>
            )}
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} /> Back to dashboard
            </button>
          </div>

          <h3>🧠 AI Mentor Chat</h3>

          <div className="right-header-buttons">
            <select
              value={selectedPresetId}
              onChange={e => setSelectedPresetId(e.target.value)}
              className="preset-dropdown"
            >
              <option value="">Select Preset</option>
              {presets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title || p.name || `Preset ${p.id}`}
                </option>
              ))}
            </select>
            <button className="new-chat-btn" onClick={createNewChat}>
              <Plus size={16} /> New Chat
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble ${msg.isUser ? 'user-message' : 'ai-message'}`}>
              {msg.text}
              <div className="chat-time">{msg.time}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble ai-message typing">...
              <div className="chat-time">typing...</div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
