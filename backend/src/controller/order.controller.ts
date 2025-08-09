import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  Inject,
  Del,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { OrderService } from '../service/order.service';

@Controller('/api/orders', { middleware: [JwtMiddleware] })
export class OrderController {
  @Inject()
  ctx: Context;

  @Inject()
  orderService: OrderService;

  // 获取用户的订单列表
  @Get('/')
  async getUserOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string
  ) {
    try {
      const userId = this.ctx.state.user.id;
      const orders = await this.orderService.getUserOrders(userId, page, limit, status);
      return { success: true, data: orders };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取订单列表失败', error: error.message };
    }
  }

  // 获取订单详情
  @Get('/:id')
  async getOrderById(@Param('id') id: number) {
    try {
      const userId = this.ctx.state.user.id;
      const order = await this.orderService.getOrderById(id, userId);
      
      if (!order) {
        this.ctx.status = 404;
        return { success: false, message: '订单不存在' };
      }

      return { success: true, data: order };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取订单详情失败', error: error.message };
    }
  }

  // 更新订单状态（仅用户自己的订单）
  @Put('/:id/status')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: string
  ) {
    try {
      const userId = this.ctx.state.user.id;
      const order = await this.orderService.updateOrderStatus(id, userId, status);
      
      if (!order) {
        this.ctx.status = 404;
        return { success: false, message: '订单不存在或无权限' };
      }

      return { success: true, data: order };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '更新订单状态失败', error: error.message };
    }
  }
}

// 管理员订单管理控制器
@Controller('/api/admin/orders', { middleware: [JwtMiddleware] })
export class AdminOrderController {
  @Inject()
  ctx: Context;

  @Inject()
  orderService: OrderService;

  // 获取所有订单（管理员）
  @Get('/')
  async getAllOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: number
  ) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const orders = await this.orderService.getAllOrders(page, limit, status, userId);
      return { success: true, data: orders };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取订单列表失败', error: error.message };
    }
  }

  // 管理员更新订单状态
  @Put('/:id/status')
  async adminUpdateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: string
  ) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const order = await this.orderService.adminUpdateOrderStatus(id, status);
      
      if (!order) {
        this.ctx.status = 404;
        return { success: false, message: '订单不存在' };
      }

      return { success: true, data: order };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '更新订单状态失败', error: error.message };
    }
  }

  // 获取订单统计
  @Get('/stats')
  async getOrderStats() {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const stats = await this.orderService.getOrderStats();
      return { success: true, data: stats };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '获取订单统计失败', error: error.message };
    }
  }

  // 删除订单（管理员）
  @Del('/:id')
  async deleteOrder(@Param('id') id: number) {
    try {
      // 验证是否为管理员
      if (this.ctx.state.user?.role !== 'admin') {
        this.ctx.status = 403;
        return { success: false, message: '权限不足' };
      }

      const result = await this.orderService.deleteOrder(id);
      
      if (!result) {
        this.ctx.status = 404;
        return { success: false, message: '订单不存在' };
      }

      return { success: true, message: '订单删除成功' };
    } catch (error) {
      this.ctx.status = 500;
      return { success: false, message: '删除订单失败', error: error.message };
    }
  }
}
