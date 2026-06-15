import React, { useState, useEffect } from 'react';
import { Users, Calendar, Settings, BarChart2, CheckCircle, MessageSquare, Plus, Trash2, Search, Filter, Send, Printer, Edit, Shield, UserPlus } from 'lucide-react';

export default function AdminDashboard({ currentUser, navigate }) {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data State
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  
  // Dynamic Services
  const defaultServices = [
    { id: 'S1', name: 'Cắt Tỉa Lông Nghệ Thuật', description: 'Tạo kiểu lông thời trang cho thú cưng', price: 250000, duration: 60 },
    { id: 'S2', name: 'Tắm Thảo Dược', description: 'Tắm sạch sẽ bằng thảo dược thiên nhiên', price: 150000, duration: 45 },
    { id: 'S3', name: 'Khám Sức Khỏe Cơ Bản', description: 'Kiểm tra tổng quát sức khỏe', price: 0, duration: 15 },
    { id: 'S4', name: 'Gói Combo Toàn Diện', description: 'Cắt tỉa, tắm rửa và khám sức khỏe', price: 350000, duration: 120 }
  ];
  const [services, setServices] = useState([]);

  // Dynamic Staffs
  const defaultStaffs = [
    { id: 'ST1', name: 'Nguyễn Văn Quản Lý', role: 'MANAGER', phone: '0999999999' },
    { id: 'ST2', name: 'Trần Thị Lễ Tân', role: 'RECEPTIONIST', phone: '0888888888' },
    { id: 'ST3', name: 'Lê Văn Bác Sĩ', role: 'VET', phone: '0777777777' }
  ];
  const [staffs, setStaffs] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reportFilter, setReportFilter] = useState('ALL');
  
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    loadData();
    const handleStorage = (e) => {
      if (['spa_chats', 'spa_bookings', 'spa_users', 'spa_services', 'spa_staffs'].includes(e.key)) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadData = () => {
    setAllBookings(JSON.parse(localStorage.getItem('spa_bookings') || '[]').sort((a, b) => b.id - a.id));
    setAllUsers(JSON.parse(localStorage.getItem('spa_users') || '[]').filter(u => u.role !== 'ADMIN'));
    setAllChats(JSON.parse(localStorage.getItem('spa_chats') || '[]'));
    
    const localServices = JSON.parse(localStorage.getItem('spa_services'));
    if (localServices) setServices(localServices);
    else {
      setServices(defaultServices);
      localStorage.setItem('spa_services', JSON.stringify(defaultServices));
    }

    const localStaffs = JSON.parse(localStorage.getItem('spa_staffs'));
    if (localStaffs) setStaffs(localStaffs);
    else {
      setStaffs(defaultStaffs);
      localStorage.setItem('spa_staffs', JSON.stringify(defaultStaffs));
    }
  };

  const updateBookingStatus = (bookId, newStatus) => {
    let bookings = JSON.parse(localStorage.getItem('spa_bookings') || '[]');
    const targetBooking = bookings.find(b => b.id === bookId);
    if (!targetBooking) return;

    const updated = bookings.map(b => b.id === bookId ? { ...b, status: newStatus } : b);
    localStorage.setItem('spa_bookings', JSON.stringify(updated));

    // Notifications
    let notifs = JSON.parse(localStorage.getItem('spa_notifications') || '[]');
    let message = '';
    if (newStatus === 'IN_PROGRESS') message = `Chi nhánh ${targetBooking.branchName} đang bắt đầu chăm sóc cho bé.`;
    else if (newStatus === 'DONE') message = `Dịch vụ của bé đã hoàn thành tại ${targetBooking.branchName}.`;
    else if (newStatus === 'CANCELLED') message = `Lịch hẹn tại ${targetBooking.branchName} đã bị hủy bởi quản lý.`;
    
    if (message) {
      notifs.push({
        id: Date.now().toString(), userId: targetBooking.userId, message, read: false, createdAt: new Date().toISOString()
      });
      localStorage.setItem('spa_notifications', JSON.stringify(notifs));
    }

    // Loyalty Points
    if (newStatus === 'DONE') {
      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      users = users.map(u => u.id === targetBooking.userId ? { ...u, points: (u.points || 0) + 100 } : u);
      localStorage.setItem('spa_users', JSON.stringify(users));
    }
    loadData();
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // --- REPORT FILTERING ---
  const getFilteredReports = () => {
    const now = new Date();
    return allBookings.filter(b => {
      if (b.status !== 'DONE' && b.status !== 'REVIEWED') return false;
      if (reportFilter === 'ALL') return true;
      const bDate = new Date(b.date); // format YYYY-MM-DD
      if (reportFilter === 'MONTH') {
        return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
      }
      if (reportFilter === 'QUARTER') {
        const q1 = Math.floor(bDate.getMonth() / 3);
        const q2 = Math.floor(now.getMonth() / 3);
        return q1 === q2 && bDate.getFullYear() === now.getFullYear();
      }
      if (reportFilter === 'YEAR') {
        return bDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };
  const reportBookings = getFilteredReports();
  const totalRevenue = reportBookings.reduce((acc, curr) => {
    const srv = services.find(s => s.name === curr.service);
    return srv ? acc + srv.price : acc;
  }, 0);
  const branchStats = reportBookings.reduce((acc, curr) => {
    acc[curr.branchName] = (acc[curr.branchName] || 0) + 1;
    return acc;
  }, {});
  const maxBranchCount = Math.max(...Object.values(branchStats), 1);

  // --- BOOKING FILTERING ---
  const filteredBookings = allBookings.filter(bk => {
    const user = allUsers.find(u => u.id === bk.userId);
    const matchesSearch = (user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (user?.phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || bk.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- CHAT LOGIC ---
  const chatUsers = [...new Set(allChats.map(c => c.userId))].map(id => {
    const u = allUsers.find(user => user.id === id);
    const lastMsg = allChats.filter(c => c.userId === id).pop();
    return { id, name: u?.name || 'Khách hàng', lastMsg };
  }).sort((a, b) => new Date(b.lastMsg?.timestamp) - new Date(a.lastMsg?.timestamp));

  const handleAdminSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatUserId) return;
    let chats = JSON.parse(localStorage.getItem('spa_chats') || '[]');
    chats.push({
      id: Date.now().toString(), userId: selectedChatUserId, userName: 'Admin', sender: 'ADMIN', text: chatInput, timestamp: new Date().toISOString()
    });
    localStorage.setItem('spa_chats', JSON.stringify(chats));
    setChatInput('');
    loadData();
  };

  // --- CUSTOMER CRUD ---
  const handleDeleteUser = (id) => {
    if (confirm("Chắc chắn xóa khách hàng này? Mọi dữ liệu thú cưng và lịch hẹn cũng có thể bị ảnh hưởng.")) {
      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      users = users.filter(u => u.id !== id);
      localStorage.setItem('spa_users', JSON.stringify(users));
      loadData();
    }
  };

  const handleEditUser = (u) => {
    const newName = prompt("Nhập tên mới:", u.name);
    if (newName) {
      let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
      users = users.map(user => user.id === u.id ? { ...user, name: newName } : user);
      localStorage.setItem('spa_users', JSON.stringify(users));
      loadData();
    }
  };

  // --- STAFF CRUD ---
  const handleDeleteStaff = (id) => {
    if (confirm("Chắc chắn xóa nhân sự này?")) {
      const updated = staffs.filter(s => s.id !== id);
      setStaffs(updated);
      localStorage.setItem('spa_staffs', JSON.stringify(updated));
    }
  };
  const handleEditStaffRole = (id) => {
    const newRole = prompt("Nhập quyền mới (MANAGER / RECEPTIONIST / VET):");
    if (newRole && ['MANAGER', 'RECEPTIONIST', 'VET'].includes(newRole.toUpperCase())) {
      const updated = staffs.map(s => s.id === id ? { ...s, role: newRole.toUpperCase() } : s);
      setStaffs(updated);
      localStorage.setItem('spa_staffs', JSON.stringify(updated));
    } else if (newRole) {
      alert("Quyền không hợp lệ!");
    }
  };

  // --- SERVICE CRUD ---
  const handleDeleteService = (id) => {
    if (confirm("Chắc chắn xóa dịch vụ này?")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem('spa_services', JSON.stringify(updated));
    }
  };
  const handleAddService = () => {
    const name = prompt("Tên dịch vụ:");
    if (!name) return;
    const price = parseInt(prompt("Giá tiền (VNĐ):") || '0');
    const duration = parseInt(prompt("Thời gian thực hiện (Phút):") || '30');
    const updated = [...services, { id: 'S' + Date.now(), name, price, duration }];
    setServices(updated);
    localStorage.setItem('spa_services', JSON.stringify(updated));
  };

  // --- PRINT INVOICE ---
  const handlePrintInvoice = (bk) => {
    const srv = services.find(s => s.name === bk.service);
    const user = allUsers.find(u => u.id === bk.userId);
    alert(`Đang kết nối máy in...\n\n--- HÓA ĐƠN THANH TOÁN ---\nMã GD: ${bk.id}\nKhách hàng: ${user?.name || 'Khách'}\nDịch vụ: ${bk.service}\nTổng tiền: ${formatPrice(srv?.price || 0)}\nChi nhánh: ${bk.branchName}\n---------------------------\nCảm ơn quý khách!`);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#ef4444' }}>Hệ Thống Quản Trị & Vận Hành Spa</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Phân quyền: Tổng Quản Lý (Admin)</p>
        </div>
      </div>

      <div className="admin-layout">
        
        {/* Sidebar Navigation */}
        <div className="card admin-sidebar" style={{ padding: '1rem 0' }}>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'bookings' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'bookings' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'bookings' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'bookings' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={20} /> Lịch hẹn & Tư vấn
          </div>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'reports' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'reports' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'reports' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'reports' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart2 size={20} /> Xem Báo Cáo
          </div>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'users' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'users' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'users' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'users' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} /> Quản lý Khách hàng
          </div>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'staffs' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'staffs' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'staffs' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'staffs' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('staffs')}
          >
            <Shield size={20} /> Quản lý Nhân sự
          </div>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'services' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'services' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'services' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'services' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('services')}
          >
            <Settings size={20} /> Cập nhật Dịch vụ
          </div>
          <div 
            style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: activeTab === 'chat' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'chat' ? 'var(--primary-dark)' : 'var(--text-color)', borderRight: activeTab === 'chat' ? '4px solid var(--primary)' : '4px solid transparent', fontWeight: activeTab === 'chat' ? 'bold' : 'normal' }}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={20} /> Tư vấn Chatbot
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="fade-in">
              <h2>Xác nhận Lịch đặt & Phục vụ</h2>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="input-field" placeholder="Tìm theo tên hoặc SĐT khách hàng..." style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ position: 'relative', width: '200px' }}>
                  <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select className="input-field" style={{ paddingLeft: '2.5rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="DONE">Hoàn thành</option>
                    <option value="REVIEWED">Đã đánh giá</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredBookings.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Không có lịch hẹn.</p> : null}
                {filteredBookings.map(bk => {
                  const user = allUsers.find(u => u.id === bk.userId);
                  return (
                    <div key={bk.id} className="card" style={{ borderLeft: bk.status === 'PENDING' ? '4px solid #f59e0b' : bk.status === 'IN_PROGRESS' ? '4px solid #3b82f6' : '4px solid #10b981' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0' }}>{bk.service}</h3>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <strong>Khách hàng:</strong> {user ? `${user.name} (${user.phone})` : 'Khách vãng lai'}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <strong>Ngày giờ:</strong> {bk.date} - {bk.time} | <strong>Chi nhánh:</strong> {bk.branchName}
                          </p>
                        </div>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', height: 'fit-content',
                          backgroundColor: bk.status === 'PENDING' ? '#fef3c7' : bk.status === 'IN_PROGRESS' ? '#dbeafe' : bk.status === 'CANCELLED' ? '#fee2e2' : '#d1fae5',
                          color: bk.status === 'PENDING' ? '#b45309' : bk.status === 'IN_PROGRESS' ? '#1d4ed8' : bk.status === 'CANCELLED' ? '#ef4444' : '#059669'
                        }}>
                          {bk.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        {bk.status === 'PENDING' && (
                          <>
                            <button className="btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => confirm("Hủy lịch này?") && updateBookingStatus(bk.id, 'CANCELLED')}>Hủy lịch</button>
                            <button className="btn-primary" onClick={() => updateBookingStatus(bk.id, 'IN_PROGRESS')}>Xác nhận lịch đặt (Check-in)</button>
                          </>
                        )}
                        {bk.status === 'IN_PROGRESS' && (
                          <button className="btn-primary" style={{ backgroundColor: '#10b981' }} onClick={() => updateBookingStatus(bk.id, 'DONE')}><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Xác nhận Hoàn thành</button>
                        )}
                        {(bk.status === 'DONE' || bk.status === 'REVIEWED') && (
                          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => handlePrintInvoice(bk)}>
                            <Printer size={16} /> Lập hóa đơn
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REPORTS */}
          {activeTab === 'reports' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Xem Báo cáo Tổng quan</h2>
                <select className="input-field" style={{ width: '200px' }} value={reportFilter} onChange={e => setReportFilter(e.target.value)}>
                  <option value="ALL">Toàn thời gian</option>
                  <option value="MONTH">Báo cáo theo Tháng</option>
                  <option value="QUARTER">Báo cáo theo Quý</option>
                  <option value="YEAR">Báo cáo theo Năm</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'normal' }}>Lịch Hẹn Thành Công</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{reportBookings.length}</div>
                </div>
                <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'normal' }}>Doanh Thu</h3>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{formatPrice(totalRevenue)}</div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ margin: '0 0 1.5rem 0' }}>Lượt khách phân bổ theo chi nhánh</h3>
                {Object.keys(branchStats).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu trong khoảng thời gian này.</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '250px', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                    {Object.entries(branchStats).map(([branchName, count], idx) => {
                      const heightPercent = (count / maxBranchCount) * 100;
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{count}</div>
                          <div style={{ width: '40px', height: `${heightPercent}%`, backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0', transition: 'height 1s ease-out' }}></div>
                          <div style={{ position: 'absolute', bottom: '-1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }} title={branchName}>
                            {branchName.replace('PetSpa ', '')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: USERS (CUSTOMERS) */}
          {activeTab === 'users' && (
            <div className="fade-in">
              <h2>Quản lý Khách hàng</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: 'var(--bg-sidebar)', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Tên Khách hàng</th>
                    <th style={{ padding: '1rem' }}>Số điện thoại</th>
                    <th style={{ padding: '1rem' }}>Thành viên</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u, idx) => {
                    const points = u.points || 0;
                    let tier = 'Thành viên Đồng';
                    if (points >= 1000) tier = 'Thành viên Vàng';
                    else if (points >= 300) tier = 'Thành viên Bạc';

                    return (
                      <tr key={u.id} style={{ borderTop: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.phone}</td>
                        <td style={{ padding: '1rem' }}>{points} đ ({tier})</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '1rem' }} onClick={() => handleEditUser(u)} title="Sửa thông tin">
                            <Edit size={18} />
                          </button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDeleteUser(u.id)} title="Xóa thông tin">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {allUsers.length === 0 && <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Chưa có khách hàng.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: STAFFS */}
          {activeTab === 'staffs' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Quản lý Tài khoản Nhân viên</h2>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Form Thêm mới Nhân sự")}><UserPlus size={16}/> Thêm Nhân Sự</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: 'var(--bg-sidebar)', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Họ Tên</th>
                    <th style={{ padding: '1rem' }}>Số điện thoại</th>
                    <th style={{ padding: '1rem' }}>Quyền hạn (Role)</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staffs.map((st, idx) => (
                    <tr key={st.id} style={{ borderTop: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{st.name}</td>
                      <td style={{ padding: '1rem' }}>{st.phone}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {st.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => handleEditStaffRole(st.id)}>
                          Phân quyền
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', verticalAlign: 'middle' }} onClick={() => handleDeleteStaff(st.id)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Cập nhật Dịch vụ Spa</h2>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleAddService}><Plus size={16}/> Thêm mới</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {services.map(srv => (
                  <div key={srv.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0' }}>{srv.name}</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>Thời gian: {srv.duration} phút | Giá: {formatPrice(srv.price)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => alert("Sửa dịch vụ " + srv.name)}>Sửa</button>
                      <button className="btn-outline" style={{ padding: '0.5rem', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDeleteService(srv.id)}><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CHAT */}
          {activeTab === 'chat' && (
            <div className="fade-in" style={{ display: 'flex', height: '600px', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: 'white', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              
              <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'white', fontWeight: 'bold' }}>
                  Đoạn chat gần đây
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {chatUsers.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có tin nhắn nào.</div>
                  ) : (
                    chatUsers.map(u => (
                      <div 
                        key={u.id} 
                        style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: selectedChatUserId === u.id ? 'var(--primary-light)' : 'transparent' }}
                        onClick={() => setSelectedChatUserId(u.id)}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-color)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.lastMsg?.sender === 'ADMIN' ? 'Bạn: ' : ''}{u.lastMsg?.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                {!selectedChatUserId ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Chọn một đoạn chat để bắt đầu trả lời.
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {chatUsers.find(u => u.id === selectedChatUserId)?.name}
                    </div>
                    
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {allChats.filter(c => c.userId === selectedChatUserId).map(msg => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'ADMIN' ? 'flex-end' : 'flex-start' }}>
                          <div style={{ 
                            maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: '1rem', fontSize: '0.95rem', lineHeight: '1.4',
                            background: msg.sender === 'ADMIN' ? 'var(--primary)' : 'white',
                            color: msg.sender === 'ADMIN' ? 'white' : 'var(--text-color)',
                            border: msg.sender === 'USER' ? '1px solid var(--border-color)' : 'none',
                            borderBottomRightRadius: msg.sender === 'ADMIN' ? '0.25rem' : '1rem',
                            borderBottomLeftRadius: msg.sender === 'USER' ? '0.25rem' : '1rem'
                          }}>
                            {msg.text}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAdminSendChat} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'white', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Nhập nội dung tư vấn..." 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        style={{ flex: 1, border: '1px solid var(--border-color)', outline: 'none', padding: '0.75rem 1rem', borderRadius: '2rem' }}
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={!chatInput.trim()}>
                        Gửi <Send size={18} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
