import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { User, Mail, Key, Loader, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/login', { 
          state: { message: '注册成功！现在您可以登录了。' },
          replace: true 
        });
      } else {
        setError(result.message || '注册失败，请检查您输入的信息。');
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            创建您的账户
          </h1>
          <p className="text-gray-600">加入我们，开启盲盒之旅！</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="用户名"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="电子邮箱"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="密码 (至少6位)"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="确认密码"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                注册中...
              </>
            ) : (
              '立即注册'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            已经有账户了？{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
              点此登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
