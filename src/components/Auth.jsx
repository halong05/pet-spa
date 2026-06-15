import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  // Modes: 'LOGIN', 'REGISTER', 'OTP'
  const [authMode, setAuthMode] = useState('LOGIN');
  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // OTP state
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (authMode === 'LOGIN') {
      if (!phone || !password) return alert("Vui lòng điền đầy đủ thông tin!");
      
      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      let user = users.find(u => u.phone === phone && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        alert("Sai số điện thoại hoặc mật khẩu!");
      }
    } else if (authMode === 'REGISTER') {
      if (!phone || !password || !name || !email) return alert("Vui lòng điền đầy đủ thông tin (Bao gồm Email)!");
      
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (phone !== 'admin' && !phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0 hoặc 84).");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Email không hợp lệ! Vui lòng kiểm tra lại.");
        return;
      }

      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      if (users.find(u => u.phone === phone)) {
        alert("Số điện thoại đã tồn tại!");
        return;
      }
      
      // Chuyển sang màn OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setAuthMode('OTP');
      
      // Giả lập gửi SMS
      setTimeout(() => {
        alert(`[PetSpa] Mã xác thực (OTP) của bạn là: ${newOtp}\nVui lòng không chia sẻ mã này cho bất kỳ ai.`);
      }, 500);

    } else if (authMode === 'OTP') {
      if (inputOtp !== generatedOtp) {
        alert("Mã xác thực không chính xác. Vui lòng thử lại!");
        return;
      }

      // Đăng ký thành công
      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      const newUser = { 
        id: Date.now().toString(), // Khớp DB: user_id
        name, // Khớp DB: full_name
        phone, // Khớp DB: phone_number
        email, 
        password, // Khớp DB: password_hash
        createdAt: new Date().toISOString() // Khớp DB: created_at
      };
      users.push(newUser);
      localStorage.setItem('spa_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem 0' }}>
          {authMode === 'LOGIN' ? 'Đăng Nhập' : authMode === 'REGISTER' ? 'Đăng Ký' : 'Xác Thực Tài Khoản'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {authMode === 'OTP' ? (
            <div className="fade-in">
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến số điện thoại <strong>{phone}</strong>.
              </p>
              <div>
                <label style={{ fontWeight: 500, textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>Nhập mã OTP</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="------" 
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
                  value={inputOtp} 
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))} 
                  required
                />
              </div>
            </div>
          ) : (
            <div className="fade-in">
              {authMode === 'REGISTER' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Họ và tên</label>
                    <input type="text" className="input-field" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input type="email" className="input-field" placeholder="nguyenvana@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Số điện thoại</label>
                <input type="tel" className="input-field" placeholder="09xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="username tel" required />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Mật khẩu</label>
                <input type="password" className="input-field" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={authMode === 'LOGIN' ? "current-password" : "new-password"} required />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            {authMode === 'LOGIN' ? 'Đăng Nhập' : authMode === 'REGISTER' ? 'Tiếp tục' : 'Xác nhận Đăng ký'}
          </button>
        </form>

        {authMode !== 'OTP' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            {authMode === 'LOGIN' ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}>
              {authMode === 'LOGIN' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </span>
          </div>
        )}

        {authMode === 'OTP' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAuthMode('REGISTER')}>
              ← Quay lại chỉnh sửa thông tin
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
