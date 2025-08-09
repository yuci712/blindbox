import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Users, Package, Star, DollarSign, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalBlindBoxes: number;
  totalDraws: number;
  totalRevenue: number;
  dailyStats: Array<{ date: string; draws: number; revenue: number; newUsers: number }>;
  popularBlindBoxes: Array<{
    id: number;
    name: string;
    draws: number;
    revenue: number;
  }>;
  rarityStats: Array<{
    rarity: string;
    count: number;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');

  const loadDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminAPI.getDashboardStats({ timeRange });
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        console.error('获取仪表板数据失败:', result.message);
      }
    } catch (error) {
      console.error('加载仪表板数据时出错:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-indigo-600" />
              管理后台数据总览
            </h1>
            <p className="text-gray-600">实时监控业务关键指标</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin/blindboxes"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition"
            >
              <Settings className="h-5 w-5 mr-2" />
              盲盒管理
            </Link>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-8 bg-gray-200 p-1 rounded-lg max-w-xs">
          {(['all', 'month', 'week'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:bg-gray-300'
              }`}
            >
              {range === 'all' ? '全部' : range === 'month' ? '本月' : '本周'}
            </button>
          ))}
        </div>

        {stats ? (
          <>
                    
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/blindboxes"
              className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition group"
            >
              <Settings className="h-8 w-8 text-indigo-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-indigo-900">盲盒管理</h3>
                <p className="text-sm text-indigo-600">管理所有盲盒商品</p>
              </div>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
            >
              <Package className="h-8 w-8 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-orange-900">订单管理</h3>
                <p className="text-sm text-orange-600">管理所有订单记录</p>
              </div>
            </Link>
            <div 
              onClick={() => window.location.href = '/admin/blindboxes'}
              className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group cursor-pointer"
            >
              <Plus className="h-8 w-8 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-green-900">创建盲盒</h3>
                <p className="text-sm text-green-600">添加新的盲盒商品</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
            >
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-purple-900">前往商城</h3>
                <p className="text-sm text-purple-600">查看用户界面</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">总用户数</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">总收入</p>
                    <p className="text-3xl font-bold text-gray-900">¥{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">总抽取次数</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDraws.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">盲盒种类</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBlindBoxes}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">无法加载数据统计信息。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
