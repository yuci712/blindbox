import { useState, useEffect } from 'react';
import { blindBoxAPI } from '../services/api';
import type { UserBlindBox } from '../services/api';
import { User } from 'lucide-react';

const MyCollection = () => {
  const [collection, setCollection] = useState<UserBlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    console.log('MyCollection: 开始获取收藏数据');
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('MyCollection: 用户数据:', user);
      console.log('MyCollection: Token存在:', !!token);
      
      if (!user) {
        console.log('MyCollection: 用户未登录');
        setIsLoggedIn(false);
        setError('用户未登录');
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      console.log('MyCollection: 用户ID:', userData.id);
      
      console.log('MyCollection: 调用API获取用户盲盒');
      const result = await blindBoxAPI.getUserBlindBoxes(userData.id);
      console.log('MyCollection: API返回结果:', result);
      
      if (result.success && result.data) {
        setCollection(result.data);
        console.log('MyCollection: 设置收藏数据成功，数量:', result.data.length);
        setError(null);
      } else {
        console.log('MyCollection: API返回失败或无数据:', result);
        setError(result.message || '获取收藏数据失败');
      }
    } catch (error) {
      console.error('MyCollection: 获取收藏失败:', error);
      setError(error instanceof Error ? error.message : '获取收藏数据时发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">加载收藏中...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">请先登录</h2>
            <p className="text-gray-600">需要登录后才能查看收藏</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  if (error && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-2">获取收藏数据时发生错误</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchCollection();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            我的收藏
          </h1>
          <p className="text-gray-600 text-lg">展示你的珍贵收藏</p>
        </div>

        {/* 简化的收藏显示 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">收藏统计</h2>
          <p className="text-lg text-gray-600">总收藏数量: {collection.length}</p>
          
          {collection.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">收藏列表</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collection.slice(0, 6).map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold">{item.item.name}</p>
                    <p className="text-sm text-gray-600">稀有度: {item.item.rarity}</p>
                    <p className="text-sm text-gray-500">
                      获得时间: {new Date(item.obtainedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
              
              {collection.length > 6 && (
                <p className="text-center text-gray-500 mt-4">
                  还有 {collection.length - 6} 个收藏未显示...
                </p>
              )}
            </div>
          )}

          {collection.length === 0 && (
            <div className="text-center py-8">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">暂无收藏</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCollection;
