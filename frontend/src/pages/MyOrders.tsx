import { useState, useEffect, useCallback } from 'react';
import { orderAPI, type Order, type BlindBox, type User } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { getFullImageUrl } from '../utils/imageUtils';

interface OrderWithDetails extends Order {
  blindBox?: BlindBox;
  user?: User;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
      canCancel: boolean;
    }> = {
      pending: { 
        icon: Clock, 
        text: '待处理', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100',
        canCancel: true 
      },
      completed: { 
        icon: CheckCircle, 
        text: '已完成', 
        color: 'text-green-600', 
        bg: 'bg-green-100',
        canCancel: false 
      },
      cancelled: { 
        icon: XCircle, 
        text: '已取消', 
        color: 'text-red-600', 
        bg: 'bg-red-100',
        canCancel: false 
      },
    };
    return configs[status] || configs.pending;
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await orderAPI.getUserOrders(currentPage, 10, statusFilter);
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
  }, [currentPage, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('确定要取消这个订单吗？')) return;

    try {
      const result = await orderAPI.updateOrderStatus(orderId, 'cancelled');
      if (result.success) {
        alert('订单已取消');
        loadOrders();
      } else {
        alert('取消订单失败: ' + result.message);
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败');
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题和筛选 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">我的订单</h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                共 {total} 个订单
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-white/20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">暂无订单</h3>
            <p className="text-gray-500">
              {statusFilter ? `没有找到${statusOptions.find(o => o.value === statusFilter)?.label}的订单` : '您还没有任何订单'}
            </p>
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
                        
                        {statusConfig.canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            取消订单
                          </button>
                        )}
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

export default MyOrders;
