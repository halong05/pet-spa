import React, { useState, useEffect } from 'react';
import { Scissors, User, ShieldCheck, Bell, CheckCircle } from 'lucide-react';

export default function Header({ currentView, navigate, currentUser, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'ADMIN') return;
    
    const checkNotifs = () => {
      const allNotifs = JSON.parse(localStorage.getItem('spa_notifications') || '[]');
      const myNotifs = allNotifs.filter(n => n.userId === currentUser.id).reverse();
      setNotifications(myNotifs);
    };

    checkNotifs();
    const interval = setInterval(checkNotifs, 3000); // Auto refresh
    return () => clearInterval(interval);
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      let allNotifs = JSON.parse(localStorage.getItem('spa_notifications') || '[]');
      allNotifs = allNotifs.map(n => n.userId === currentUser.id ? { ...n, read: true } : n);
      localStorage.setItem('spa_notifications', JSON.stringify(allNotifs));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className="header-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <Scissors size={24} color="var(--primary)" />
          <span>PetSpa Pro</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }} className="desktop-only-nav">
          <a 
            className={currentView === 'home' ? 'active' : ''} 
            onClick={() => navigate('home')}
            style={{ cursor: 'pointer', color: currentView === 'home' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Trang chủ
          </a>
          
          {currentUser?.role !== 'ADMIN' && (
            <a 
              className={currentView === 'booking' ? 'active' : ''} 
              onClick={() => navigate('booking')}
              style={{ cursor: 'pointer', color: currentView === 'booking' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              Đặt lịch
            </a>
          )}

          {currentUser?.role === 'ADMIN' && (
            <a 
              className={currentView === 'admin' ? 'active' : ''} 
              onClick={() => navigate('admin')}
              style={{ cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}
            >
              Cổng Quản Trị
            </a>
          )}
        </nav>
      </div>
      
      <nav className="header-nav">
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Notification Bell */}
            {currentUser.role !== 'ADMIN' && (
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <div onClick={handleBellClick} style={{ position: 'relative', padding: '0.5rem' }}>
                  <Bell size={20} color="var(--text-color)" />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>

                {showDropdown && (
                  <div className="card fade-in" style={{ position: 'absolute', top: '100%', right: '-50px', width: '320px', padding: '0', zIndex: 1000, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                      Thông báo
                      {unreadCount > 0 && <span style={{ color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer' }} onClick={handleBellClick}>Đánh dấu đã đọc</span>}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bạn chưa có thông báo nào.</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: n.read ? 'white' : '#f0fdf4', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--primary)', marginTop: '0.2rem' }}><CheckCircle size={16} /></div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.4 }}>{n.message}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleTimeString('vi-VN')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: currentUser.role === 'ADMIN' ? '#ef4444' : 'var(--primary-dark)', fontWeight: 600, borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}
              onClick={() => currentUser.role === 'ADMIN' ? navigate('admin') : navigate('dashboard')}
            >
              {currentUser.role === 'ADMIN' ? <ShieldCheck size={20} /> : <User size={20} />}
              <span style={{ textTransform: 'capitalize' }}>{currentUser.name}</span>
            </div>
            <button className="btn-ghost" onClick={onLogout}>Đăng xuất</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => navigate('login')}>
            Đăng nhập
          </button>
        )}
      </nav>
      </div>
    </header>
  );
}
