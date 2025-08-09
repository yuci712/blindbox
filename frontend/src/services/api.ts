import axios from 'axios';

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

const API_BASE_URL = 'http://127.0.0.1:7001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 增加超时时间到30秒
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
api.interceptors.response.use(
  (response) => response, // 返回完整的响应对象，不只是data
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // 处理网络错误 - 更宽泛的条件检查
    if (error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' || 
        error.message.includes('Network Error') ||
        error.message.includes('fetch') ||
        !error.response) {
      const networkError = new Error('网络连接失败，请检查网络或稍后重试');
      networkError.name = 'NetworkError';
      console.error('Network Error Details:', {
        originalError: error,
        code: error.code,
        message: error.message,
        response: error.response
      });
      return Promise.reject(networkError);
    }
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('请求超时，请稍后重试');
      timeoutError.name = 'TimeoutError';
      return Promise.reject(timeoutError);
    }
    
    // 处理CORS错误
    if (error.message.includes('CORS')) {
      const corsError = new Error('跨域请求失败，请检查服务器配置');
      corsError.name = 'CORSError';
      return Promise.reject(corsError);
    }
    
    // 处理服务器错误
    if (error.response?.data?.message) {
      const serverError = new Error(error.response.data.message);
      serverError.name = 'ServerError';
      return Promise.reject(serverError);
    }
    
    // 处理其他HTTP错误
    if (error.response?.status) {
      const httpError = new Error(`服务器错误 (${error.response.status}): ${error.response.statusText}`);
      httpError.name = 'HTTPError';
      return Promise.reject(httpError);
    }
    
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlindBoxItem {
  name: string;
  rarity: string;
  probability: number;
  image?: string;
}

export interface BlindBox {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  items: BlindBoxItem[];
  category: string;
  series: string;
  tags: string[];
  isActive: boolean;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  blindBoxId: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBlindBox {
  id: number;
  userId: number;
  blindBoxId: number;
  item: BlindBoxItem;
  obtainedAt: string;
  blindBox: BlindBox;
}

// 认证相关 API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; role?: string }): Promise<ApiResponse<User>> =>
    api.post('/auth/register', data).then(response => response.data),

  login: (data: { username: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> =>
    api.post('/auth/login', data).then(response => response.data),

  getProfile: (userId: number): Promise<ApiResponse<User>> =>
    api.get(`/auth/profile?userId=${userId}`).then(response => response.data),
};

// 盲盒相关 API
export const blindBoxAPI = {
  getAll: (page = 1, limit = 10, category?: string): Promise<ApiResponse<{ items: BlindBox[]; total: number; page: number; limit: number; totalPages: number }>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (category) {
      params.append('category', category);
    }
    return api.get(`/blindboxes?${params.toString()}`).then(response => response.data);
  },

  getCategories: (): Promise<ApiResponse<string[]>> =>
    api.get('/blindboxes/categories').then(response => response.data),

  getById: (id: number): Promise<ApiResponse<BlindBox>> =>
    api.get(`/blindboxes/${id}`).then(response => response.data),

  search: (keyword: string, page = 1, limit = 10): Promise<ApiResponse<{ items: BlindBox[]; total: number; page: number; limit: number; totalPages: number }>> =>
    api.get(`/blindboxes/search?keyword=${keyword}&page=${page}&limit=${limit}`).then(response => response.data),

  draw: (id: number, userId: number): Promise<ApiResponse<{ item: BlindBoxItem; order: Order }>> => {
    console.log('发送抽取请求:', { blindBoxId: id, userId });
    return api.post(`/blindboxes/draw/${id}`, { userId }).then(response => response.data);
  },

  getUserBlindBoxes: (userId: number): Promise<ApiResponse<UserBlindBox[]>> =>
    api.get(`/blindboxes/user/${userId}`).then(response => response.data),
};

// ... (imports and existing code up to adminAPI)

// 管理员相关 API
export const adminAPI = {
  // 获取仪表板统计数据
  getDashboardStats: (params: { timeRange: 'all' | 'month' | 'week' }): Promise<ApiResponse<DashboardStats>> =>
    api.get('/admin/dashboard-stats', { params }).then(response => response.data),

  // 获取所有盲盒
  getAllBlindBoxes: (): Promise<ApiResponse<{ items: BlindBox[] }>> =>
    api.get('/admin/blindboxes').then(response => response.data),

  // 创建盲盒
  createBlindBox: (data: Partial<BlindBox>): Promise<ApiResponse<BlindBox>> =>
    api.post('/admin/blindboxes', data).then(response => response.data),

  // 更新盲盒
  updateBlindBox: (id: number, data: Partial<BlindBox>): Promise<ApiResponse<BlindBox>> =>
    api.put(`/admin/blindboxes/${id}`, data).then(response => response.data),

  // 删除盲盒
  deleteBlindBox: (id: number): Promise<ApiResponse<null>> =>
    api.delete(`/admin/blindboxes/${id}`).then(response => response.data),

  // 切换盲盒激活状态
  toggleBlindBoxActive: (id: number): Promise<ApiResponse<BlindBox>> =>
    api.patch(`/admin/blindboxes/${id}/toggle`).then(response => response.data),

  // 上传图片
  uploadImage: (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },
};

// 订单相关 API
export const orderAPI = {
  // 获取用户订单列表
  getUserOrders: (page = 1, limit = 10, status?: string): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) {
      params.append('status', status);
    }
    return api.get(`/orders?${params.toString()}`).then(response => response.data);
  },

  // 获取订单详情
  getOrderById: (id: number): Promise<ApiResponse<Order>> =>
    api.get(`/orders/${id}`).then(response => response.data),

  // 用户更新订单状态
  updateOrderStatus: (id: number, status: string): Promise<ApiResponse<Order>> =>
    api.put(`/orders/${id}/status`, { status }).then(response => response.data),
};

// 管理员订单相关 API
export const adminOrderAPI = {
  // 获取所有订单
  getAllOrders: (page = 1, limit = 10, status?: string, userId?: number): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) {
      params.append('status', status);
    }
    if (userId) {
      params.append('userId', userId.toString());
    }
    return api.get(`/admin/orders?${params.toString()}`).then(response => response.data);
  },

  // 管理员更新订单状态
  updateOrderStatus: (id: number, status: string): Promise<ApiResponse<Order>> =>
    api.put(`/admin/orders/${id}/status`, { status }).then(response => response.data),

  // 获取订单统计
  getOrderStats: (): Promise<ApiResponse<{
    totalOrders: number;
    totalRevenue: number;
    statusStats: Array<{ status: string; count: number; totalAmount: number }>;
    recentOrders: Order[];
    popularBlindBoxes: Array<{ id: number; name: string; orderCount: number; revenue: number }>;
  }>> =>
    api.get('/admin/orders/stats').then(response => response.data),

  // 删除订单
  deleteOrder: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/admin/orders/${id}`).then(response => response.data),
};

export default api;
