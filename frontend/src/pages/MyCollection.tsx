import { useState, useEffect, useMemo } from 'react';
import { blindBoxAPI } from '../services/api';
import type { UserBlindBox } from '../services/api';
import { User, Grid, List, Star, Crown, Gift, Sparkles } from 'lucide-react';

type FilterType = 'all' | 'N' | 'R' | 'SR' | 'SSR';
type ViewMode = 'grid' | 'list';

const MyCollection = () => {
  const [collection, setCollection] = useState<UserBlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const user = localStorage.getItem('user');
      
      if (!user) {
        setIsLoggedIn(false);
        setError('用户未登录');
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      
      const result = await blindBoxAPI.getUserBlindBoxes(userData.id);
      
      if (result.success && result.data) {
        setCollection(result.data);
        setError(null);
      } else {
        setError(result.message || '获取收藏数据失败');
      }
    } catch (error) {
      console.error('MyCollection: 获取收藏失败:', error);
      setError(error instanceof Error ? error.message : '获取收藏数据时发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 过滤收藏数据
  const filteredCollection = useMemo(() => {
    if (filter === 'all') return collection;
    return collection.filter(item => item.item.rarity === filter);
  }, [collection, filter]);

  // 按稀有度分组统计
  const rarityStats = useMemo(() => {
    const stats = collection.reduce((acc, item) => {
      const rarity = item.item.rarity;
      acc[rarity] = (acc[rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { rarity: 'SSR', count: stats['SSR'] || 0, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
      { rarity: 'SR', count: stats['SR'] || 0, color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
      { rarity: 'R', count: stats['R'] || 0, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
      { rarity: 'N', count: stats['N'] || 0, color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    ];
  }, [collection]);

  // 稀有度配置
  const getRarityConfig = (rarity: string) => {
    const configs = {
      'SSR': { 
        icon: Crown, 
        emoji: '👑', 
        color: 'text-yellow-600', 
        bgGradient: 'from-yellow-400/20 to-orange-500/20',
        borderColor: 'border-yellow-400/50',
        glowColor: 'shadow-yellow-500/25'
      },
      'SR': { 
        icon: Sparkles, 
        emoji: '✨', 
        color: 'text-purple-600', 
        bgGradient: 'from-purple-400/20 to-pink-500/20',
        borderColor: 'border-purple-400/50',
        glowColor: 'shadow-purple-500/25'
      },
      'R': { 
        icon: Star, 
        emoji: '🌟', 
        color: 'text-blue-600', 
        bgGradient: 'from-blue-400/20 to-cyan-500/20',
        borderColor: 'border-blue-400/50',
        glowColor: 'shadow-blue-500/25'
      },
      'N': { 
        icon: Gift, 
        emoji: '🎁', 
        color: 'text-gray-600', 
        bgGradient: 'from-gray-400/20 to-slate-500/20',
        borderColor: 'border-gray-400/50',
        glowColor: 'shadow-gray-500/25'
      }
    };
    return configs[rarity as keyof typeof configs] || configs.N;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
              ✨ 我的收藏 ✨
            </h1>
            <p className="text-gray-600 text-lg font-medium">珍藏你的每一份美好回忆</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-indigo-600 mb-2">{collection.length}</div>
              <div className="text-sm font-medium text-gray-600">总收藏</div>
            </div>
            {rarityStats.map((stat) => (
              <div 
                key={stat.rarity}
                className={`${stat.bgColor} rounded-2xl p-6 text-center shadow-lg border ${stat.borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer ${filter === stat.rarity ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                onClick={() => setFilter(stat.rarity as FilterType)}
              >
                <div className={`text-3xl font-black ${stat.color} mb-2`}>{stat.count}</div>
                <div className={`text-sm font-medium ${stat.color}`}>{stat.rarity}</div>
              </div>
            ))}
          </div>

          {/* 过滤器和视图控制 */}
          <div className="flex flex-wrap justify-between items-center mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                }`}
              >
                全部 ({collection.length})
              </button>
              {rarityStats.map((stat) => (
                <button
                  key={stat.rarity}
                  onClick={() => setFilter(stat.rarity as FilterType)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    filter === stat.rarity
                      ? `${stat.color} bg-white shadow-lg border-2 ${stat.borderColor}`
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {stat.rarity} ({stat.count})
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* 收藏展示 */}
          {filteredCollection.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredCollection.map((item) => {
                  const config = getRarityConfig(item.item.rarity);
                  return (
                    <div 
                      key={item.id} 
                      className={`
                        relative group bg-gradient-to-br ${config.bgGradient} backdrop-blur-md rounded-2xl p-4 border-2 ${config.borderColor}
                        transition-all duration-300 hover:scale-105 hover:${config.glowColor} hover:shadow-2xl
                        flex flex-col items-center text-center
                      `}
                    >
                      {/* 稀有度标签 */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-full border-2 ${config.borderColor} flex items-center justify-center text-xs font-bold shadow-lg`}>
                        {config.emoji}
                      </div>
                      
                      {/* 物品图片 */}
                      <div className="w-20 h-20 mb-3 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-xl blur-sm opacity-50`}></div>
                        <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                          {item.item.image ? (
                            <img src={item.item.image} alt={item.item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="text-3xl">{config.emoji}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* 物品信息 */}
                      <h3 className="font-bold text-gray-800 text-sm mb-2 leading-tight">{item.item.name}</h3>
                      
                      {/* 稀有度 */}
                      <div className={`px-2 py-1 text-xs font-bold rounded-full bg-white/60 backdrop-blur-sm border ${config.borderColor} ${config.color} mb-2`}>
                        {item.item.rarity}
                      </div>

                      {/* 获得时间 */}
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(item.obtainedAt).toLocaleDateString()}
                      </div>
                      
                      {/* 盲盒来源 */}
                      <div className="text-xs text-gray-400 mt-1 truncate w-full">
                        来自: {item.blindBox?.name || '未知盲盒'}
                      </div>
                      
                      {/* 悬停效果 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCollection.map((item) => {
                  const config = getRarityConfig(item.item.rarity);
                  return (
                    <div 
                      key={item.id} 
                      className={`
                        bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50
                        hover:shadow-xl transition-all duration-300 flex items-center gap-4
                      `}
                    >
                      {/* 物品图片 */}
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-xl blur-sm opacity-50`}></div>
                        <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                          {item.item.image ? (
                            <img src={item.item.image} alt={item.item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="text-2xl">{config.emoji}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* 物品信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{item.item.name}</h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full bg-white/60 backdrop-blur-sm border ${config.borderColor} ${config.color}`}>
                            {item.item.rarity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          来自: {item.blindBox?.name || '未知盲盒'}
                        </div>
                        <div className="text-xs text-gray-500">
                          获得时间: {new Date(item.obtainedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/50 max-w-md mx-auto">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {filter === 'all' ? '暂无收藏' : `暂无 ${filter} 稀有度收藏`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'all' ? '快去抽取盲盒获得你的第一个收藏吧！' : '试试其他稀有度或去抽取更多盲盒吧！'}
                </p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    查看全部收藏
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCollection;
