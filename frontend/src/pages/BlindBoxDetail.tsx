import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blindBoxAPI } from '../services/api';
import type { BlindBox, BlindBoxItem } from '../services/api';
import { ArrowLeft, Gift, Loader, AlertTriangle } from 'lucide-react';
import DrawResultModal from '../components/DrawResultModal';
import { getFullImageUrl } from '../utils/imageUtils';

const BlindBoxDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blindBox, setBlindBox] = useState<BlindBox | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawResult, setDrawResult] = useState<BlindBoxItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBlindBox(parseInt(id));
    } else {
      setError("无效的商品ID");
      setLoading(false);
    }
  }, [id]);

  const loadBlindBox = async (blindBoxId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await blindBoxAPI.getById(blindBoxId);
      if (result.success && result.data) {
        setBlindBox(result.data);
      } else {
        setError(result.message || '无法加载盲盒详情');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleDraw = async () => {
    if (!blindBox) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login', { state: { from: `/blindbox/${id}` } });
      return;
    }
    const user = JSON.parse(userStr);
    
    console.log('开始抽取，用户:', user, '盲盒ID:', blindBox.id);

    setDrawing(true);
    setError(null);
    try {
      const result = await blindBoxAPI.draw(blindBox.id, user.id);
      console.log('抽取结果:', result);
      
      if (result.success && result.data) {
        setDrawResult(result.data.item);
        setIsModalOpen(true);
      } else {
        setError(result.message || '抽取失败');
      }
    } catch (err) {
      console.error('抽取出错:', err);
      setError(err instanceof Error ? err.message : '抽取失败，请重试');
    } finally {
      setDrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-600">
          <Loader className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-lg">正在加载...</p>
        </div>
      </div>
    );
  }

  if (error && !blindBox) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">出错了</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <ArrowLeft className="mr-2" size={18} />
            返回首页
          </Link>
        </div>
      </div>   
    );
  }

  if (!blindBox) return null; // Should be covered by error state, but as a fallback

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 返回按钮 */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={20} className="mr-2" />
              返回商品列表
            </Link>
          </div>

          {/* 主要内容 */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                
                {/* 左侧图片区域 */}
                <div className="relative p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl transform rotate-6"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                      <img 
                        src={getFullImageUrl(blindBox.image)} 
                        alt={blindBox.name}
                        className="max-w-full h-auto max-h-80 object-contain mx-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* 右侧详情区域 */}
                <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20">
                      {blindBox.category}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                    {blindBox.name}
                  </h1>
                  
                  <p className="text-white/90 mb-8 leading-relaxed text-lg">
                    {blindBox.description}
                  </p>
                  
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-black text-yellow-300 drop-shadow-lg">
                      ¥{blindBox.price.toFixed(2)}
                    </span>
                    <span className="text-white/80 ml-3 text-xl">/ 次</span>
                  </div>

                  {/* 抽取按钮 */}
                  <button
                    onClick={handleDraw}
                    disabled={!blindBox.isActive || drawing}
                    className={`
                      w-full flex items-center justify-center py-6 px-8 rounded-2xl shadow-2xl transform transition-all duration-300 text-xl font-bold
                      ${drawing 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 hover:scale-105 hover:shadow-yellow-500/25 active:scale-95'
                      }
                      disabled:transform-none disabled:shadow-lg
                    `}
                  >
                    {drawing ? (
                      <>
                        <Loader className="animate-spin h-7 w-7 mr-4" />
                        <span className="text-white">🎭 正在揭晓神秘奖品...</span>
                      </>
                    ) : (
                      <>
                        <Gift size={28} className="mr-4 text-white drop-shadow-lg" />
                        <span className="text-white drop-shadow-lg">🎲 立即抽取 - 开启惊喜</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl">
                      <p className="text-red-200 text-center font-medium">⚠️ {error}</p>
                    </div>
                  )}

                  {/* 统计信息 */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-bold text-white">{blindBox.totalSold}</div>
                      <div className="text-white/70 text-sm">已售出</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-bold text-white">{blindBox.items?.length || 0}</div>
                      <div className="text-white/70 text-sm">种类物品</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 奖池展示区域 */}
          {blindBox.items && blindBox.items.length > 0 && (
            <div className="mt-12 max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
                  🏆 神秘奖池
                </h2>
                <p className="text-white/80 text-lg">每一次抽取都可能获得以下精美物品</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {blindBox.items.map((item, index) => {
                  const rarityConfig = {
                    'SSR': { emoji: '🌟', bg: 'from-yellow-400/20 to-orange-500/20', border: 'border-yellow-400/50', glow: 'shadow-yellow-500/25' },
                    'SR': { emoji: '💎', bg: 'from-purple-400/20 to-pink-500/20', border: 'border-purple-400/50', glow: 'shadow-purple-500/25' },
                    'R': { emoji: '🎁', bg: 'from-blue-400/20 to-cyan-500/20', border: 'border-blue-400/50', glow: 'shadow-blue-500/25' },
                    'N': { emoji: '🎭', bg: 'from-gray-400/20 to-slate-500/20', border: 'border-gray-400/50', glow: 'shadow-gray-500/25' }
                  };
                  
                  const config = rarityConfig[item.rarity as keyof typeof rarityConfig] || rarityConfig.N;
                  
                  return (
                    <div 
                      key={index} 
                      className={`
                        relative group p-4 rounded-2xl bg-gradient-to-br ${config.bg} backdrop-blur-md border-2 ${config.border}
                        transition-all duration-300 hover:scale-105 hover:${config.glow} hover:shadow-2xl
                        flex flex-col items-center text-center
                      `}
                    >
                      {/* 稀有度标签 */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${config.bg} backdrop-blur-sm rounded-full border-2 ${config.border} flex items-center justify-center text-xs font-bold shadow-lg`}>
                        {config.emoji}
                      </div>
                      
                      {/* 物品图片 */}
                      <div className="w-20 h-20 mb-3 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} rounded-xl blur-sm opacity-50`}></div>
                        <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <div className="text-3xl">{config.emoji}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* 物品名称 */}
                      <h3 className="font-bold text-white text-sm mb-2 leading-tight">{item.name}</h3>
                      
                      {/* 稀有度和概率 */}
                      <div className="w-full space-y-1">
                        <div className={`px-2 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-sm border ${config.border} text-white`}>
                          {item.rarity}
                        </div>
                        <div className="text-xs text-white/80 font-medium">
                          {(item.probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      {/* 悬停效果 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* 概率说明 */}
              <div className="mt-8 text-center">
                <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                  <p className="text-white/90 text-sm">
                    ✨ 每次抽取都是独立随机，祝您好运！
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DrawResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={drawResult}
      />
    </>
  );
};

export default BlindBoxDetail;
