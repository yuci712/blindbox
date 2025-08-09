import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import type { BlindBoxItem } from '../services/api';

interface DrawResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BlindBoxItem | null;
}

const rarityStyles = {
  N: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-300', shadow: 'shadow-gray-400/50' },
  R: { bg: 'bg-blue-200', text: 'text-blue-800', border: 'border-blue-400', shadow: 'shadow-blue-500/50' },
  SR: { bg: 'bg-purple-300', text: 'text-purple-900', border: 'border-purple-500', shadow: 'shadow-purple-600/50' },
  SSR: { bg: 'bg-yellow-300', text: 'text-yellow-900', border: 'border-yellow-500', shadow: 'shadow-yellow-500/50' },
};

const cardVariants = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180 },
};

const DrawResultModal = ({ isOpen, onClose, item }: DrawResultModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset flip state when modal opens
      setIsFlipped(false);
      // Flip the card after a short delay
      const timer = setTimeout(() => setIsFlipped(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!item) return null;

  const style = rarityStyles[item.rarity as keyof typeof rarityStyles] || rarityStyles.N;
  
  // 生成更好的图片URL
  const getItemImage = (item: BlindBoxItem) => {
    if (item.image && item.image.startsWith('http')) {
      return item.image;
    }
    
    // 基于物品名称和稀有度生成占位图
    const colors = {
      'SSR': 'ffd700', // 金色
      'SR': '9966cc',  // 紫色  
      'R': '4169e1',   // 蓝色
      'N': '808080'    // 灰色
    };
    
    const color = colors[item.rarity as keyof typeof colors] || '808080';
    const name = encodeURIComponent(item.name);
    return `https://via.placeholder.com/200x200/${color}/ffffff?text=${name}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          {/* 庆祝粒子效果 */}
          {isFlipped && (
            <>
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      opacity: 0,
                      scale: 0 
                    }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3
                    }}
                  />
                ))}
              </div>
            </>
          )}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ perspective: '1000px' }}>
              <motion.div
                className="relative w-full h-96"
                variants={cardVariants}
                initial="initial"
                animate={isFlipped ? "flipped" : "initial"}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Front (Unopened) */}
                <div className="absolute w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white p-8 border-4 border-white" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="animate-bounce">
                    <Gift size={80} className="drop-shadow-lg" />
                  </div>
                  <h2 className="text-2xl font-bold mt-4 drop-shadow-lg animate-pulse">正在揭晓...</h2>
                  <div className="mt-4 flex space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                {/* Card Back (Revealed Item) */}
                <div className={`absolute w-full h-full ${style.bg} rounded-2xl shadow-2xl flex flex-col items-center justify-between p-6 border-4 ${style.border} ${style.shadow} relative overflow-hidden`} style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                  
                  {/* 稀有度标签 */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-lg font-bold ${style.text} border-2 ${style.border} bg-white/90 backdrop-blur-sm shadow-lg z-10`}>
                    {item.rarity}
                  </div>
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <img 
                      src={getItemImage(item)} 
                      alt={item.name} 
                      className="w-40 h-40 object-contain mb-4 rounded-lg shadow-lg border-2 border-white"
                      onError={(e) => {
                        // 如果图片加载失败，显示emoji备用方案
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    
                    {/* 备用emoji图标 */}
                    <div className={`w-40 h-40 flex items-center justify-center text-8xl mb-4 rounded-lg border-2 ${style.border} hidden bg-white/20 backdrop-blur-sm`}>
                      {item.rarity === 'SSR' ? '🌟' : 
                       item.rarity === 'SR' ? '💎' : 
                       item.rarity === 'R' ? '🎁' : '🎭'}
                    </div>
                    
                    <h3 className={`text-3xl font-black ${style.text} mb-2 drop-shadow-lg`}>{item.name}</h3>
                    <p className={`text-lg font-semibold ${style.text} opacity-90 drop-shadow-md`}>
                      {item.rarity === 'SSR' ? '✨ 传说级' : 
                       item.rarity === 'SR' ? '💜 史诗级' : 
                       item.rarity === 'R' ? '💙 稀有级' : '🤍 普通级'}
                    </p>
                  </div>
                  
                  {/* 底部信息 */}
                  <div className="relative z-10 text-center">
                    <p className={`text-sm font-medium ${style.text} opacity-80 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2`}>
                      出现概率: {(item.probability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.button 
              onClick={onClose} 
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-xl text-gray-700 hover:bg-gray-100 transition-colors z-20 border-2 border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawResultModal;
