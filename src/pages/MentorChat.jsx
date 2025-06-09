import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, X, Menu } from 'lucide-react';
import './MentorChat.css';

const MentorChat = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI mentor. What would you like to discuss today?",
      time: new Date().toLocaleTimeString(),
      isUser: false,
    },
  ]);

  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      time: new Date().toLocaleTimeString(),
      isUser: true,
    };

    const aiMessage = {
      id: messages.length + 2,
      text: "Thanks for your question! (This is a placeholder reply from AI.)",
      time: new Date().toLocaleTimeString(),
      isUser: false,
    };

    setMessages([...messages, userMessage, aiMessage]);

    if (chatHistory.length === 0) {
      setChatHistory([
        {
          id: 1,
          title: 'New Chat',
          preview: input.substring(0, 40) + (input.length > 40 ? '...' : ''),
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } else {
      setChatHistory([
        {
          ...chatHistory[0],
          preview: input.substring(0, 40) + (input.length > 40 ? '...' : ''),
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setInput('');
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI mentor. What would you like to discuss today?",
        time: new Date().toLocaleTimeString(),
        isUser: false,
      },
    ]);
    setInput('');
    setChatHistory([]);
  };

  const handleDeleteChat = (id) => {
    const updatedHistory = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(updatedHistory);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="mentor-chat-container">
      {sidebarOpen && (
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Chat History</h2>
            <button className="sidebar-toggle-btn" onClick={toggleSidebar} title="Close Sidebar">
              <X size={16} />
            </button>
          </div>
          {chatHistory.length === 0 ? (
            <p className="no-history">No chats yet</p>
          ) : (
            chatHistory.map((chat) => (
              <div className="chat-item" key={chat.id}>
                <div className="chat-item-text">
                  <h4>{chat.title}</h4>
                  <p>{chat.preview}</p>
                  <span>{chat.time}</span>
                </div>
                <button
                  className="delete-btn"
                  title="Delete chat"
                  onClick={() => handleDeleteChat(chat.id)}
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
          <div className="left-header-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!sidebarOpen && (
              <button className="back-btn" onClick={toggleSidebar} title="Open Sidebar">
                <Menu size={16} />
              </button>
            )}
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} /> Back to dashboard
            </button>
          </div>

          <h3>🧠 AI Mentor Chat</h3>

          <div className="right-header-buttons">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={16} /> New Chat
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.isUser ? 'user-message' : 'ai-message'}`}
            >
              {msg.text}
              <div className="chat-time">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend} title="Send">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
