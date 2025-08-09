import { Inject, Controller, Get, Query, Post, Put, Del, Body, Param, Patch } from '@midwayjs/core';
import { AdminService } from '../service/admin.service';
import { BlindBoxService } from '../service/blindbox.service';
import { PlayerShowService } from '../service/player-show.service';
import { Context } from '@midwayjs/koa';
import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/api/admin', { middleware: [JwtMiddleware] })
export class AdminController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  @Inject()
  blindBoxService: BlindBoxService;

  @Inject()
  playerShowService: PlayerShowService;

  @Get('/dashboard-stats')
  async getDashboardStats(@Query('timeRange') timeRange: 'all' | 'month' | 'week' = 'all') {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const stats = await this.adminService.getDashboardStats(timeRange);
      return { success: true, data: stats };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取仪表板统计数据失败', error: error.message };
    }
  }

  @Post('/blindboxes')
  async createBlindBox(@Body() blindBoxData: any) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const newBlindBox = await this.blindBoxService.createBlindBox(blindBoxData);
      return { success: true, data: newBlindBox, message: '盲盒创建成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '创建盲盒失败', error: error.message };
    }
  }

  @Get('/blindboxes')
  async getAllBlindBoxes() {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const blindBoxes = await this.blindBoxService.getAllBlindBoxesForAdmin();
      return { success: true, data: blindBoxes };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取盲盒列表失败', error: error.message };
    }
  }

  @Put('/blindboxes/:id')
  async updateBlindBox(@Param('id') id: string, @Body() blindBoxData: any) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const updatedBlindBox = await this.blindBoxService.updateBlindBox(parseInt(id), blindBoxData);
      return { success: true, data: updatedBlindBox, message: '盲盒更新成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '更新盲盒失败', error: error.message };
    }
  }

  @Del('/blindboxes/:id')
  async deleteBlindBox(@Param('id') id: string) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      await this.blindBoxService.deleteBlindBox(parseInt(id));
      return { success: true, message: '盲盒删除成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '删除盲盒失败', error: error.message };
    }
  }

  @Patch('/blindboxes/:id/toggle')
  async toggleBlindBoxActive(@Param('id') id: string) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const updatedBlindBox = await this.blindBoxService.toggleBlindBoxActive(parseInt(id));
      return { success: true, data: updatedBlindBox, message: '盲盒状态更新成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '更新盲盒状态失败', error: error.message };
    }
  }

  @Post('/fix-probability-data')
  async fixProbabilityData() {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const result = await this.blindBoxService.fixProbabilityData();
      return { success: true, data: result, message: '概率数据修复完成' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '修复概率数据失败', error: error.message };
    }
  }

  @Post('/clear-collections')
  async clearAllCollections() {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const result = await this.blindBoxService.clearAllUserCollections();
      return { success: true, data: result, message: '用户收藏数据清空完成' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '清空用户收藏数据失败', error: error.message };
    }
  }

  @Post('/clear-user-collection/:userId')
  async clearUserCollection(@Param('userId') userId: string) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const result = await this.blindBoxService.clearUserCollection(parseInt(userId));
      return { success: true, data: result, message: '用户收藏数据清空完成' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '清空用户收藏数据失败', error: error.message };
    }
  }

  // 玩家秀管理相关路由
  @Get('/player-show')
  async getPlayerShows() {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const playerShows = await this.playerShowService.getPlayerShowsForAdmin();
      return { success: true, data: playerShows };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取玩家秀列表失败', error: error.message };
    }
  }

  @Del('/player-show/:id')
  async deletePlayerShow(@Param('id') id: string) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      await this.playerShowService.deletePlayerShow(parseInt(id));
      return { success: true, message: '玩家秀删除成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '删除玩家秀失败', error: error.message };
    }
  }
}
