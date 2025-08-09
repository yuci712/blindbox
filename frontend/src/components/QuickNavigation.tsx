import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, User, Trophy, Settings } from 'lucide-react';

const QuickNavigation: React.FC = () => {
  const navigationItems = [
    {
      title: '商城主页',
      description: '浏览所有盲盒商品',
      icon: Home,
      path: '/',
      gradient: 'bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: '我的收藏',
      description: '查看已购买的盲盒',
      icon: Package,
      path: '/collection',
      gradient: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: '玩家秀',
      description: '分享你的收藏',
      icon: Trophy,
      path: '/showcase',
      gradient: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    {
      title: '个人中心',
      description: '管理个人信息',
      icon: User,
      path: '/profile',
      gradient: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <div 
          className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md"
        >
          <Settings className="w-4 h-4 text-white drop-shadow-sm" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">快速导航</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${item.bgColor} p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-md group border border-gray-100`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div 
                  className={`w-12 h-12 ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-200">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* 额外的商城主页强调按钮 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <Link
          to="/"
          className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 group shadow-lg"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm" />
          <span>返回商城主页</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickNavigation;
