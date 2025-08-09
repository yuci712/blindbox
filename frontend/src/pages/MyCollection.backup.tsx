import { useState, useEffect } from 'react';
import { blindBoxAPI } from '../services/api';
import type { UserBlindBox } from '../services/api';
import { Grid, List, Search, Filter, Star, Calendar, Trophy, ArrowUpDown, User } from 'lucide-react';

const MyCollection = () => {
  const [collection, setCollection] = useState<UserBlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rarity'>('date');
  const [filterRarity, setFilterRarity] = useState<string>('all');

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

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ssr': return 'text-red-600 bg-red-100';
      case 'sr': return 'text-purple-600 bg-purple-100';
      case 'r': return 'text-blue-600 bg-blue-100';
      case 'n': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ssr': return '超稀有';
      case 'sr': return '稀有';
      case 'r': return '普通';
      case 'n': return '常见';
      default: return rarity;
    }
  };

  const filteredAndSortedCollection = collection
    .filter(item => {
      const matchesSearch = item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.blindBox.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = filterRarity === 'all' || item.item.rarity.toLowerCase() === filterRarity.toLowerCase();
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.item.name.localeCompare(b.item.name);
        case 'rarity': {
          const rarityOrder = { 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 };
          return (rarityOrder[b.item.rarity as keyof typeof rarityOrder] || 0) - 
                 (rarityOrder[a.item.rarity as keyof typeof rarityOrder] || 0);
        }
        case 'date':
        default:
          return new Date(b.obtainedAt).getTime() - new Date(a.obtainedAt).getTime();
      }
    });

  const stats = {
    total: collection.length,
    ssr: collection.filter(item => item.item.rarity === 'SSR').length,
    sr: collection.filter(item => item.item.rarity === 'SR').length,
    r: collection.filter(item => item.item.rarity === 'R').length,
    n: collection.filter(item => item.item.rarity === 'N').length,
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">总数量</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.ssr}</p>
              <p className="text-sm text-gray-600">超稀有</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.sr}</p>
              <p className="text-sm text-gray-600">稀有</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.r}</p>
              <p className="text-sm text-gray-600">普通</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-600">{stats.n}</p>
              <p className="text-sm text-gray-600">常见</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索收藏..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Filter by Rarity */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">全部稀有度</option>
                  <option value="ssr">超稀有</option>
                  <option value="sr">稀有</option>
                  <option value="r">普通</option>
                  <option value="n">常见</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-5 w-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'rarity')}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="date">获得时间</option>
                  <option value="name">名称</option>
                  <option value="rarity">稀有度</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Display */}
        {filteredAndSortedCollection.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无收藏</h3>
            <p className="text-gray-600">开始抽取盲盒，建立你的收藏吧！</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredAndSortedCollection.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {item.item.image ? (
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(item.item.rarity)}`}>
                          {getRarityName(item.item.rarity)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.blindBox.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(item.obtainedAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 mr-4">
                      {item.item.image ? (
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.item.name}</h3>
                          <p className="text-sm text-gray-600">{item.blindBox.name}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(item.obtainedAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(item.item.rarity)}`}>
                          {getRarityName(item.item.rarity)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCollection;
