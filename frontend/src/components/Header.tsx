import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  nickname?: string;
  email?: string; 
  role: string;
  avatar?: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Home Button - Enhanced */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 group hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200"
              title="进入商城"
            >
              <div 
                className="w-8 h-8 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <span className="hidden sm:block font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                进入商城
              </span>
            </Link>
            
            {/* Quick Home Button for Mobile */}
            <Link 
              to="/" 
              className="sm:hidden w-10 h-10 bg-gradient-to-br from-purple-100 via-purple-200 to-blue-200 hover:from-purple-200 hover:via-purple-300 hover:to-blue-300 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
              title="回到首页"
            >
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>

          {/* Center Blessing Message */}
          <div className="hidden md:flex items-center">
            <div className="px-4 py-1.5 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-full border border-purple-100">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                ✨ 愿你今天抽到心仪的盲盒 ✨
              </span>
            </div>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                首页
              </Link>
              <Link to="/showcase" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                玩家秀
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  管理
                </Link>
              )}
            </nav>

            {/* User Section */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.nickname || user.username}
                    </div>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user.nickname || user.username}</div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      个人资料
                    </Link>
                    
                    <Link
                      to="/collection"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的收藏
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的订单
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        管理后台
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  注册
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                to="/showcase"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                玩家秀
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
