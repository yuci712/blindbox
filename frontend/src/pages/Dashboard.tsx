import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blindBoxAPI } from '../services/api';
import type { BlindBox } from '../types';
import { Search, X } from 'lucide-react';
import { getFullImageUrl } from '../utils/imageUtils';

const Dashboard = () => {
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<BlindBox[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchBlindBoxes = async () => {
      setLoading(true);
      try {
        const response = await blindBoxAPI.getAll(1, 50); // 获取前50个盲盒
        if (response.success && response.data) {
          setBlindBoxes(response.data?.items || []);
          setFilteredBoxes(response.data?.items || []);
        } else {
          setError('获取盲盒失败');
        }
      } catch (err) {
        setError('网络连接失败');
        console.error('获取盲盒失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlindBoxes();
  }, []);

  // 处理来自Header搜索框的URL参数
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const filtered = blindBoxes.filter(box =>
      box.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.series?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBoxes(filtered);
  }, [searchTerm, blindBoxes]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg font-semibold mb-2">出错了！</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">盲盒商城</h1>
          <p className="text-lg text-gray-500">发现、抽取、收藏你的最爱</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索盲盒名称或系列..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blind Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBoxes.length > 0 ? (
            filteredBoxes.map((box) => (
              <Link to={`/blindbox/${box.id}`} key={box.id} className="group block bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
                  {box.image ? (
                    <img
                      src={getFullImageUrl(box.image)}
                      alt={box.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">暂无图片</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">{box.name || '未命名盲盒'}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{box.description || '暂无描述'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">¥{box.price || 0}</span>
                    <span className="text-sm text-gray-500">{box.series || '默认系列'}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                <p className="text-xl text-gray-500 mb-4">没有找到匹配的盲盒</p>
                <p className="text-gray-400">尝试使用不同的搜索条件</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
