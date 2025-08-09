import { useState, useEffect, useCallback } from 'react';
import { adminOrderAPI, type Order, type BlindBox, type User } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, RefreshCw, Trash2, Filter, TrendingUp, Users } from 'lucide-react';
import { getFullImageUrl } from '../utils/imageUtils';

interface OrderWithDetails extends Order {
  blindBox?: BlindBox;
  user?: User;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  statusStats: Array<{ status: string; count: number; totalAmount: number }>;
  recentOrders: OrderWithDetails[];
  popularBlindBoxes: Array<{ id: number; name: string; orderCount: number; revenue: number }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showStats, setShowStats] = useState(true);

  const statusOptions = [
    { value: '', label: '全部订单' },
    { value: 'pending', label: '待处理' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, {
      icon: typeof Clock;
      text: string;
      color: string;
      bg: string;
      actionColor: string;
    }> = {
      pending: { 
        icon: Clock, 
        text: '待处理', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100',
        actionColor: 'text-yellow-700'
      },
      completed: { 
        icon: CheckCircle, 
        text: '已完成', 
        color: 'text-green-600', 
        bg: 'bg-green-100',
        actionColor: 'text-green-700'
      },
      cancelled: { 
        icon: XCircle, 
        text: '已取消', 
        color: 'text-red-600', 
        bg: 'bg-red-100',
        actionColor: 'text-red-700'
      },
    };
    return configs[status] || configs.pending;
  };

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      pending: '待处理',
      completed: '已完成',
      cancelled: '已取消',
    };
    return names[status] || status;
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminOrderAPI.getAllOrders(
        currentPage, 
        10, 
        statusFilter, 
        userIdFilter ? parseInt(userIdFilter) : undefined
      );
      if (result.success && result.data) {
        setOrders(result.data.orders);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, userIdFilter]);

  const loadStats = useCallback(async () => {
    try {
      const result = await adminOrderAPI.getOrderStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取订单统计失败:', error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (showStats) {
      loadStats();
    }
  }, [loadStats, showStats]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const result = await adminOrderAPI.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        alert(`订单状态已更新为：${getStatusName(newStatus)}`);
        loadOrders();
        if (showStats) loadStats();
      } else {
        alert('更新失败: ' + result.message);
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert('更新订单状态失败');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('确定要删除这个订单吗？此操作不可撤销。')) return;

    try {
      const result = await adminOrderAPI.deleteOrder(orderId);
      if (result.success) {
        alert('订单已删除');
        loadOrders();
        if (showStats) loadStats();
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除订单失败:', error);
      alert('删除订单失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 标题和控制 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                共 {total} 个订单
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                {showStats ? '隐藏' : '显示'}统计
              </button>
              
              <button
                onClick={() => {
                  loadOrders();
                  if (showStats) loadStats();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>
            </div>
          </div>
          
          {/* 筛选器 */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <input
                type="number"
                placeholder="用户ID"
                value={userIdFilter}
                onChange={(e) => {
                  setUserIdFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* 统计面板 */}
        {showStats && stats && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总订单数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总收入</p>
                  <p className="text-2xl font-bold text-green-600">¥{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            {stats.statusStats.map((stat) => {
              const config = getStatusConfig(stat.status);
              const StatusIcon = config.icon;
              return (
                <div key={stat.status} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{getStatusName(stat.status)}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                      <p className="text-xs text-gray-500">¥{stat.totalAmount.toFixed(2)}</p>
                    </div>
                    <StatusIcon className={`w-8 h-8 ${config.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-white/20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">暂无订单</h3>
            <p className="text-gray-500">没有找到符合条件的订单</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* 订单基本信息 */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* 盲盒图片 */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {order.blindBox?.image ? (
                              <img
                                src={getFullImageUrl(order.blindBox.image)}
                                alt={order.blindBox.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* 订单详情 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                              {order.blindBox?.name || '未知盲盒'}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>订单号: #{order.id}</span>
                              <span>金额: ¥{order.amount}</span>
                              <span>用户: {order.user?.username || `ID:${order.userId}`}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              下单时间: {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 状态和操作 */}
                      <div className="flex flex-col items-end gap-3">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.text}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {/* 状态更新按钮 */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              完成
                            </button>
                          )}
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              取消
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="删除订单"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
