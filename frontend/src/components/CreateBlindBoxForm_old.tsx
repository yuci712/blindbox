import React, { useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { adminAPI } from '../services/api';

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
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rarityOptions = [
    { value: 'N', label: 'N (普通)', color: 'text-gray-600' },
    { value: 'R', label: 'R (稀有)', color: 'text-blue-600' },
    { value: 'SR', label: 'SR (超稀有)', color: 'text-purple-600' },
    { value: 'SSR', label: 'SSR (传说)', color: 'text-red-600' },
  ];

  const handleImageUpload = async (file: File, isMainImage = true, itemIndex?: number) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await adminAPI.uploadImage(file);
      if (result.success && result.data?.imageUrl) {
        if (isMainImage) {
          setFormData(prev => ({ ...prev, image: result.data!.imageUrl }));
        } else if (itemIndex !== undefined) {
          setItems(prev => prev.map((item, i) => 
            i === itemIndex ? { ...item, image: result.data!.imageUrl } : item
          ));
        }
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">创建新盲盒</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  盲盒名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  价格 (¥) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="例如：动漫、游戏、手办等"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  盲盒封面图片
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, true);
                    }}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? '上传中...' : '上传图片'}
                  </label>
                  {formData.image && (
                    <img src={formData.image} alt="预览" className="w-16 h-16 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* 物品列表 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">盲盒物品</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加物品
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-700">物品 {index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        物品名称 *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        稀有度 *
                      </label>
                      <select
                        value={item.rarity}
                        onChange={(e) => updateItem(index, 'rarity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        概率 (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.probability}
                        onChange={(e) => updateItem(index, 'probability', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        物品图片
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, false, index);
                          }}
                          className="hidden"
                          id={`item-image-upload-${index}`}
                        />
                        <label
                          htmlFor={`item-image-upload-${index}`}
                          className="flex items-center px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 cursor-pointer"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          上传
                        </label>
                        {item.image && (
                          <img src={item.image} alt="预览" className="w-8 h-8 object-cover rounded" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-sm text-gray-600">
                概率总和: {items.reduce((sum, item) => sum + item.probability, 0).toFixed(2)}%
                {Math.abs(items.reduce((sum, item) => sum + item.probability, 0) - 100) > 0.01 && (
                  <span className="text-red-500 ml-2">（必须为100%）</span>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
              >
                {submitting ? '创建中...' : '创建盲盒'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlindBoxForm;
