import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import type { BlindBox } from '../services/api';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { BlindBoxModal } from '../components/BlindBoxModal';
import { getFullImageUrl } from '../utils/imageUtils';

const Admin = () => {
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BlindBox> | null>(null);

  useEffect(() => {
    loadBlindBoxes();
  }, []);

  const loadBlindBoxes = async () => {
    setLoading(true);
    try {
      console.log('加载盲盒列表...');
      const result = await adminAPI.getAllBlindBoxes();
      console.log('获取到盲盒数据:', result);
      if (result.success && result.data) {
        // 按创建时间降序排序
        const sortedBoxes = result.data.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log('设置盲盒数据:', sortedBoxes.length, '个盲盒');
        setBlindBoxes(sortedBoxes);
      }
    } catch (error) {
      console.error('获取盲盒列表失败', error);
      alert('获取盲盒列表失败');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentBox({ name: '', description: '', price: 0, category: '', image: '', items: [], isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (box: BlindBox) => {
    setIsEditMode(true);
    setCurrentBox({ ...box });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBox(null);
  };

  const handleSave = async (boxData: Partial<BlindBox>) => {
    try {
      let result;
      if (isEditMode && boxData.id) {
        result = await adminAPI.updateBlindBox(boxData.id, boxData);
      } else {
        result = await adminAPI.createBlindBox(boxData as Omit<BlindBox, 'id' | 'totalSold' | 'createdAt' | 'updatedAt'>);
      }

      if (result.success) {
        closeModal();
        loadBlindBoxes();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('保存失败', error);
      alert('操作失败，请重试');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      console.log('切换盲盒状态:', id);
      const result = await adminAPI.toggleBlindBoxActive(id);
      console.log('切换结果:', result);
      if (result.success) {
        console.log('切换成功，重新加载数据');
        loadBlindBoxes();
      } else {
        console.error('更新状态失败:', result.message);
        alert('更新状态失败: ' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('更新状态异常:', error);
      alert('更新状态失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    // 找到要删除的盲盒信息
    const boxToDelete = blindBoxes.find(box => box.id === id);
    const boxName = boxToDelete ? boxToDelete.name : `ID: ${id}`;
    const isActive = boxToDelete ? boxToDelete.isActive : false;
    
    const confirmMessage = isActive 
      ? `确定要删除盲盒 "${boxName}" 吗？\n\n⚠️ 注意：这是一个激活状态的盲盒，删除后用户将无法购买。\n此操作将同时删除相关的用户收藏和订单记录，此操作不可撤销。`
      : `确定要删除盲盒 "${boxName}" 吗？\n\n此操作将同时删除相关的用户收藏和订单记录，此操作不可撤销。`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      console.log('准备删除盲盒:', id, boxName);
      const result = await adminAPI.deleteBlindBox(id);
      console.log('删除结果:', result);
      
      if (result.success) {
        console.log('删除成功，重新加载列表');
        loadBlindBoxes();
        
        // 显示删除详情
        const resultData = result as { success: boolean; data?: { details?: { deletedUserBlindBoxes: number; deletedOrders: number } } };
        const details = resultData.data?.details;
        let message = '盲盒删除成功';
        if (details) {
          message += `\n已清理:\n- 用户收藏: ${details.deletedUserBlindBoxes} 条\n- 订单记录: ${details.deletedOrders} 条`;
        }
        alert(message);
      } else {
        console.error('删除失败:', result.message);
        alert(`删除失败: ${result.message}`);
      }
    } catch (error) {
      console.error('删除异常:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      alert(`删除失败，请重试: ${errorMessage}`);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://127.0.0.1:7001/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        return result;
      } else {
        alert('图片上传失败');
        return { success: false };
      }
    } catch (error) {
      console.error('图片上传失败', error);
      alert('图片上传失败，请重试');
      return { success: false };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">盲盒管理</h1>
            <p className="text-gray-600 mt-1">在这里创建、编辑和管理您的盲盒商品。</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus size={20} className="mr-2" />
            创建盲盒
          </button>
        </div>

        {/* Blind Box Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">销量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blindBoxes.map((box) => (
                  <tr key={box.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          {box.image ? (
                            <img src={getFullImageUrl(box.image)} alt={box.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <ImageIcon className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{box.name}</div>
                          <div className="text-xs text-gray-500">{box.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">¥{box.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Switch
                        checked={box.isActive}
                        onChange={() => handleToggleActive(box.id)}
                        className={`${
                          box.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        <span
                          className={`${
                            box.isActive ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                      </Switch>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{box.totalSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button onClick={() => openEditModal(box)} className="text-indigo-600 hover:text-indigo-800 transition">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(box.id)} className="text-red-600 hover:text-red-800 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <BlindBoxModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        isEditMode={isEditMode}
        initialData={currentBox}
      />
    </div>
  );
};

export default Admin;
