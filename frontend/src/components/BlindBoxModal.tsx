import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { BlindBox, BlindBoxItem } from '../services/api';

interface BlindBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (box: Partial<BlindBox>) => void;
  onImageUpload: (file: File) => Promise<{ success: boolean; data?: { imageUrl: string } }>;
  isEditMode: boolean;
  initialData: Partial<BlindBox> | null;
}

export const BlindBoxModal = ({ isOpen, onClose, onSave, onImageUpload, isEditMode, initialData }: BlindBoxModalProps) => {
  const [boxData, setBoxData] = useState<Partial<BlindBox> | null>(initialData);
  const [items, setItems] = useState<BlindBoxItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBoxData(initialData);
    if (initialData && Array.isArray(initialData.items)) {
      setItems(initialData.items.map(item => 
        typeof item === 'string' 
          ? { name: item, rarity: 'N', probability: 25, image: '' }
          : {
              ...item,
              // 智能转换概率格式：
              // 如果值小于0.1，认为是小数格式，乘以100
              // 如果值在0.1-1之间，可能是错误数据，但仍然乘以100
              // 如果值大于1，认为已经是百分比格式，保持不变
              probability: item.probability > 1 ? item.probability : item.probability * 100
            }
      ));
    } else {
      // 如果是创建新盲盒，添加一个默认物品
      if (!isEditMode) {
        setItems([{ name: '', rarity: 'N', probability: 100, image: '' }]);
      } else {
        setItems([]);
      }
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBoxData(prev => prev ? { ...prev, [name]: name === 'price' ? parseFloat(value) : value } : null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await onImageUpload(file);
      if (result.success && result.data) {
        setBoxData(prev => prev ? { ...prev, image: result.data?.imageUrl || '' } : null);
      }
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: '', rarity: 'N', probability: 25, image: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BlindBoxItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleItemImageUpload = async (index: number, file: File) => {
    const result = await onImageUpload(file);
    if (result.success && result.data) {
      updateItem(index, 'image', result.data.imageUrl || '');
    }
  };

  const handleSaveClick = () => {
    if (boxData) {
      // 确保概率总和为100%
      const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
      if (Math.abs(totalProbability - 100) > 0.1) {
        alert('所有物品的概率总和必须等于100%');
        return;
      }
      
      const updatedBoxData = {
        ...boxData,
        items: items.map(item => ({
          ...item,
          // 确保保存到数据库的是小数格式：如果大于等于1，说明是百分比，需要除以100
          probability: item.probability >= 1 ? item.probability / 100 : item.probability
        }))
      };
      onSave(updatedBoxData);
    }
  };

  if (!boxData) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  {isEditMode ? '编辑盲盒' : '创建盲盒'}
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </Dialog.Title>
                
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">名称</label>
                      <input type="text" name="name" id="name" value={boxData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">描述</label>
                      <textarea name="description" id="description" value={boxData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">价格</label>
                        <input type="number" name="price" id="price" value={boxData.price || ''} onChange={handleChange} step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">分类</label>
                        <input type="text" name="category" id="category" value={boxData.category || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">盲盒封面</label>
                      <div className="flex items-center space-x-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <ImageIcon size={16} className="mr-2" />
                          上传图片
                        </button>
                        {boxData.image && (
                          <img src={boxData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Items */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">盲盒物品</label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus size={14} className="mr-1" />
                        添加物品
                      </button>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-sm font-medium text-gray-700">物品 {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">物品名称</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                placeholder="输入物品名称"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">稀有度</label>
                              <select
                                value={item.rarity}
                                onChange={(e) => updateItem(index, 'rarity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              >
                                <option value="N">N (普通)</option>
                                <option value="R">R (稀有)</option>
                                <option value="SR">SR (超稀有)</option>
                                <option value="SSR">SSR (传说)</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">概率 (%)</label>
                              <input
                                type="number"
                                value={item.probability}
                                onChange={(e) => updateItem(index, 'probability', parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="25.0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">物品图片</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleItemImageUpload(index, file);
                                    }
                                  }}
                                  className="hidden"
                                  id={`item-image-${index}`}
                                />
                                <label
                                  htmlFor={`item-image-${index}`}
                                  className="cursor-pointer inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <ImageIcon size={14} className="mr-1" />
                                  选择图片
                                </label>
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {items.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <ImageIcon size={24} className="mx-auto mb-2" />
                        <p className="text-sm">暂无物品，点击"添加物品"开始创建</p>
                      </div>
                    )}
                    
                    {items.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        概率总计: {items.reduce((sum, item) => sum + item.probability, 0).toFixed(1)}%
                        {Math.abs(items.reduce((sum, item) => sum + item.probability, 0) - 100) > 0.1 && (
                          <span className="ml-2 text-red-600">⚠️ 总概率应为100%</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isEditMode ? '保存' : '创建'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
