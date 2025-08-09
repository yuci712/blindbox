import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Send, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { getPlayerShows, likePlayerShow, createPlayerShow, getComments, createComment, deletePlayerShow } from '../services/playerShowService';
import type { PlayerShow as PlayerShowType, Comment } from '../types';

const PlayerShow: React.FC = () => {
  const [shows, setShows] = useState<PlayerShowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<{[key: number]: Comment[]}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [newComments, setNewComments] = useState<{[key: number]: string}>({});
  
  // 获取当前用户信息
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';

  const fetchShows = async () => {
    try {
      const response = await getPlayerShows();
      if (response && response.success && Array.isArray(response.data)) {
        setShows(response.data);
      } else {
        setShows([]);
      }
    } catch (error) {
      console.error('获取玩家秀失败:', error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComments = async (showId: number) => {
    if (!showComments[showId]) {
      // 首次打开评论，加载评论
      try {
        const commentsResponse = await getComments(showId);
        if (commentsResponse.success) {
          setComments(prev => ({
            ...prev,
            [showId]: commentsResponse.data || []
          }));
        }
      } catch (error) {
        console.error('获取评论失败:', error);
      }
    }
    setShowComments(prev => ({
      ...prev,
      [showId]: !prev[showId]
    }));
  };

  const handleCreateComment = async (showId: number) => {
    const content = newComments[showId]?.trim();
    if (!content) {
      alert('评论内容不能为空');
      return;
    }

    try {
      const response = await createComment({ playerShowId: showId, content });
      if (response.success) {
        // 更新评论列表
        setComments(prev => ({
          ...prev,
          [showId]: [response.data, ...(prev[showId] || [])]
        }));
        
        // 更新玩家秀的评论数量
        setShows(prevShows =>
          prevShows.map(show =>
            show.id === showId 
              ? { ...show, commentCount: (show.commentCount || 0) + 1 }
              : show
          )
        );
        
        // 清空输入框
        setNewComments(prev => ({
          ...prev,
          [showId]: ''
        }));
        alert('评论成功！');
      } else {
        alert('评论失败：' + response.message);
      }
    } catch (error) {
      console.error('评论失败:', error);
      alert('评论失败，请重试');
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条玩家秀吗？此操作不可撤销。')) return;
    
    try {
      const result = await deletePlayerShow(id);
      if (result.success) {
        setShows(prevShows => prevShows.filter(show => show.id !== id));
        alert('删除成功！');
      } else {
        alert('删除失败：' + result.message);
      }
    } catch (error) {
      console.error('删除玩家秀失败:', error);
      alert('删除失败，请重试');
    }
  };

  const handleLike = async (id: number) => {
    try {
      await likePlayerShow(id);
      setShows(prevShows =>
        prevShows.map(show =>
          show.id === id ? { ...show, likes: show.likes + 1 } : show
        )
      );
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      alert('内容不能为空');
      return;
    }

    console.log('发布内容:', newContent.trim());
    console.log('是否有图片:', !!newImage);

    try {
      console.log('开始发布玩家秀...');
      
      let imageUrl = null;
      
      // 如果有图片，先上传图片
      if (newImage) {
        try {
          console.log('开始上传图片...');
          const formData = new FormData();
          formData.append('file', newImage);
          
          const uploadResponse = await fetch('http://127.0.0.1:7001/api/upload/image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          
          const uploadResult = await uploadResponse.json();
          console.log('图片上传结果:', uploadResult);
          
          if (uploadResult.success) {
            imageUrl = uploadResult.data.imageUrl;
            console.log('图片上传成功:', imageUrl);
          } else {
            throw new Error(uploadResult.message || '图片上传失败');
          }
        } catch (uploadError) {
          console.error('图片上传失败:', uploadError);
          const errorMsg = uploadError instanceof Error ? uploadError.message : '图片上传失败';
          alert(`图片上传失败: ${errorMsg}`);
          return;
        }
      }
      
      // 创建玩家秀
      const showData = {
        content: newContent.trim(),
        ...(imageUrl && { imageUrl })
      };
      
      const response = await createPlayerShow(showData);
      console.log('发布响应:', response);
      
      if (response && response.success && response.data) {
        console.log('发布成功!');
        // 确保新发布的内容包含 commentCount
        const newShow = { ...response.data, commentCount: 0 };
        setShows([newShow, ...shows]);
        setShowCreate(false);
        setNewContent('');
        setNewImage(null);
        alert('发布成功！');
        // 重新获取列表以确保数据同步
        await fetchShows();
      } else {
        console.error('发布失败:', response?.message || '未知错误');
        alert(response?.message || '发布失败，请重试');
      }
    } catch (error) {
      console.error('创建玩家秀失败:', error);
      alert('网络错误，请检查连接后重试');
    }
  };

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          ✨ 玩家秀 ✨
        </h1>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          发布新帖
        </button>
      </motion.div>

      {showCreate && (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <form onSubmit={handleCreateShow}>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="分享你的好物..."
              className="w-full p-2 border rounded-md"
              rows={4}
            />
            <div className="flex justify-between items-center mt-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center text-gray-500 hover:text-blue-500">
                <ImageIcon size={20} className="mr-2" />
                {newImage ? newImage.name : '添加图片'}
              </button>
              <input type="file" ref={fileInputRef} onChange={(e) => setNewImage(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">发布</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={show.user?.avatar ? `http://127.0.0.1:7001${show.user.avatar}?v=${Date.now()}` : '/images/default-avatar.svg'} 
                  alt={show.user?.username} 
                  className="w-10 h-10 rounded-full mr-4"
                  onError={(e) => {
                    console.error('头像加载失败:', show.user?.avatar);
                    (e.target as HTMLImageElement).src = '/images/default-avatar.svg';
                  }}
                  onLoad={() => {
                    console.log('✅ 头像加载成功:', show.user?.avatar);
                  }}
                />
                <span className="font-semibold text-gray-700">{show.user?.username || '匿名用户'}</span>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(show.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="删除该玩家秀"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            {show.imageUrl && (
              <div>
                <img 
                  src={show.imageUrl} 
                  alt={show.content} 
                  className="w-full h-64 object-cover"
                  onLoad={() => {
                    console.log('✅ 图片加载成功:', show.imageUrl);
                  }}
                  onError={(e) => {
                    console.error('❌ 图片加载失败:', show.imageUrl);
                    console.log('错误事件:', e);
                    console.log('图片元素:', e.target);
                    // 尝试显示替代内容
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500';
                    errorDiv.textContent = '图片加载失败: ' + show.imageUrl;
                    target.parentNode?.insertBefore(errorDiv, target);
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-600 mb-4">{show.content}</p>
              <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(show.id)} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                    <span>{show.likes}</span>
                  </button>
                  <button
                    onClick={() => handleToggleComments(show.id)}
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  >
                    <MessageSquare size={20} />
                    <span>评论 {show.commentCount || 0}</span>
                  </button>
                </div>
                <span className="text-sm">{new Date(show.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="添加评论..."
                  value={newComments[show.id] || ''}
                  onChange={(e) => setNewComments(prev => ({
                    ...prev,
                    [show.id]: e.target.value
                  }))}
                  className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateComment(show.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleCreateComment(show.id)}
                  className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
              {showComments[show.id] && (
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                  {comments[show.id]?.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.user?.avatar ? `http://127.0.0.1:7001${comment.user.avatar}?v=${Date.now()}` : '/images/default-avatar.svg'}
                        alt={comment.user?.username}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          console.error('评论头像加载失败:', comment.user?.avatar);
                          (e.target as HTMLImageElement).src = '/images/default-avatar.svg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-gray-700">
                            {comment.user?.username || '匿名用户'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {!comments[show.id]?.length && (
                    <p className="text-gray-500 text-center py-4">暂无评论，来做第一个评论的人吧~</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlayerShow;
