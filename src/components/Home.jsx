import React, { useState, useEffect } from 'react';
import { Scissors, Bath, HeartPulse, Sparkles, MapPin, Star, ShieldCheck, Clock, Phone, HeartHandshake, MessageSquare, X } from 'lucide-react';

export default function Home({ navigate }) {
  const [reviewModalBranch, setReviewModalBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);

  const services = [
    { icon: <Scissors size={32} />, title: "Cắt Tỉa Lông Nghệ Thuật", price: "250,000đ", desc: "Tạo kiểu thời trang, cắt tỉa gọn gàng theo chuẩn giống thú cưng. (Thời gian: ~60 phút)" },
    { icon: <Bath size={32} />, title: "Tắm Thảo Dược", price: "150,000đ", desc: "Tắm sạch sâu, khử mùi, kết hợp massage thư giãn. (Thời gian: ~45 phút)" },
    { icon: <HeartPulse size={32} />, title: "Khám Sức Khỏe Cơ Bản", price: "Miễn phí", desc: "Kiểm tra da, tai, mắt, răng miệng trước khi làm dịch vụ." },
    { icon: <Sparkles size={32} />, title: "Gói Combo Toàn Diện", price: "350,000đ", desc: "Bao gồm tắm, sấy, cắt tỉa, vệ sinh tai và cắt móng. (Thời gian: ~120 phút)" },
  ];

  const processSteps = [
    { title: "Kiểm tra sức khỏe", desc: "Khám sơ bộ da và lông để tư vấn gói phù hợp." },
    { title: "Vệ sinh cơ bản", desc: "Cắt móng, cạo bàn, vệ sinh tai." },
    { title: "Tắm & Massage", desc: "Tắm 2 lần bằng sữa tắm chuyên dụng." },
    { title: "Sấy & Chải lông", desc: "Sấy bồng bềnh và gỡ rối lông." },
    { title: "Tạo kiểu nghệ thuật", desc: "Cắt tỉa theo yêu cầu của khách hàng." }
  ];

  useEffect(() => {
    const staticBranches = [
      { 
        id: 'B1', name: 'PetSpa Cầu Giấy (Cơ sở chính)', address: '123 Cầu Giấy, Q. Cầu Giấy, HN', rating: 4.9, reviewCount: 154,
        reviews: [
          { name: "Chị Ngọc Mỹ", pet: "Poodle", rating: 5, comment: "Dịch vụ rất tốt, nhân viên cơ sở Cầu Giấy cực kỳ nhiệt tình, có ứng dụng theo dõi giờ làm nên không phải chờ đợi." },
          { name: "Anh Nam", pet: "Golden", rating: 5, comment: "Tiệm rộng rãi, sạch sẽ. Tắm xong bé thơm rất lâu. Sẽ giới thiệu bạn bè." }
        ]
      },
      { 
        id: 'B2', name: 'PetSpa Đống Đa', address: '45 Thái Hà, Q. Đống Đa, HN', rating: 4.8, reviewCount: 98,
        reviews: [
          { name: "Anh Tuấn Anh", pet: "Corgi", rating: 5, comment: "Cơ sở Thái Hà rất trung tâm, dễ tìm. Các bạn groomer tỉa lông cho Corgi rất chuyên nghiệp!" },
          { name: "Chị Thảo", pet: "Mèo Anh Lông Ngắn", rating: 4, comment: "Rất yên tâm khi gửi bé mèo nhát người ở đây, nhân viên rất nhẹ nhàng không làm bé hoảng." }
        ]
      },
      { 
        id: 'B3', name: 'PetSpa Thanh Xuân', address: '90 Nguyễn Trãi, Q. Thanh Xuân, HN', rating: 4.9, reviewCount: 120, 
        reviews: [{ name: "Minh Quân", pet: "Husky", rating: 5, comment: "Xử lý lông rụng cho Husky quá đỉnh! Về nhà không còn rụng lông vung vãi nữa." }] 
      },
      { 
        id: 'B4', name: 'PetSpa Hoàn Kiếm', address: '12 Đinh Tiên Hoàng, Q. Hoàn Kiếm, HN', rating: 4.7, reviewCount: 85, 
        reviews: [{ name: "Hoàng Yến", pet: "Phốc Sóc", rating: 5, comment: "Ngay trung tâm phố cổ, dạo hồ xong ghé qua tắm rất tiện. Dịch vụ đáng tiền." }] 
      },
      { 
        id: 'B5', name: 'PetSpa Hà Đông', address: '100 Quang Trung, Q. Hà Đông, HN', rating: 4.6, reviewCount: 65, 
        reviews: [{ name: "Cô Lan", pet: "Mèo Mướp", rating: 4, comment: "Giá cả hợp lý, không gian tiệm thoáng mát. Hơi xa nhà cô nhưng đáng để đến." }] 
      }
    ];

    // Lấy các đánh giá mới từ người dùng (Real-time sync)
    const allReviews = JSON.parse(localStorage.getItem('spa_reviews') || '[]');

    const updatedBranches = staticBranches.map(branch => {
      // Tìm các đánh giá mới của chi nhánh này
      const newBranchReviews = allReviews.filter(r => r.branchId === branch.id).map(r => ({
        name: r.name,
        pet: r.pet,
        rating: r.rating,
        comment: r.comment
      })).reverse(); // Mới nhất lên đầu

      // Tính toán lại điểm Rating và Tổng số lượt đánh giá
      const totalReviewCount = branch.reviewCount + newBranchReviews.length;
      const newReviewsScore = newBranchReviews.reduce((sum, r) => sum + r.rating, 0);
      const staticScore = branch.rating * branch.reviewCount;
      const newAverageRating = totalReviewCount > 0 ? ((staticScore + newReviewsScore) / totalReviewCount).toFixed(1) : branch.rating;

      return {
        ...branch,
        rating: newAverageRating,
        reviewCount: totalReviewCount,
        reviews: [...newBranchReviews, ...branch.reviews] // Gộp đánh giá mới lên đầu
      };
    });

    setBranchesData(updatedBranches);
  }, []);

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '2rem', 
        padding: '3rem 2rem', background: 'linear-gradient(135deg, #ecfdf5, #ffffff)', 
        borderRadius: '1rem', marginBottom: '4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1rem', lineHeight: '1.2' }}>
            Thú cưng bẩn, lông rụng, móng dài?<br/> Đã có chúng tôi!
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Spa chăm sóc thú cưng chuẩn y khoa. Minh bạch giá cả, không phát sinh chi phí. Theo dõi trực tiếp tiến độ làm đẹp của bé qua điện thoại.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', flex: '1 1 200px' }} onClick={() => navigate('booking')}>
              Đặt Lịch Ngay
            </button>
            <a href="tel:0987654321" style={{ textDecoration: 'none', flex: '1 1 200px' }}>
              <button className="btn-outline" style={{ width: '100%', fontSize: '1.1rem', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--primary)', color: 'var(--primary-dark)' }}>
                <Phone size={20} /> Hotline: 1900 1234
              </button>
            </a>
          </div>
        </div>
        <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
          <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Chó đáng yêu đang tắm" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
        </div>
      </section>

      {/* Trust & Commitments Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Cam Kết Chất Lượng 3 KHÔNG</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fdfbf7' }}>
            <HeartHandshake size={40} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Không Bạo Lực</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nhân viên được đào tạo chứng chỉ Grooming chuyên nghiệp, yêu thương động vật.</p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fdfbf7' }}>
            <ShieldCheck size={40} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Không Phát Sinh Chi Phí</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Báo giá rõ ràng trên web và trước khi làm dịch vụ. Minh bạch tuyệt đối.</p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fdfbf7' }}>
            <Clock size={40} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Không Phải Chờ Đợi</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Live Tracking tiến độ làm dịch vụ ngay trên điện thoại của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Dịch Vụ Của Chúng Tôi</h2>
          <p style={{ color: 'var(--text-muted)' }}>Giá cả được niêm yết công khai cho các bé dưới 5kg.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {services.map((srv, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                {srv.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{srv.title}</h3>
              <div style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{srv.price}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Care Process Section */}
      <section style={{ marginBottom: '4rem', background: 'var(--primary-light)', padding: '3rem', borderRadius: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-dark)' }}>Quy Trình Chăm Sóc Đạt Chuẩn</h2>
          <p style={{ color: 'var(--primary-dark)', opacity: 0.8 }}>An toàn và thoải mái nhất cho bé cưng của bạn.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {processSteps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '0.5rem', flex: '1 1 250px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-dark)' }}>{step.title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Branches & Reviews Section */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Hệ Thống Chi Nhánh PetSpa</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Dễ dàng đặt lịch tại các chi nhánh gần bạn. Xem đánh giá thực tế từ hàng ngàn khách hàng đã trải nghiệm dịch vụ.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {branchesData.map(branch => (
            <div key={branch.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--primary)" /> {branch.name}
              </h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{branch.address}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={18} fill="#eab308" color="#eab308" />
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{branch.rating}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({branch.reviewCount} đánh giá)</span>
                </div>
                <button 
                  className="btn-outline" 
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  onClick={() => setReviewModalBranch(branch)}
                >
                  <MessageSquare size={14} /> Xem đánh giá
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalBranch && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              onClick={() => setReviewModalBranch(null)}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginTop: 0, paddingRight: '2rem', marginBottom: '0.5rem' }}>Đánh giá {reviewModalBranch.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <Star size={20} fill="#eab308" color="#eab308" />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{reviewModalBranch.rating} / 5</span>
              <span style={{ color: 'var(--text-muted)' }}>- Từ {reviewModalBranch.reviewCount} khách hàng</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviewModalBranch.reviews.map((rev, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', borderLeft: idx === 0 && reviewModalBranch.reviewCount > 154 ? '4px solid #10b981' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                      {rev.name} <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '0.85rem' }}>(Bé {rev.pet})</span>
                      {idx === 0 && reviewModalBranch.reviewCount > 154 && <span style={{ marginLeft: '0.5rem', background: '#d1fae5', color: '#059669', fontSize: '0.7rem', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>Mới</span>}
                    </div>
                    <div style={{ display: 'flex', color: '#eab308' }}>
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: '1.5' }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
