import api from './api';

export const getAdminDashboardStats = async (timeRange: 'all' | 'month' | 'week') => {
  const response = await api.get(`/admin/dashboard-stats`, { params: { timeRange } });
  return response.data;
};
