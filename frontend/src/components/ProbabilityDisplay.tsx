import { useState } from 'react';
import { PieChart, Info, TrendingUp } from 'lucide-react';

interface RarityProbability {
  rarity: string;
  probability: number;
  color: string;
  description: string;
}

interface ProbabilityDisplayProps {
  blindBoxId: number;
}

const ProbabilityDisplay = ({ blindBoxId }: ProbabilityDisplayProps) => {
  // blindBoxId would be used to fetch real probability data from API
  void blindBoxId;
  const [showDetails, setShowDetails] = useState(false);
  
  // 模拟概率数据
  const probabilities: RarityProbability[] = [
    {
      rarity: '普通',
      probability: 60,
      color: '#9CA3AF',
      description: '基础款式，数量较多'
    },
    {
      rarity: '稀有',
      probability: 25,
      color: '#3B82F6',
      description: '特殊设计，收藏价值较高'
    },
    {
      rarity: '史诗',
      probability: 12,
      color: '#8B5CF6',
      description: '限量制作，精美工艺'
    },
    {
      rarity: '传说',
      probability: 3,
      color: '#F59E0B',
      description: '极其稀有，收藏珍品'
    }
  ];

  const totalDraws = 1000; // 模拟总抽取次数

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
          抽取概率
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Info className="h-4 w-4 mr-1" />
          {showDetails ? '隐藏详情' : '查看详情'}
        </button>
      </div>

      {/* 概率条形图 */}
      <div className="space-y-3 mb-4">
        {probabilities.map((item) => (
          <div key={item.rarity} className="flex items-center">
            <div className="w-16 text-sm font-medium text-gray-700">
              {item.rarity}
            </div>
            <div className="flex-1 mx-3">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.probability}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">
              {item.probability}%
            </div>
          </div>
        ))}
      </div>

      {/* 详细信息 */}
      {showDetails && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            稀有度说明
          </h4>
          <div className="space-y-2">
            {probabilities.map((item) => (
              <div key={item.rarity} className="flex items-start">
                <div
                  className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="font-medium text-gray-900">{item.rarity}</span>
                  <span className="text-gray-600 ml-2">
                    ({item.probability}%) - {item.description}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    预计 {totalDraws} 次抽取中约有 {Math.round(totalDraws * item.probability / 100)} 个
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>温馨提示：</strong>
              以上概率仅供参考，实际抽取结果具有随机性。每次抽取都是独立的，过往结果不会影响未来概率。
              请理性消费，适度游戏。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilityDisplay;
