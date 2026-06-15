import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const loadMessages = () => {
    if (!currentUser) return;
    const allChats = JSON.parse(localStorage.getItem('spa_chats') || '[]');
    const myChats = allChats.filter(c => c.userId === currentUser.id);
    setMessages(myChats);
  };

  useEffect(() => {
    loadMessages();
    const handleStorage = (e) => {
      if (e.key === 'spa_chats') {
        loadMessages();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const allChats = JSON.parse(localStorage.getItem('spa_chats') || '[]');
    const newMsg = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      sender: 'USER',
      text: inputText,
      timestamp: new Date().toISOString()
    };
    
    allChats.push(newMsg);
    localStorage.setItem('spa_chats', JSON.stringify(allChats));
    
    setInputText('');
    loadMessages(); // Update local state immediately
  };

  // Admin không dùng Widget này
  if (!currentUser || currentUser.role === 'ADMIN') return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div 
          className="fade-in"
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', zIndex: 9999, transition: 'transform 0.2s' }}
          onClick={() => setIsOpen(true)}
          title="Chat với bộ phận CSKH"
        >
          <MessageCircle size={32} />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fade-in" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '350px', height: '450px', background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: 'bold' }}>Hỗ trợ khách hàng</span>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2rem' }}>
                Gửi lời chào để bắt đầu trò chuyện với nhân viên tư vấn.
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'USER' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: '1rem', fontSize: '0.95rem', lineHeight: '1.4',
                    background: msg.sender === 'USER' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'USER' ? 'white' : 'var(--text-color)',
                    border: msg.sender === 'ADMIN' ? '1px solid var(--border-color)' : 'none',
                    borderBottomRightRadius: msg.sender === 'USER' ? '0.25rem' : '1rem',
                    borderBottomLeftRadius: msg.sender === 'ADMIN' ? '0.25rem' : '1rem'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '0.75rem', borderTop: '1px solid var(--border-color)', background: 'white' }}>
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem', background: '#f1f5f9', borderRadius: '1.5rem', paddingLeft: '1rem' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem', marginLeft: '0.25rem' }} disabled={!inputText.trim()}>
              <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
