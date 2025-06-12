import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, X, Menu } from 'lucide-react';
import './MentorChat.css';

const LOCAL_STORAGE_HISTORY_KEY = 'mentor_chat_history';
const LOCAL_STORAGE_CURRENT_CHAT_KEY = 'mentor_current_chat_id';

const MentorChat = () => {
  const navigate = useNavigate();

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    const storedCurrentChatId = localStorage.getItem(LOCAL_STORAGE_CURRENT_CHAT_KEY);

    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setChatHistory(parsedHistory);
      if (storedCurrentChatId && parsedHistory.find(chat => chat.id === Number(storedCurrentChatId))) {
        setCurrentChatId(Number(storedCurrentChatId));
        const foundChat = parsedHistory.find(chat => chat.id === Number(storedCurrentChatId));
        setMessages(foundChat.messages || []);
      } else if (parsedHistory.length > 0) {
        const lastChat = parsedHistory[parsedHistory.length - 1];
        setCurrentChatId(lastChat.id);
        setMessages(lastChat.messages || []);
      }
    }
  }, []);

  useEffect(() => {
    if (currentChatId === null) return;
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(chatHistory));
    localStorage.setItem(LOCAL_STORAGE_CURRENT_CHAT_KEY, currentChatId.toString());
  }, [chatHistory, currentChatId]);

  const createNewChat = () => {
    const newId = Date.now();
    const newChat = {
      id: newId,
      title: 'New Chat',
      preview: '',
      time: new Date().toLocaleTimeString(),
      messages: [],
    };

    const updatedHistory = [...chatHistory, newChat];
    setChatHistory(updatedHistory);
    setCurrentChatId(newId);
    setMessages([]);
    setInput('');
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
    localStorage.setItem(LOCAL_STORAGE_CURRENT_CHAT_KEY, newId.toString());
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

      let updatedHistory;
      if (!currentChatId) {
        const newId = Date.now();
        const newChat = {
          id: newId,
          title: 'New Chat',
          preview: userMessage.text.substring(0, 40),
          time: new Date().toLocaleTimeString(),
          messages: finalMessages,
        };
        updatedHistory = [...chatHistory, newChat];
        setCurrentChatId(newId);
      } else {
        updatedHistory = chatHistory.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              preview: userMessage.text.substring(0, 40),
              time: new Date().toLocaleTimeString(),
              messages: finalMessages,
            };
          }
          return chat;
        });
      }

      setChatHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      localStorage.setItem(LOCAL_STORAGE_CURRENT_CHAT_KEY, currentChatId?.toString() || Date.now().toString());
    }, 1000);
  };

  const handleDeleteChat = (id) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));

    if (id === currentChatId) {
      if (updatedHistory.length > 0) {
        const lastChat = updatedHistory[updatedHistory.length - 1];
        setCurrentChatId(lastChat.id);
        setMessages(lastChat.messages || []);
        localStorage.setItem(LOCAL_STORAGE_CURRENT_CHAT_KEY, lastChat.id.toString());
      } else {
        setCurrentChatId(null);
        setMessages([]);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_CHAT_KEY);
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
                  title="Delete chat"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="chat-main" style={{ width: sidebarOpen ? '80%' : '100%', backgroundImage: "url('/avatars-bg.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
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
          <button className="send-btn" onClick={handleSend} title="Send">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
