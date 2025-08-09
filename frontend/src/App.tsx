import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NetworkStatus from './components/NetworkStatus';
import BackToHome from './components/BackToHome';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlindBoxDetail from './pages/BlindBoxDetail';
import UserProfile from './pages/UserProfile';
import MyCollection from './pages/MyCollection';
import MyOrders from './pages/MyOrders';
import PlayerShow from './pages/PlayerShow';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Admin from './pages/Admin';
import AdminOrders from './pages/AdminOrders';
import GradientTest from './pages/GradientTest';
import './App.css';

interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string; 
  role: string;
  avatar?: string;
}

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // 可以在这里添加跳转到登录页的逻辑
  };

  const showHeader = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NetworkStatus />
      {showHeader && (
        <Header 
          user={user} 
          onLogout={handleLogout}
        />
      )}
      
      {/* 全局回到主页按钮 */}
      <BackToHome 
        position="top-left" 
        hideOnPages={['/', '/login', '/register']} 
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blindbox/:id" element={<BlindBoxDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/collection" element={<MyCollection />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/showcase" element={<PlayerShow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/blindboxes" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/gradient-test" element={<GradientTest />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
