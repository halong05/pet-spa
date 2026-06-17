import { useState, useEffect } from 'react';
import Header from './components/Header';
import { MessageCircle } from 'lucide-react';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import BookingFlow from './components/BookingFlow';
import AdminDashboard from './components/AdminDashboard';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  // Khôi phục phiên đăng nhập từ LocalStorage & Khởi tạo Admin
  useEffect(() => {
    let users = JSON.parse(localStorage.getItem('spa_users') || '[]');
    if (!users.find(u => u.phone === 'admin')) {
      users.push({ id: 'admin-001', name: 'Quản trị viên', phone: 'admin', password: 'admin', role: 'ADMIN' });
      localStorage.setItem('spa_users', JSON.stringify(users));
    }

    const loggedInUser = localStorage.getItem('spa_current_user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('spa_current_user', JSON.stringify(user));
    navigate('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('spa_current_user');
    navigate('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'login':
        return <Auth onLogin={handleLogin} />;
      case 'dashboard':
        if (!currentUser) { navigate('login'); return null; }
        return <Dashboard currentUser={currentUser} navigate={navigate} />;
      case 'booking':
        if (!currentUser) { navigate('login'); return null; }
        return <BookingFlow currentUser={currentUser} navigate={navigate} />;
      case 'admin':
        if (!currentUser || currentUser.role !== 'ADMIN') { navigate('home'); return null; }
        return <AdminDashboard currentUser={currentUser} navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <Header 
        currentView={currentView} 
        navigate={navigate} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
      <main className="main-content">
        {renderView()}
      </main>
      
      <Footer />
      
      {/* Floating Support Chatbot */}
      <ChatWidget currentUser={currentUser} />
    </div>
  );
}

export default App;
