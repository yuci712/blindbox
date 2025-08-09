import api, { type ApiResponse } from './api';
import type { PlayerShow } from '../types';

export const getPlayerShows = async (): Promise<ApiResponse<PlayerShow[]>> => {
  try {
    const response = await api.get('/player-show');
    return response.data;
  } catch (error) {
    console.error('获取玩家秀失败:', error);
    return {
      success: false,
      message: '获取玩家秀失败',
    };
  }
};

export const likePlayerShow = async (id: number): Promise<ApiResponse<{ likes: number }>> => {
  try {
    const response = await api.put(`/player-show/${id}/like`);
    return response.data;
  } catch (error) {
    console.error('点赞失败:', error);
    return {
      success: false,
      message: '点赞失败',
    };
  }
};

export const createPlayerShow = async (data: FormData | { content: string; imageUrl?: string }): Promise<ApiResponse<PlayerShow>> => {
  try {
    console.log('API: 开始发送请求到 /player-show');
    console.log('API: 数据类型:', data instanceof FormData ? 'FormData' : 'JSON');
    
    let requestData;
    let headers = {};
    
    if (data instanceof FormData) {
      // FormData - 让浏览器自动设置 Content-Type
      requestData = data;
      console.log('API: 使用 FormData');
      // 打印 FormData 内容进行调试
      for (const pair of data.entries()) {
        console.log('FormData 内容:', pair[0] + ':', pair[1]);
      }
    } else {
      // JSON data
      requestData = data;
      headers = { 'Content-Type': 'application/json' };
      console.log('API: 使用 JSON:', requestData);
    }
    
    const response = await api.post('/player-show', requestData, { headers });
    
    console.log('API: 收到响应状态:', response.status);
    console.log('API: 收到响应头:', response.headers);
    console.log('API: 收到响应数据:', response.data);
    
    // 检查响应是否存在
    if (!response || response.data === undefined) {
      console.error('API: 响应为空或未定义');
      return {
        success: false,
        message: '服务器响应异常',
      };
    }
    
    // 检查响应是否是HTML（说明代理失败）
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('API: 收到HTML响应，可能是代理问题');
      return {
        success: false,
        message: '服务器连接错误，请检查后端服务是否启动',
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('创建玩家秀API失败:', error);
    const axiosError = error as { response?: { data?: { message?: string }, status?: number }, message?: string };
    console.error('响应数据:', axiosError.response?.data);
    console.error('响应状态:', axiosError.response?.status);
    
    const errorMessage = axiosError.response?.data?.message || axiosError.message || '创建玩家秀失败';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getComments = async (showId: number) => {
  const response = await api.get(`/comments/show/${showId}`);
  return response.data;
};

export const createComment = async (data: { playerShowId: number; content: string }) => {
  const response = await api.post('/comments', data);
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

// 管理员删除玩家秀
export const deletePlayerShow = async (id: number): Promise<ApiResponse<void>> => {
  try {
    console.log('管理员删除玩家秀:', id);
    console.log('请求URL:', `${api.defaults.baseURL}/admin/player-show/${id}`);
    
    const response = await api.delete(`/admin/player-show/${id}`);
    console.log('删除响应:', response);
    return response.data;
  } catch (error: unknown) {
    console.error('删除玩家秀失败:', error);
    const axiosError = error as { 
      message?: string;
      response?: { 
        data?: { message?: string };
        status?: number;
      };
    };
    console.error('错误详情:', {
      message: axiosError.message,
      response: axiosError.response,
      status: axiosError.response?.status
    });
    
    return {
      success: false,
      message: axiosError.response?.data?.message || axiosError.message || '删除玩家秀失败',
    };
  }
};

// 管理员获取所有玩家秀
export const getPlayerShowsForAdmin = async (): Promise<ApiResponse<PlayerShow[]>> => {
  try {
    const response = await api.get('/admin/player-show');
    return response.data;
  } catch (error) {
    console.error('获取管理员玩家秀列表失败:', error);
    return {
      success: false,
      message: '获取玩家秀列表失败',
    };
  }
};
