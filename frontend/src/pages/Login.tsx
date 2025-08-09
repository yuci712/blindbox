import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { LogIn, UserPlus, Box } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.login(formData);
      
      if (result.success && result.data) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // 强制页面重新加载以更新Header状态
        window.location.href = result.data.user.role === 'admin' ? '/admin' : '/dashboard';

      } else {
        setError(result.message || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生未知错误';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full mb-4">
            <Box size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            欢迎回来
          </h1>
          <p className="text-gray-600">登录以继续你的盲盒之旅</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <LogIn size={20} />
            <span>{isLoading ? '登录中...' : '登 录'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            还没有账户？{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center space-x-1">
              <UserPlus size={16} />
              <span>立即注册</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
