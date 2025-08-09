import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadAvatar, getCurrentUser, updateProfile } from '../services/userService.ts';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  nickname: string | null;
}

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser.success) {
        setUser(currentUser.data);
        setNickname(currentUser.data.nickname || '');
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      alert('加载用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('头像文件大小不能超过 2MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAvatar(file);
      if (response.success) {
        setUser(prev => prev ? { ...prev, avatar: response.data.avatarUrl } : null);
        alert('头像更新成功！');
      } else {
        alert(response.message || '头像上传失败');
      }
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await updateProfile({ nickname: nickname.trim() });
      if (response.success) {
        setUser(response.data);
        alert('个人信息更新成功！');
      } else {
        alert(response.message || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <User className="mr-3" size={24} />
              个人资料
            </h1>
          </div>

          <div className="p-8">
            {/* 头像部分 */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  <img
                    src={user?.avatar || '/images/default-avatar.svg'}
                    alt="头像"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
                >
                  <Camera size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">点击相机图标更换头像</p>
              {uploading && <p className="text-blue-600 text-sm mt-1">上传中...</p>}
            </div>

            {/* 用户信息 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={user?.username || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入您的昵称"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="mt-8">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <Save size={18} className="mr-2" />
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
