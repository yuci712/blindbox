import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package, User, LogOut, Crown, Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-6">
          
          {/* 左侧 - 登录注册或用户信息 */}
          <div className="flex items-center space-x-1 min-w-0 flex-shrink-0">
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-6 py-2.5 text-gray-700 font-medium hover:text-red-600 transition-colors text-sm"
                >
                  登录
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  注册
                </Link>
              </div>
            ) : (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.nickname || user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{(user.nickname || user.username).charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.nickname || user.username}</p>
                  </div>
                </button>

                {/* 用户下拉菜单 */}
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.nickname || user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        个人资料
                      </Link>
                      
                      <Link 
                        to="/collection" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4 mr-3 text-gray-400" />
                        我的收藏
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Crown className="w-4 h-4 mr-3 text-yellow-500" />
                          管理后台
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 中间 - 搜索区域 */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="搜索你想要的盲盒..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm hover:bg-gray-100 focus:bg-white"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-all"
                >
                  搜索
                </button>
              </div>
            </form>
          </div>

          {/* 右侧 - 导航链接 */}
          <div className="flex items-center space-x-6 min-w-0 flex-shrink-0">
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
              >
                首页
              </Link>
              <Link 
                to="/showcase" 
                className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
              >
                玩家秀
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  我的
                </Link>
              )}
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-6 py-4 space-y-2">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                to="/showcase" 
                className="block py-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                玩家秀
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  我的
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
