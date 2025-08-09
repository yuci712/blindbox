import { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, Edit3, Camera } from 'lucide-react';
import QuickNavigation from '../components/QuickNavigation';
import { uploadAvatar } from '../services/userService';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now()); // 用于强制刷新头像
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    email: '',
    nickname: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 先尝试从后端获取最新的用户信息
      const response = await fetch('http://127.0.0.1:7001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
          setEditedProfile({ 
            username: result.data.username, 
            email: result.data.email, 
            nickname: result.data.nickname || ''
          });
          // 更新localStorage中的用户信息
          localStorage.setItem('user', JSON.stringify(result.data));
          return;
        }
      }
      
      // 如果API调用失败，回退到localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setProfile(user);
        setEditedProfile({ 
          username: user.username, 
          email: user.email, 
          nickname: user.nickname || ''
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      
      // 错误情况下也回退到localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setProfile(user);
        setEditedProfile({ 
          username: user.username, 
          email: user.email, 
          nickname: user.nickname || ''
        });
      }
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
      console.log('🚀 开始上传头像...');
      const response = await uploadAvatar(file);
      console.log('📡 头像上传响应:', response);
      
      if (response.success) {
        console.log('✅ 头像上传成功，响应数据:', response.data);
        
        // 强制刷新头像显示 - 使用新的时间戳
        const newAvatarKey = Date.now();
        setAvatarKey(newAvatarKey);
        
        // 强制重新获取用户资料
        await fetchProfile();
        
        console.log('✅ 头像更新完成，新的头像URL:', response.data.avatarUrl, '缓存键:', newAvatarKey);
        alert('头像更新成功！');
        
        // 清除文件输入的值以便再次选择
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('❌ 头像上传失败:', response.message);
        alert(response.message || '头像上传失败');
      }
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, ...editedProfile };
      setProfile(updatedProfile);
      setEditMode(false);
      // Update localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.username = editedProfile.username;
        userData.email = editedProfile.email;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">无法加载用户信息</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center space-x-6 mb-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img 
                  src={`http://127.0.0.1:7001${profile.avatar}?v=${avatarKey}`} 
                  alt={profile.username} 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    console.error('头像加载失败，切换到默认头像. URL:', `http://127.0.0.1:7001${profile.avatar}?v=${avatarKey}`);
                    // 尝试使用默认头像，如果还是失败就显示用户名首字母
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/default-avatar.svg') {
                      target.src = '/images/default-avatar.svg';
                    } else {
                      // 如果连默认头像也加载失败，隐藏图片显示用户名首字母
                      target.style.display = 'none';
                      target.parentElement?.appendChild(
                        Object.assign(document.createElement('span'), {
                          className: 'text-2xl font-bold text-gray-600',
                          textContent: profile.username.charAt(0).toUpperCase()
                        })
                      );
                    }
                  }}
                  onLoad={() => {
                    console.log('✅ UserProfile 头像加载成功:', profile.avatar);
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50 ${
                  uploading ? 'animate-spin' : ''
                }`}
                title={uploading ? "上传中..." : "更换头像"}
              >
                {uploading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                    <input
                      type="text"
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      取消
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                  <div className="flex flex-col space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-indigo-500" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <span>加入于 {formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile.role === 'admin' ? '管理员' : '用户'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!editMode && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>编辑</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <QuickNavigation />
      </div>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UserProfile;