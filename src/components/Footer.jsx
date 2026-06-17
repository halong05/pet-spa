import React from 'react';
import { Scissors, MapPin, Phone, Mail, Facebook, Instagram, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1e293b', color: '#f8fafc', padding: '4rem 2rem 2rem 2rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        
        {/* Cột 1: Thông tin công ty */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Scissors size={28} />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>PetSpa Pro</h2>
          </div>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Hệ thống chăm sóc thú cưng chuẩn y khoa hàng đầu Việt Nam. Mang lại vẻ đẹp và sức khỏe tốt nhất cho những người bạn bốn chân.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.9rem' }}>123 Cầu Giấy, Q. Cầu Giấy, Hà Nội</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem' }}>Hotline: 1900 1234 (8:00 - 20:00)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem' }}>contact@petspapro.vn</span>
            </div>
          </div>
        </div>

        {/* Cột 2: Chính sách & Dịch vụ */}
        <div>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: 'white' }}>Chính Sách & Quy Định</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> Chính sách bảo mật</a></li>
            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HeartHandshake size={16} /> Chính sách đền bù & hoàn tiền</a></li>
            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Quy định chung khi sử dụng dịch vụ</a></li>
            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Câu hỏi thường gặp (FAQ)</a></li>
          </ul>
        </div>

        {/* Cột 3: Kết nối với chúng tôi */}
        <div>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: 'white' }}>Kết Nối Với Chúng Tôi</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Theo dõi PetSpa Pro trên mạng xã hội để cập nhật những kiến thức chăm sóc thú cưng hữu ích và hình ảnh đáng yêu của các bé mỗi ngày!
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1877f2'} onMouseOut={e => e.currentTarget.style.background = '#334155'}>
              <Facebook size={20} />
            </a>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#e1306c'} onMouseOut={e => e.currentTarget.style.background = '#334155'}>
              <Instagram size={20} />
            </a>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s', textDecoration: 'none', fontWeight: 'bold' }} onMouseOver={e => e.currentTarget.style.background = '#000'} onMouseOut={e => e.currentTarget.style.background = '#334155'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>

      </div>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>© 2026 PetSpa Pro - Hệ thống chăm sóc thú cưng. All rights reserved.</p>
        <p style={{ margin: 0 }}>Giấy ĐKKD số: 0123456789 do Sở KH&ĐT TP.Hà Nội cấp ngày 01/01/2026.</p>
      </div>
    </footer>
  );
}
