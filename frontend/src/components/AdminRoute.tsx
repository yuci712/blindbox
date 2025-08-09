import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  role: string;
  email: string;
}

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('解析用户数据失败:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // 如果未登录，重定向到登录页
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 如果不是管理员，重定向到首页
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h1>
          <p className="text-gray-600 mb-4">您没有权限访问管理员页面。</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
