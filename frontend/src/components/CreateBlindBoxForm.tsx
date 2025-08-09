import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import ImageUpload from './ImageUpload';

interface BlindBoxItem {
  name: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  probability: number;
  image?: string;
}

interface CreateBlindBoxFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateBlindBoxForm: React.FC<CreateBlindBoxFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });
  const [items, setItems] = useState<BlindBoxItem[]>([
    { name: '', rarity: 'N' as const, probability: 0, image: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const rarityOptions = [
    { value: 'N', label: 'N (普通)', color: 'from-gray-400 to-gray-500' },
    { value: 'R', label: 'R (稀有)', color: 'from-blue-400 to-blue-500' },
    { value: 'SR', label: 'SR (超稀有)', color: 'from-purple-400 to-purple-500' },
    { value: 'SSR', label: 'SSR (传说)', color: 'from-amber-400 to-amber-500' },
  ];

  const addItem = () => {
    setItems(prev => [...prev, { name: '', rarity: 'N', probability: 0, image: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof BlindBoxItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert('请填写所有必填字段');
      return;
    }

    const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
    if (Math.abs(totalProbability - 100) > 0.01) {
      alert('物品概率总和必须为100%');
      return;
    }

    if (items.some(item => !item.name)) {
      alert('请填写所有物品名称');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        items: items.map(item => ({
          name: item.name,
          rarity: item.rarity,
          probability: item.probability,
          image: item.image || undefined,
        })),
      };

      const result = await adminAPI.createBlindBox(data);
      if (result.success) {
        alert('盲盒创建成功！');
        onSuccess();
      } else {
        alert(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建失败:', error);
      alert('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
  const isValidProbability = Math.abs(totalProbability - 100) <= 0.01;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-white/20">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                创建新盲盒
              </h2>
              <p className="text-gray-600 mt-2">设计一个全新的盲盒产品</p>
            </div>
            <button
              onClick={onCancel}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                基本信息
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    盲盒名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="给你的盲盒起一个吸引人的名字"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    价格 (¥) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="设定一个合理的价格"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    分类 *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="例如：动漫、游戏、手办等"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    盲盒封面图片
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                    placeholder="点击或拖拽上传盲盒封面图片"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="详细描述这个盲盒的特色和吸引力..."
                  required
                />
              </div>
            </div>

            {/* 物品列表 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  盲盒物品设计
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  添加物品
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">物品设计</span>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          物品名称 *
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="物品名称"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          稀有度 *
                        </label>
                        <select
                          value={item.rarity}
                          onChange={(e) => updateItem(index, 'rarity', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          {rarityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          概率 (%) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.probability}
                          onChange={(e) => updateItem(index, 'probability', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="概率"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          物品图片
                        </label>
                        <ImageUpload
                          value={item.image || ''}
                          onChange={(imageUrl) => {
                            setItems(prev => prev.map((prevItem, i) => 
                              i === index ? { ...prevItem, image: imageUrl } : prevItem
                            ));
                          }}
                          placeholder="上传物品图片"
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/60 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">概率总和:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${isValidProbability ? 'text-green-600' : 'text-red-600'}`}>
                      {totalProbability.toFixed(2)}%
                    </span>
                    {isValidProbability ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {!isValidProbability && (
                  <p className="text-sm text-red-600 mt-2">概率总和必须为100%</p>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || !isValidProbability}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>创建中...</span>
                  </div>
                ) : (
                  '创建盲盒'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlindBoxForm;
