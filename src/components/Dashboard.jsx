import React, { useState, useEffect } from 'react';
import PetForm from './PetForm';
import { Star, Clock, MapPin, CheckCircle, PlayCircle, Edit3 } from 'lucide-react';

export default function Dashboard({ currentUser, navigate }) {
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // Lưu thông tin thú cưng đang sửa
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userPoints, setUserPoints] = useState(currentUser.points || 0);
  
  // Reschedule State
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const timeSlots = ['08:00', '09:00', '10:00', '13:30', '14:30', '15:30', '16:30'];

  const [hasPromptedNewPet, setHasPromptedNewPet] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = () => {
    try {
      const allPets = JSON.parse(localStorage.getItem('spa_pets') || '[]');
      // NFR & Business Rule: Hiển thị hồ sơ thú cưng từ MỚI NHẤT đến CŨ NHẤT (reverse)
      const userPets = allPets.filter(p => p.ownerId === currentUser.id).reverse();
      setPets(userPets);

      // Auto-popup if 0 pets (dựa theo Activity Diagram)
      if (userPets.length === 0 && !hasPromptedNewPet) {
        setShowAddPet(true);
        setHasPromptedNewPet(true);
      }

      const allBookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
      setBookings(allBookings.filter(b => b.userId === currentUser.id).sort((a, b) => b.id - a.id));

      // Lấy điểm mới nhất
      const allUsers = JSON.parse(localStorage.getItem('spa_users') || '[]');
      const me = allUsers.find(u => u.id === currentUser.id);
      if (me) setUserPoints(me.points || 0);
    } catch (error) {
      // Exception flow 4a: Hệ thống gặp lỗi trong quá trình truy xuất dữ liệu
      alert("Hệ thống gặp lỗi trong quá trình truy xuất dữ liệu. Vui lòng xem lại sau!");
      console.error("Data fetch error:", error);
    }
  };

  const handlePetSaved = () => {
    setShowAddPet(false);
    setEditingPet(null);
    loadData();
  };

  const updateBookingStatus = (bookId, newStatus) => {
    let allBookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
    const updated = allBookings.map(b => b.id === bookId ? { ...b, status: newStatus } : b);
    localStorage.setItem('spa_bookings', JSON.stringify(updated));

    // Khớp Sequence Diagram Hủy lịch: 2.4 Tạo thông báo hủy & 3. Thông báo hủy thành công
    if (newStatus === 'CANCELLED') {
      let notifs = JSON.parse(localStorage.getItem('spa_notifications') || '[]');
      notifs.push({
        id: Date.now().toString(),
        userId: 'admin-001', // Báo cho Admin
        message: `Khách hàng ${currentUser.name} vừa hủy lịch hẹn (ID: ${bookId}).`,
        read: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('spa_notifications', JSON.stringify(notifs));
      alert("Hủy lịch thành công!");
    }

    loadData();
  };

  const submitReview = (e) => {
    e.preventDefault();
    
    // Lưu đánh giá vào localStorage
    let allReviews = JSON.parse(localStorage.getItem('spa_reviews') || '[]');
    const pet = pets.find(p => p.id === reviewModal.petId);
    
    const newReview = {
      id: Date.now().toString(), // matches ratingID
      bookingID: reviewModal.id, // Khớp Class Diagram: Thuộc tính bookingID của Rating
      branchId: reviewModal.branchId || 'B1',
      name: currentUser.name,
      pet: pet ? pet.name : 'Thú cưng',
      rating: rating, // Khớp Class Diagram: rating: int
      feedback: comment, // Khớp Class Diagram: feedback() hoặc comment
      createdAt: new Date().toISOString()
    };
    
    allReviews.push(newReview);
    localStorage.setItem('spa_reviews', JSON.stringify(allReviews));

    alert("Cảm ơn bạn đã đánh giá! Phản hồi của bạn giúp chúng tôi phục vụ tốt hơn.");
    updateBookingStatus(reviewModal.id, 'REVIEWED');
    setReviewModal(null);
    setRating(5);
    setComment('');
  };

  const submitReschedule = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return alert("Vui lòng chọn ngày và giờ mới!");
    
    let allBookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
    const updated = allBookings.map(b => b.id === rescheduleModal.id ? { ...b, date: newDate, time: newTime } : b);
    localStorage.setItem('spa_bookings', JSON.stringify(updated));

    // Thêm thông báo cho Admin biết Khách vừa đổi lịch
    let notifs = JSON.parse(localStorage.getItem('spa_notifications') || '[]');
    notifs.push({
      id: Date.now().toString(),
      userId: 'admin-001', // Nếu hệ thống sau này hỗ trợ thông báo cho admin
      message: `Khách hàng ${currentUser.name} vừa đổi lịch hẹn sang ${newTime} ngày ${newDate}.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('spa_notifications', JSON.stringify(notifs));

    alert("Đổi lịch thành công!");
    setRescheduleModal(null);
    loadData();
  };

  let tier = 'Thành viên Đồng';
  let tierColor = '#b45309'; // Bronze
  let tierBg = '#fef3c7';
  if (userPoints >= 1000) { 
    tier = 'Thành viên Vàng'; 
    tierColor = '#b45309'; 
    tierBg = 'linear-gradient(135deg, #fef08a, #f59e0b)'; 
  } else if (userPoints >= 300) { 
    tier = 'Thành viên Bạc'; 
    tierColor = '#334155'; 
    tierBg = 'linear-gradient(135deg, #f1f5f9, #cbd5e1)'; 
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Trang cá nhân</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ background: tierBg, color: tierColor, padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(0,0,0,0.1)' }}>
              💎 {tier}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Điểm tích lũy: <strong style={{ color: 'var(--primary-dark)' }}>{userPoints}</strong></span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('booking')}>+ Đặt lịch mới</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Pets Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Hồ sơ Thú cưng của tôi</h2>
            {!showAddPet && !editingPet && (
              <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowAddPet(true)}>Thêm bé</button>
            )}
          </div>
          
          {(showAddPet || editingPet) ? (
            <PetForm 
              currentUser={currentUser} 
              onPetAdded={handlePetSaved} 
              onCancel={() => { setShowAddPet(false); setEditingPet(null); }}
              petToEdit={editingPet}
            />
          ) : (
            // NFR: Horizontal Scrolling
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'thin', scrollSnapType: 'x mandatory' }}>
              {pets.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', width: '100%' }}>Bạn chưa thêm thú cưng nào.</div>
              ) : (
                pets.map(pet => (
                  <div key={pet.id} className="card" style={{ flex: '0 0 300px', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <img src={pet.image || (pet.species === 'DOG' ? 'https://cdn-icons-png.flaticon.com/512/616/616408.png' : 'https://cdn-icons-png.flaticon.com/512/616/616430.png')} alt={pet.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', background: 'var(--primary-light)' }} />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {pet.name}
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingPet(pet)} title="Sửa hồ sơ"><Edit3 size={16} /></button>
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 'bold' }}>{pet.species === 'DOG' ? 'Chó' : 'Mèo'} • {pet.breed}</p>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Giới tính:</span> <span>{pet.gender === 'MALE' ? 'Đực' : pet.gender === 'FEMALE' ? 'Cái' : 'Không rõ'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Cân nặng:</span> <span>{pet.weight} kg</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Mô tả:</span>
                        <span style={{ fontStyle: 'italic', color: '#64748b' }}>{pet.description || 'Không có mô tả'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div>
          <h2>Quản lý lịch Spa</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Bạn chưa có lịch hẹn nào.</div>
            ) : (
              bookings.map(bk => {
                const pet = pets.find(p => p.id === bk.petId);
                return (
                  <div key={bk.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-dark)' }}>{bk.service}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                          <strong>Bé:</strong> {pet ? pet.name : 'Đã xóa'} | <strong>Thời gian:</strong> {bk.date} - {bk.time}
                        </p>
                        {bk.branchName && (
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={14} /> {bk.branchName} - {bk.branchAddress}
                          </p>
                        )}
                      </div>
                      <span style={{ 
                        display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold',
                        backgroundColor: bk.status === 'PENDING' ? '#fef3c7' : bk.status === 'IN_PROGRESS' ? '#dbeafe' : bk.status === 'CANCELLED' ? '#fee2e2' : '#d1fae5',
                        color: bk.status === 'PENDING' ? '#b45309' : bk.status === 'IN_PROGRESS' ? '#1d4ed8' : bk.status === 'CANCELLED' ? '#ef4444' : '#059669'
                      }}>
                        {bk.status === 'PENDING' ? 'Sắp tới' : bk.status === 'IN_PROGRESS' ? 'Đang thực hiện' : bk.status === 'CANCELLED' ? 'Đã hủy' : 'Hoàn thành'}
                      </span>
                    </div>

                    {/* Live Tracking for IN_PROGRESS */}
                    {bk.status === 'IN_PROGRESS' && (
                      <div style={{ background: '#eff6ff', border: '1px dashed #60a5fa', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid #bfdbfe', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, color: '#1e40af' }}>Live Tracking: Đang chăm sóc bé...</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#3b82f6' }}>Thời gian dự kiến còn khoảng: <strong>{bk.duration || 45} phút</strong>.</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      {bk.status === 'PENDING' && (
                        <>
                          <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => { setRescheduleModal(bk); setNewDate(bk.date); setNewTime(bk.time); }}>
                            Đổi lịch
                          </button>
                          <button className="btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem 1rem' }} onClick={() => confirm("Bạn có chắc chắn muốn hủy lịch này?") && updateBookingStatus(bk.id, 'CANCELLED')}>
                            Hủy lịch
                          </button>
                        </>
                      )}
                      {bk.status === 'DONE' && (
                        <button className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#eab308' }} onClick={() => setReviewModal(bk)}>
                          <Star size={16}/> Viết đánh giá
                        </button>
                      )}
                      {bk.status === 'REVIEWED' && (
                        <span style={{ fontSize: '0.875rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={16} /> Đã đánh giá
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card fade-in" style={{ width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>Đánh giá dịch vụ</h3>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{reviewModal.service} tại {reviewModal.branchName}</p>
            
            <form onSubmit={submitReview}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={32} fill={rating >= star ? '#eab308' : 'none'} color={rating >= star ? '#eab308' : '#cbd5e1'} onClick={() => setRating(star)} />
                ))}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nhận xét của bạn</label>
                <textarea className="input-field" rows="4" placeholder="Dịch vụ tuyệt vời, bé nhà mình rất thích..." value={comment} onChange={e => setComment(e.target.value)} required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setReviewModal(null)}>Để sau</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Gửi đánh giá</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card fade-in" style={{ width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>Thay đổi thời gian hẹn</h3>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Chọn ngày và giờ mới cho lịch hẹn của bạn.
            </p>
            
            <form onSubmit={submitReschedule}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ngày mới</label>
                <input 
                  type="date" 
                  className="input-field" 
                  min={new Date().toISOString().split('T')[0]} 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Khung giờ mới</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {timeSlots.map(t => (
                    <div 
                      key={t}
                      style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.9rem', border: `2px solid ${newTime === t ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', background: newTime === t ? 'var(--primary-light)' : 'white' }}
                      onClick={() => setNewTime(t)}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setRescheduleModal(null)}>Hủy bỏ</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Xác nhận đổi lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
