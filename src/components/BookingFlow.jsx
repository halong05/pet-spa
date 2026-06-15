import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star } from 'lucide-react';

export default function BookingFlow({ currentUser, navigate }) {
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState([]);
  
  // Form State
  const [selectedService, setSelectedService] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const services = [
    { id: 'S1', name: 'Cắt Tỉa Lông Nghệ Thuật', price: '250,000đ', duration: 60 },
    { id: 'S2', name: 'Tắm Thảo Dược', price: '150,000đ', duration: 45 },
    { id: 'S3', name: 'Khám Sức Khỏe Cơ Bản', price: 'Miễn phí', duration: 15 },
    { id: 'S4', name: 'Gói Combo Toàn Diện', price: '350,000đ', duration: 120 }
  ];

  // Danh sách các chi nhánh tại Hà Nội
  const branches = [
    { id: 'B1', name: 'PetSpa Cầu Giấy (Cơ sở chính)', address: '123 Cầu Giấy, Q. Cầu Giấy, HN', rating: 4.9, distance: 1.2 },
    { id: 'B2', name: 'PetSpa Đống Đa', address: '45 Thái Hà, Q. Đống Đa, HN', rating: 4.8, distance: 3.5 },
    { id: 'B3', name: 'PetSpa Thanh Xuân', address: '90 Nguyễn Trãi, Q. Thanh Xuân, HN', rating: 4.9, distance: 4.0 },
    { id: 'B4', name: 'PetSpa Hoàn Kiếm', address: '12 Đinh Tiên Hoàng, Q. Hoàn Kiếm, HN', rating: 4.7, distance: 5.5 },
    { id: 'B5', name: 'PetSpa Hà Đông', address: '100 Quang Trung, Q. Hà Đông, HN', rating: 4.6, distance: 8.2 }
  ].sort((a, b) => a.distance - b.distance); // Mặc định hiển thị tiệm gần nhất lên đầu

  const timeSlots = ['08:00', '09:00', '10:00', '13:30', '14:30', '15:30', '16:30'];

  useEffect(() => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đặt lịch!");
      navigate('login');
      return;
    }
    const allPets = JSON.parse(localStorage.getItem('spa_pets') || '[]');
    setPets(allPets.filter(p => p.ownerId === currentUser.id));
  }, [currentUser, navigate]);

  const handleNext = () => {
    if (step === 1 && !selectedService) return alert("Vui lòng chọn dịch vụ!");
    if (step === 2 && !selectedPet) return alert("Vui lòng chọn thú cưng!");
    if (step === 3 && !selectedBranch) return alert("Vui lòng chọn chi nhánh gần bạn!");
    
    if (step === 4) {
      if (!date || !time) return alert("Vui lòng chọn ngày và giờ!");
      
      // Khớp Sequence Diagram: Kiểm tra lịch đặt (get timeBooking) -> Yêu cầu nhập lại
      let allBookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
      const isFull = allBookings.some(b => 
        b.branchId === selectedBranch && 
        b.date === date && 
        b.time === time &&
        b.status !== 'CANCELLED'
      );

      if (isFull) {
        return alert(`Rất tiếc! Chi nhánh này đã kín lịch vào khung giờ ${time} ngày ${date}. Vui lòng chọn giờ khác.`);
      }
    }
    
    setStep(step + 1);
  };

  const handleConfirm = () => {
    let allBookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
    const srv = services.find(s => s.id === selectedService);
    const branch = branches.find(b => b.id === selectedBranch);
    
    const newBooking = {
      id: Date.now().toString(), // matches bookingId
      customerId: currentUser.id, // Khớp Class Diagram: customerId
      userId: currentUser.id, // Giữ lại để tương thích code cũ
      petId: selectedPet, // Khớp Class Diagram: petId
      serviceId: srv.id, // Khớp Class Diagram: serviceId
      service: srv.name, 
      staffId: 'ST1', // Khớp Class Diagram: staffId (Mặc định vì chưa có chọn staff)
      bookingDate: date, // Khớp Class Diagram: bookingDate
      bookingTime: time, // Khớp Class Diagram: bookingTime
      date, time, // Giữ lại để tương thích code cũ
      duration: srv.duration,
      branchId: branch.id,
      branchName: branch.name,
      address: branch.address, // Khớp Class Diagram: address
      branchAddress: branch.address,
      phone: currentUser.phone || '0987654321', // Khớp Class Diagram: phone
      paymentMethod: 'Thanh toán tại quầy', // Khớp Class Diagram: paymentMethod
      note,
      status: 'PENDING' // Khớp Class Diagram: status
    };
    
    allBookings.push(newBooking);
    localStorage.setItem('spa_bookings', JSON.stringify(allBookings));
    alert("Đặt lịch thành công!");
    navigate('dashboard');
  };

  if (!currentUser) return null;

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Đặt Lịch Spa</h1>
      
      {/* Progress Bar (5 steps) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: `${(step-1)*25}%`, height: '2px', background: 'var(--primary)', zIndex: 1, transition: 'width 0.3s' }}></div>
        
        {[1,2,3,4,5].map(num => (
          <div key={num} style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= num ? 'var(--primary)' : 'white', border: `2px solid ${step >= num ? 'var(--primary)' : 'var(--border-color)'}`, color: step >= num ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 2, transition: 'all 0.3s' }}>
            {num}
          </div>
        ))}
      </div>

      <div className="card">
        {step === 1 && (
          <div className="fade-in">
            <h3>Bước 1: Chọn Dịch vụ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {services.map(srv => (
                <div 
                  key={srv.id} 
                  style={{ padding: '1rem', border: `2px solid ${selectedService === srv.id ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setSelectedService(srv.id)}
                >
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{srv.name}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Clock size={14} /> Thời gian dự kiến: {srv.duration} phút
                    </span>
                  </div>
                  <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '1.1rem' }}>{srv.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h3>Bước 2: Chọn Thú cưng</h3>
            {pets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p>Bạn chưa có thú cưng nào.</p>
                <button className="btn-primary" onClick={() => navigate('dashboard')}>Đến trang cá nhân để thêm mới</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {pets.map(pet => (
                  <div 
                    key={pet.id} 
                    style={{ padding: '1rem', border: `2px solid ${selectedPet === pet.id ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer' }}
                    onClick={() => setSelectedPet(pet.id)}
                  >
                    <span style={{ fontWeight: 500, display: 'block' }}>{pet.name}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{pet.species === 'DOG' ? 'Chó' : 'Mèo'} • {pet.breed}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h3>Bước 3: Chọn Chi nhánh (Gần nhất)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 0 }}>Hệ thống tự động ưu tiên các tiệm gần bạn và được đánh giá cao nhất.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {branches.map((b, idx) => (
                <div 
                  key={b.id} 
                  style={{ 
                    padding: '1rem', 
                    border: `2px solid ${selectedBranch === b.id ? 'var(--primary)' : 'var(--border-color)'}`, 
                    borderRadius: '0.5rem', 
                    cursor: 'pointer',
                    background: selectedBranch === b.id ? 'var(--primary-light)' : 'white'
                  }}
                  onClick={() => setSelectedBranch(b.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {idx === 0 && <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.7rem', marginRight: '0.25rem' }}>GẦN NHẤT</span>}
                        {b.name}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <MapPin size={14} /> {b.address}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{b.distance} km</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#eab308' }}>
                        <Star size={14} fill="currentColor" /> {b.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-in">
            <h3>Bước 4: Chọn Ngày & Giờ</h3>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Ngày đặt</label>
              <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Khung giờ (Giờ làm việc: 08:00 - 17:30)</label>
              <div className="responsive-grid-3" style={{ gap: '0.5rem' }}>
                {timeSlots.map(t => (
                  <div 
                    key={t}
                    style={{ padding: '0.75rem', textAlign: 'center', border: `2px solid ${time === t ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', background: time === t ? 'var(--primary-light)' : 'white' }}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="fade-in">
            <h3 style={{ textAlign: 'center' }}>Bước 5: Xác nhận thông tin</h3>
            
            <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Yêu cầu tư vấn / Ghi chú cho nhân viên</label>
              <textarea className="input-field" rows="3" placeholder="Ví dụ: Bé nhà mình hay cắn khi cắt móng, cần tư vấn thêm về dịch vụ..." value={note} onChange={e => setNote(e.target.value)}></textarea>
            </div>

            <div style={{ background: 'var(--bg-sidebar)', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
              <p><strong>Dịch vụ:</strong> {services.find(s => s.id === selectedService)?.name}</p>
              <p><strong>Thú cưng:</strong> {pets.find(p => p.id === selectedPet)?.name}</p>
              <p><strong>Chi nhánh:</strong> {branches.find(b => b.id === selectedBranch)?.name}</p>
              <p><strong>Ngày hẹn:</strong> {date}</p>
              <p><strong>Giờ hẹn:</strong> {time}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><strong><Clock size={16}/> Thời gian dự kiến:</strong> {services.find(s => s.id === selectedService)?.duration} phút</p>
              {note && <p><strong>Ghi chú:</strong> {note}</p>}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ margin: 0 }}><strong>Tổng tiền dự kiến:</strong> <span style={{ color: 'var(--primary-dark)', fontSize: '1.25rem', fontWeight: 'bold' }}>{services.find(s => s.id === selectedService)?.price}</span></p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
              <em>Bạn không cần xếp hàng chờ. Hệ thống sẽ thông báo trạng thái bé trực tiếp trong Trang cá nhân!</em>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 1 ? (
            <button className="btn-outline" onClick={() => setStep(step - 1)}>Quay lại</button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button className="btn-primary" onClick={handleNext}>Tiếp tục</button>
          ) : (
            <button className="btn-primary" onClick={handleConfirm}>Xác nhận Đặt lịch</button>
          )}
        </div>
      </div>
    </div>
  );
}
