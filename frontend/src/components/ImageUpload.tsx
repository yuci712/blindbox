import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { adminAPI } from '../services/api';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // 以 MB 为单位
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = "点击或拖拽上传图片",
  disabled = false,
  accept = "image/*",
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      
      // 显示预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 上传文件
      const result = await adminAPI.uploadImage(file);
      
      if (result.success && result.data) {
        onChange(result.data.imageUrl);
        console.log('图片上传成功:', result.data);
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      alert('图片上传失败，请重试');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-all cursor-pointer
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="预览"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <div className="flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100"
                  disabled={disabled || uploading}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-gray-100"
                  disabled={disabled || uploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="bg-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-700">上传中...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">上传中...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Image className="w-12 h-12 text-gray-400" />
                <span className="text-sm text-gray-600">{placeholder}</span>
                <span className="text-xs text-gray-400">
                  支持 JPG、PNG、GIF、WebP 格式，最大 {maxSize}MB
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
