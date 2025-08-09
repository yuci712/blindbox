import { Inject, Controller, Post, Get, Put, Del, Body, Param, Files } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PlayerShowService } from '../service/player-show.service';
import { CreatePlayerShowDTO } from '../dto/player-show.dto';
import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/api/player-show')
export class PlayerShowController {
  @Inject()
  playerShowService: PlayerShowService;

  @Inject()
  ctx: Context;

  @Post('/', { middleware: [JwtMiddleware] })
  async create(@Body() body: CreatePlayerShowDTO, @Files() files?: any[]) {
    try {
      const userId = this.ctx.state.user?.userId;
      if (!userId) {
        return { success: false, message: '用户未登录' };
      }

      console.log('创建玩家秀请求数据:', body);
      console.log('用户ID:', userId);
      
      let imageUrl: string | null = null;
      
      // 处理图片上传（如果有的话）
      if (files && files.length > 0) {
        // 这里应该处理图片上传逻辑
        console.log('收到图片文件:', files[0]);
      }
      
      // 如果body中包含imageUrl，使用它
      if (body.imageUrl) {
        imageUrl = body.imageUrl;
      }

      const result = await this.playerShowService.createPlayerShow(userId, body, imageUrl);
      return { success: true, data: result };
    } catch (error) {
      console.error('创建玩家秀失败:', error);
      return { success: false, message: error.message || '创建玩家秀失败' };
    }
  }

  @Get('/')
  async getAll() {
    try {
      const result = await this.playerShowService.getPlayerShows();
      return { success: true, data: result };
    } catch (error) {
      console.error('获取玩家秀列表失败:', error);
      return { success: false, message: error.message || '获取玩家秀列表失败' };
    }
  }

  @Put('/:id/like', { middleware: [JwtMiddleware] })
  async like(@Param('id') id: number) {
    try {
      const result = await this.playerShowService.likePlayerShow(id);
      return { success: true, data: { likes: result.likes } };
    } catch (error) {
      console.error('点赞失败:', error);
      return { success: false, message: error.message || '点赞失败' };
    }
  }

  @Del('/:id', { middleware: [JwtMiddleware] })
  async delete(@Param('id') id: number) {
    try {
      const userRole = this.ctx.state.user?.role;
      
      // 只允许管理员删除
      if (userRole !== 'admin') {
        return { success: false, message: '权限不足' };
      }

      await this.playerShowService.deletePlayerShow(id);
      return { success: true, message: '删除成功' };
    } catch (error) {
      console.error('删除玩家秀失败:', error);
      return { success: false, message: error.message || '删除失败' };
    }
  }
}