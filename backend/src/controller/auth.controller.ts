import { Controller, Post, Body, Get, Inject, Put, Files } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  ctx: Context;

  @Post('/register')
  async register(@Body() body: any) {
    try {
      const { username, email, password, role = 'customer' } = body;

      // 真实注册逻辑
      if (!username || !email || !password) {
        return { success: false, message: '请填写所有必填字段' };
      }

      // 验证角色是否有效
      if (role && !['customer', 'admin'].includes(role)) {
        return { success: false, message: '无效的用户角色' };
      }

      const user = await this.authService.register(username, email, password);
      const token = await this.authService.generateToken(user.id, user.username);

      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || '注册失败' };
    }
  }

  @Post('/login')
  async login(@Body() body: any) {
    try {
      const { username, password } = body;

      // 真实登录逻辑
      if (!username || !password) {
        return { success: false, message: '请填写用户名和密码' };
      }

      const result = await this.authService.login(username, password);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || '登录失败' };
    }
  }

  @Get('/profile', { middleware: [JwtMiddleware] })
  async getProfile() {
    try {
      const userId = this.ctx.state.user.id;
      const user = await this.authService.getUserById(userId);

      if (!user) {
        return { success: false, message: '用户不存在' };
      }

      return { success: true, data: user };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, message: '获取用户信息失败' };
    }
  }

  @Post('/upload-avatar', { middleware: [JwtMiddleware] })
  async uploadAvatar(@Files() files) {
    console.log('=== 头像上传请求 ===');
    console.log('userId:', this.ctx.state.user?.id);
    console.log('files:', files?.length || 0);
    
    try {
      if (!files || files.length === 0) {
        console.log('❌ 没有文件上传');
        return { success: false, message: '请选择要上传的头像文件' };
      }

      const file = files[0];
      const userId = this.ctx.state.user.id;
      console.log('📁 文件信息:', {
        filename: file.filename,
        mimeType: file.mimeType,
        filepath: file.data
      });

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimeType)) {
        console.log('❌ 文件类型不支持:', file.mimeType);
        return { success: false, message: '只允许上传 JPG、PNG、GIF 格式的图片' };
      }

      // 读取临时文件并获取文件大小
      const fs = require('fs');
      const tempFilePath = file.data; // 这是临时文件路径
      const fileStats = fs.statSync(tempFilePath);
      const fileSize = fileStats.size;

      console.log('📊 文件大小:', fileSize);

      // 验证文件大小 (最大 2MB)
      if (fileSize > 2 * 1024 * 1024) {
        console.log('❌ 文件过大:', fileSize);
        return { success: false, message: '头像文件大小不能超过 2MB' };
      }

      // 创建上传目录
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const uploadDir = join(__dirname, '../../uploads/images', yearMonth);
      console.log('📂 上传目录:', uploadDir);
      
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
        console.log('✅ 创建目录成功');
      }

      // 生成唯一文件名
      const fileExtension = file.filename.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;
      const savePath = join(uploadDir, filename);
      console.log('💾 保存路径:', savePath);

      // 从临时文件复制到目标位置
      fs.copyFileSync(tempFilePath, savePath);
      console.log('✅ 文件保存成功');

      // 生成头像URL - 使用完整的服务器地址
      const avatarUrl = `http://127.0.0.1:7001/uploads/images/${yearMonth}/${filename}`;
      console.log('🔗 头像URL:', avatarUrl);

      // 更新用户头像
      await this.authService.updateUserAvatar(userId, avatarUrl);
      console.log('✅ 数据库更新成功');

      const result = {
        success: true,
        data: {
          avatarUrl,
          message: '头像上传成功'
        }
      };
      console.log('🎉 上传完成，返回结果:', result);
      return result;
    } catch (error) {
      console.error('❌ 头像上传失败:', error);
      return { success: false, message: '头像上传失败，请重试' };
    }
  }

  @Put('/profile', { middleware: [JwtMiddleware] })
  async updateProfile(@Body() body: any) {
    try {
      const userId = this.ctx.state.user.id;
      const { nickname } = body;

      const updatedUser = await this.authService.updateUserProfile(userId, { nickname });

      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: '更新用户信息失败' };
    }
  }
}
