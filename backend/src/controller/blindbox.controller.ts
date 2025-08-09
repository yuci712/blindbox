import { Controller, Get, Query, Post, Param, Body, Inject } from '@midwayjs/core';
import { BlindBoxService } from '../service/blindbox.service';

@Controller('/api/blindboxes')
export class BlindBoxController {
  @Inject()
  blindBoxService: BlindBoxService;

  @Get('/')
  async getBlindBoxes(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category?: string
  ) {
    try {
      const result = await this.blindBoxService.getAllBlindBoxes(
        Number(page),
        Number(limit),
        category
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('获取盲盒列表失败:', error);
      return { success: false, message: 'Failed to get blind boxes' };
    }
  }

  @Get('/categories')
  async getCategories() {
    try {
      const categories = await this.blindBoxService.getCategories();
      return { success: true, data: categories };
    } catch (error) {
      console.error('获取分类失败:', error);
      return { success: false, message: 'Failed to get categories' };
    }
  }

  @Get('/search')
  async searchBlindBoxes(
    @Query('keyword') keyword: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { success: false, message: '搜索关键词不能为空' };
    }

    if (keyword.trim().length < 2) {
      return { success: false, message: '搜索关键词至少需要2个字符' };
    }

    try {
      const result = await this.blindBoxService.searchBlindBoxes(
        keyword.trim(),
        Number(page),
        Number(limit)
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('搜索盲盒失败:', error);
      return { success: false, message: 'Search failed' };
    }
  }

  @Get('/:id')
  async getBlindBoxById(@Param('id') id: number) {
    try {
      const blindBox = await this.blindBoxService.getBlindBoxById(Number(id));
      if (!blindBox) {
        return { success: false, message: 'Blind box not found' };
      }
      return { success: true, data: blindBox };
    } catch (error) {
      console.error('获取盲盒详情失败:', error);
      return { success: false, message: 'Failed to get blind box' };
    }
  }

  @Post('/draw/:id')
  async drawBlindBox(@Param('id') blindBoxId: number, @Body() body: { userId: number }) {
    // 验证参数
    if (!blindBoxId || isNaN(Number(blindBoxId))) {
      return {
        success: false,
        message: '无效的盲盒ID',
      };
    }

    if (!body.userId || isNaN(Number(body.userId))) {
      return {
        success: false,
        message: '无效的用户ID',
      };
    }

    try {
      // 这里应该验证用户抽取权限等
      const result = await this.blindBoxService.drawBlindBox(
        Number(blindBoxId),
        Number(body.userId)
      );
      return {
        success: true,
        data: result,
        message: '抽取成功',
      };
    } catch (error) {
      console.error('抽奖失败:', error);
      return {
        success: false,
        message: error.message || '抽取失败',
      };
    }
  }

  @Get('/user/:userId')
  async getUserBlindBoxes(@Param('userId') userId: number) {
    try {
      const result = await this.blindBoxService.getUserBlindBoxes(
        Number(userId)
      );
      return { success: true, data: result };
    } catch (error) {
      console.error('获取用户盲盒失败:', error);
      return { success: false, message: 'Failed to get user blind boxes' };
    }
  }
}
