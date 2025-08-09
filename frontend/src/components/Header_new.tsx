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
  onSearch: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSearch, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                盲盒世界
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索你想要的盲盒..."
                className="w-full px-6 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                搜索
              </button>
            </form>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                首页
              </Link>
              <Link
                to="/showcase"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                玩家展示
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 5h5.5l1.5 6L8.5 5H14l-1.5 6L14 5h5.5l-2 11H5z"/>
                  </svg>
                  <span>管理后台</span>
                </Link>
              )}
            </nav>

            {/* User Section */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.nickname || user.username}
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.nickname || user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>个人资料</span>
                      </Link>
                      
                      <Link
                        to="/collection"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>我的收藏</span>
                      </Link>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>数据面板</span>
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-amber-600 hover:bg-amber-50 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16L3 5h5.5l1.5 6L8.5 5H14l-1.5 6L14 5h5.5l-2 11H5z"/>
                          </svg>
                          <span>管理后台</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
          <div className="md:hidden py-4 border-t border-gray-200/50">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索你想要的盲盒..."
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                to="/showcase"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                玩家展示
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理后台
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
