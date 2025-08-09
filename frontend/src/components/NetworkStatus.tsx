import React, { useState, useEffect } from 'react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 如果页面加载时就是离线状态
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    // 使用健康检查端点进行网络检测
    fetch('http://127.0.0.1:7001/api/health', { method: 'GET' })
      .then(() => {
        setIsOnline(true);
        setShowOfflineMessage(false);
      })
      .catch(() => {
        setIsOnline(false);
        setShowOfflineMessage(true);
      });
  };

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="font-medium">
            {!isOnline ? '网络连接已断开' : '服务器连接失败'}
          </span>
          <span className="text-red-100">
            请检查网络连接或稍后重试
          </span>
        </div>
        <button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md text-sm font-medium transition-colors duration-200"
        >
          重试
        </button>
      </div>
    </div>
  );
};

export default NetworkStatus;
