import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Menu, Trash2, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MockInterview.css';
import avatarImage from '../pages/avtar-interviewer.png';

function MockInterview() {
  const [sessionActive, setSessionActive] = useState(false);
  const [mode, setMode] = useState('text');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [recognition, setRecognition] = useState(null);

  
  const isListeningRef = useRef(isListening);
  const modeRef = useRef(mode);
  const sessionActiveRef = useRef(sessionActive);
  const setMessagesRef = useRef(null); 
  const askNextQuestionTimeoutRef = useRef(null); 
  const lastMessageRoleRef = useRef(null); 

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('mockInterviewHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedHistory, setSelectedHistory] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const questions = [
    'Tell me about yourself.',
    'Why do you want this job?',
    'What are your strengths and weaknesses?',
    'Describe a challenging situation you faced.',
    'Where do you see yourself in 5 years?'
  ];

  
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    sessionActiveRef.current = sessionActive;
  }, [sessionActive]);

  useEffect(() => {
    setMessagesRef.current = setMessages;
  }, [setMessages]);

  
  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRoleRef.current = messages[messages.length - 1].role;
    } else {
      lastMessageRoleRef.current = null;
    }
  }, [messages]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';

        let lastTranscript = ''; 

        rec.onresult = (event) => {
          const currentTranscript = event.results[event.results.length - 1][0].transcript;
          console.log("Speech recognition raw result:", currentTranscript);

          
          if (currentTranscript.trim() && currentTranscript !== lastTranscript) {
              lastTranscript = currentTranscript;

              
              setMessagesRef.current(prev => ([...prev, { role: 'user', text: currentTranscript }]));
              console.log("Added user message:", currentTranscript);

             
          }
        };

        rec.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          lastTranscript = ''; 
          
        };

        rec.onend = () => {
          console.log('Recognition ended (continuous mode)');
          if (isListeningRef.current && modeRef.current === 'voice' && sessionActiveRef.current) {
            console.log('Recognition ended unexpectedly. Attempting to restart...');
            try {
              rec.start();
            } catch (e) {
              console.error('Error restarting continuous recognition:', e);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
          lastTranscript = ''; 
        };

        rec.onstart = () => console.log('Recognition started');
        rec.onspeechstart = () => console.log('Speech detected');
        rec.onspeechend = () => console.log('Speech ended');
        rec.onaudiostart = () => console.log('Audio started');
        rec.onaudioend = () => console.log('Audio ended');

        setRecognition(rec);
      } else {
        alert("Your browser doesn't support speech recognition. Please use Chrome or Edge for voice features.");
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      
      if (askNextQuestionTimeoutRef.current) {
        clearTimeout(askNextQuestionTimeoutRef.current);
      }
    };
  }, []);
  

  
  useEffect(() => {
    
    if (lastMessageRoleRef.current === 'user' && mode === 'voice' && sessionActive) {
      console.log('User message detected in voice mode. Scheduling next question...');
      
      if (askNextQuestionTimeoutRef.current) {
        clearTimeout(askNextQuestionTimeoutRef.current);
      }
      
      askNextQuestionTimeoutRef.current = setTimeout(() => {
        askNextQuestion();
      }, 1000); 
    }
  }, [messages, mode, sessionActive]); 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const askNextQuestion = () => {
    const interviewerQuestionCount = messages.filter(m => m.role === 'interviewer').length;
    
    
    if (interviewerQuestionCount >= questions.length && questions.length > 0) {
      console.log("No more questions in the hardcoded list. Ending session or looping.");
      
    }

    const next = questions[interviewerQuestionCount % questions.length];
    
    setCurrentQuestion(next);
    setMessages(prev => ([...prev, { role: 'interviewer', text: next }]));
    console.log("Bot asked:", next); 

    if (mode === 'voice') {
      speak(next);
      if (recognition && sessionActive && !isListening) {
        console.log('Ensuring recognition is active after bot speaks (contingency)...');
        try {
          recognition.start();
          setIsListening(true);
        } catch (e) {
          console.error('Error starting recognition after bot question:', e);
          setIsListening(false);
        }
      }
    }
  };

  const handleStartSession = () => {
    setSessionActive(true);
    setMessages([]);
    setCurrentQuestion('');
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setTimeout(() => {
      askNextQuestion();
      if (mode === 'voice' && recognition && !isListening) {
          try {
              recognition.start();
              setIsListening(true);
              console.log('Recognition started at session initiation.');
          } catch (e) {
              console.error('Error starting recognition at session start:', e);
              setIsListening(false);
          }
      }
    }, 300);
  };

  const handleEndSession = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSessionActive(false);
    setCurrentQuestion('');
    if (messages.length > 0) {
      setHistory(prev => [
        {
          id: Date.now(),
          date: new Date().toLocaleString(),
          transcript: messages,
          mode: mode
        },
        ...prev,
      ]);
    }
    setMessages([]);
  
    if (askNextQuestionTimeoutRef.current) {
      clearTimeout(askNextQuestionTimeoutRef.current);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => ([...prev, { role: 'user', text: inputValue }]));
    setInputValue('');
    
    setTimeout(askNextQuestion, 1000);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      console.log('Stopping recognition via toggle button');
    } else {
      try {
        recognition.start();
        setIsListening(true);
        console.log('Starting recognition via toggle button');
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Mic permission denied or already in use. Please check browser settings.');
        setIsListening(false);
      }
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    localStorage.setItem('mockInterviewHistory', JSON.stringify(history));
  }, [history]);

  const handleDeleteHistory = () => {
    setHistory([]);
    localStorage.removeItem('mockInterviewHistory');
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
  };

  return (
    <div className="mentor-chat-container">
      {sidebarOpen && (
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Interview History</h2>
            <button
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              title="Close Sidebar"
            >
              <X size={16} />
            </button>
          </div>
          {history.length === 0 ? (
            <p className="no-history">No interviews yet</p>
          ) : (
            <div>
              {history.map(item => (
                <div key={item.id} className="chat-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6}}>
                  <div style={{flex: 1, cursor: 'pointer'}} onClick={() => setSelectedHistory(item)}>
                    <h4 style={{marginBottom: 2}}>{item.date}</h4>
                    <p style={{margin: 0, fontSize: 13, color: '#444'}}>
                      {item.transcript[0]?.text?.slice(0, 40) || 'No question'} ({item.mode})
                    </p>
                  </div>
                  <button
                    style={{background: 'none', border: 'none', color: '#111', fontSize: 18, cursor: 'pointer', padding: 2}}
                    title="Delete this interview"
                    onClick={e => { e.stopPropagation(); handleDeleteHistoryItem(item.id); }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chat-main" style={{ width: sidebarOpen ? '80%' : '100%' }}>
        <div className="chat-header">
          <div
            className="left-header-buttons"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {!sidebarOpen && (
              <button
                className="back-btn"
                onClick={toggleSidebar}
                title="Open Sidebar"
              >
                <Menu size={16} />
              </button>
            )}
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} /> Back to dashboard
            </button>
          </div>

          <h3 style={{ flex: 1, textAlign: 'center' }}>🎤 AI Mock Interview</h3>

          <div style={{ width: '150px' }}></div>
        </div>

        {selectedHistory ? (
          <div style={{padding: 32, maxWidth: 700, margin: '0 auto', flexGrow: 1, overflowY: 'auto'}}>
            <button style={{marginBottom: 16, background: '#e0e0e0', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600}} onClick={() => setSelectedHistory(null)}>
              ← Back to Interview
            </button>
            <h3 style={{marginBottom: 16}}>Interview on {selectedHistory.date} ({selectedHistory.mode})</h3>
            <div style={{background: '#f9fafb', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0001'}}>
              {selectedHistory.transcript.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
                  <span style={{
                    display: 'inline-block',
                    background: msg.role === 'user' ? '#e0e7ff' : '#f1f5f9',
                    color: '#222',
                    borderRadius: 8,
                    padding: '8px 14px',
                    maxWidth: '80%',
                    fontWeight: msg.role === 'user' ? 500 : 600,
                    wordWrap: 'break-word'
                  }}>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="interview-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', background: '#f9fafb', minHeight: '0', padding: '40px 0 0 0' }}>
            <div style={{ flex: '0 0 55%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '20px' }}>
              <div className="interview-avatar-wrapper" style={{ width: '100%', position: 'relative', textAlign: 'center' }}>
                <img src={avatarImage} alt="AI Interviewer" className="avatar-photo" />
                {mode === 'voice' && sessionActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    borderRadius: '50%',
                    padding: 10,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    {isListening ? (
                      <div style={{color: '#ef4444', animation: 'pulse 1.5s infinite'}}>
                        <Mic size={32} />
                      </div>
                    ) : (
                      <MicOff size={32} color="#666" />
                    )}
                  </div>
                )}
              </div>
              <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button
                    onClick={handleStartSession}
                    disabled={sessionActive}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: sessionActive ? '#d1fae5' : '#b6f2c5',
                      color: sessionActive ? '#065f46' : '#166534',
                      fontWeight: 600,
                      cursor: sessionActive ? 'not-allowed' : 'pointer',
                      opacity: sessionActive ? 0.7 : 1
                    }}
                  >
                    Start Session
                  </button>
                  <button
                    onClick={handleEndSession}
                    disabled={!sessionActive}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: !sessionActive ? '#fee2e2' : '#ffd6d6',
                      color: !sessionActive ? '#991b1b' : '#b91c1c',
                      fontWeight: 600,
                      cursor: !sessionActive ? 'not-allowed' : 'pointer',
                      opacity: !sessionActive ? 0.7 : 1
                    }}
                  >
                    End Session
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => setMode('text')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: mode === 'text' ? '#2a57e8' : '#e0e0e0',
                      color: mode === 'text' ? '#fff' : '#222',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: mode === 'text' ? '0 0 0 2px #2a57e855' : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s'
                    }}
                  >
                    Text Mode
                  </button>
                  <button
                    onClick={() => setMode('voice')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: mode === 'voice' ? '#2a57e8' : '#e0e0e0',
                      color: mode === 'voice' ? '#fff' : '#222',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: mode === 'voice' ? '0 0 0 2px #2a57e855' : 'none',
                      transition: 'background 0.2s, box-shadow 0.2s'
                    }}
                  >
                    Voice Mode
                  </button>
                </div>
              </div>
            </div>

            <div className="interview-chat-area" style={{
              flex: '1 1 0',
              maxWidth: 600,
              marginLeft: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 'calc(100vh - 120px)',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                flex: 1,
                overflowY: 'auto',
                padding: '16px'
              }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
                    <span style={{
                      display: 'inline-block',
                      background: msg.role === 'user' ? '#e0e7ff' : '#f1f5f9',
                      color: '#222',
                      borderRadius: 8,
                      padding: '8px 14px',
                      maxWidth: '80%',
                      fontWeight: msg.role === 'user' ? 500 : 600,
                      wordWrap: 'break-word'
                    }}>
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {sessionActive && mode === 'text' && (
                <div className="text-mode-input" style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '16px',
                  borderTop: '1px solid #eee',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <input
                    type="text"
                    placeholder="Type your response..."
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <button
                    style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#2a57e8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    Send
                  </button>
                </div>
              )}
              {sessionActive && mode === 'voice' && (
                <div className="voice-mode-input" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px',
                  borderTop: '1px solid #eee',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <button
                    onClick={toggleListening}
                    style={{
                      background: isListening ? '#ef4444' : '#2a57e8',
                      border: 'none',
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 28,
                      cursor: 'pointer',
                      marginBottom: 8,
                      boxShadow: isListening ? '0 0 0 8px rgba(239, 68, 68, 0.2)' : '0 0 0 0 rgba(42, 87, 232, 0.2)',
                      transition: 'background 0.3s, box-shadow 0.3s'
                    }}
                    title={isListening ? 'Stop listening' : 'Start speaking'}
                  >
                    {isListening ? (
                      <div style={{animation: 'pulse 1.5s infinite'}}>
                        <Mic size={24} />
                      </div>
                    ) : (
                      <Mic size={24} />
                    )}
                  </button>
                  <span style={{ color: '#555', fontSize: 15, textAlign: 'center' }}>
                    {isListening ? 'Listening... Speak now' : 'Mic is off. Press to speak.'}
                  </span>
                  {!window.SpeechRecognition && !window.webkitSpeechRecognition && (
                    <p style={{ color: 'red', marginTop: 8 }}>
                      Voice recognition not supported in your browser. Try Chrome or Edge.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;