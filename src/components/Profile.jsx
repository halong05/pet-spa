import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';

export default function Profile({ currentUser }) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    let allUsers = JSON.parse(localStorage.getItem('spa_users') || '[]');
    let user = allUsers.find(u => u.id === currentUser.id);
    if (!user) return;

    if (oldPassword !== user.password) {
       return alert("Mật khẩu cũ không chính xác!");
    }
    if (newPassword.length < 6) {
       return alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }
    
    const updatedUsers = allUsers.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u);
    localStorage.setItem('spa_users', JSON.stringify(updatedUsers));
    
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('spa_current_user', JSON.stringify(updatedUser));
    
    alert("Đổi mật khẩu thành công!");
    setShowEditProfile(false);
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <>
      {/* Profile Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Thông tin cá nhân</h2>
          <button className="btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowEditProfile(true)}>
            <Edit3 size={16} /> Đổi mật khẩu
          </button>
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--primary-light)' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Họ và tên</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentUser.name}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Số điện thoại</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentUser.phone}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentUser.email || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showEditProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card fade-in" style={{ width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mật khẩu hiện tại</label>
                <input type="password" className="input-field" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mật khẩu mới</label>
                <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowEditProfile(false)}>Hủy</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
