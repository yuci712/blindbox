import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const TestCollection = () => {
  console.log('TestCollection: 组件正在渲染');
  
  const [status, setStatus] = useState('加载中...');
  
  useEffect(() => {
    console.log('TestCollection: useEffect 执行');
    
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('TestCollection: 用户数据:', user);
    console.log('TestCollection: Token:', token);
    
    if (!user) {
      setStatus('用户未登录');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setStatus(`用户已登录: ${userData.username} (ID: ${userData.id})`);
      console.log('TestCollection: 用户数据解析成功:', userData);
    } catch (error) {
      setStatus('用户数据解析失败');
      console.error('TestCollection: 用户数据解析错误:', error);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <User size={64} className="mx-auto text-indigo-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">收藏页面测试</h1>
          <p className="text-gray-600 mb-4">状态: {status}</p>
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">调试信息:</h3>
            <p className="text-sm">请查看浏览器控制台获取详细信息</p>
            <p className="text-sm">当前时间: {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCollection;
