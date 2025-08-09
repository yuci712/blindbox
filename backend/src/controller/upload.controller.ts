import { Controller, Post, Files, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { join } from 'path';
import { ensureDir, move } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/upload')
export class UploadController {
  @Inject()
  ctx: Context;

  @Post('/image')
  async uploadImage(@Files() files: any[]) {
    try {
      if (!files || files.length === 0) {
        return { success: false, message: '没有上传的文件' };
      }

      const file = files[0];
      
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimeType)) {
        return {
          success: false,
          message: '不支持的文件类型，仅支持 JPG、PNG、GIF、WebP 格式'
        };
      }

      // 验证文件大小 (5MB)
      const maxSize = 5 * 1024 * 1024;
      const fileStats = require('fs').statSync(file.data);
      if (fileStats.size > maxSize) {
        return {
          success: false,
          message: '文件大小不能超过 5MB'
        };
      }

      // 生成唯一文件名
      const ext = file.filename.split('.').pop();
      const newFilename = `${uuidv4()}.${ext}`;
      
      // 按日期分类存储
      const dateFolder = new Date().toISOString().slice(0, 7); // YYYY-MM
      const uploadDir = join(process.cwd(), 'uploads', 'images', dateFolder);
      
      // 确保目录存在
      await ensureDir(uploadDir);
      
      // 移动文件到目标位置
      const targetPath = join(uploadDir, newFilename);
      await move(file.data, targetPath);
      
      // 返回访问URL - 使用完整的服务器地址
      const imageUrl = `http://127.0.0.1:7001/uploads/images/${dateFolder}/${newFilename}`;
      
      return {
        success: true,
        data: {
          imageUrl,
          filename: newFilename,
          originalName: file.filename,
          size: fileStats.size,
          mimeType: file.mimeType
        }
      };

    } catch (error) {
      console.error('图片上传失败:', error);
      return {
        success: false,
        message: '图片上传失败，请重试'
      };
    }
  }
}
