import api from './api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  nickname: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const uploadAvatar = async (file: File): Promise<ApiResponse<{ avatarUrl: string; message: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/auth/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('头像上传失败:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    // 从token中获取用户ID
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未登录');
    }

    // 解析JWT token获取用户ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;

    const response = await api.get(`/auth/profile?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

export const updateProfile = async (data: { nickname: string }): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await api.put('/auth/profile', data);
    return response.data;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};
