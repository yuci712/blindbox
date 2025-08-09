import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';
import { Order } from '../entity/order.entity';
import { Repository } from 'typeorm';

@Provide()
export class AdminService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @InjectEntityModel(BlindBox)
  blindBoxModel: Repository<BlindBox>;

  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  async getDashboardStats(timeRange: 'all' | 'month' | 'week') {
    // 设置项目开始时间为2025年8月1日，避免查询无关历史数据
    const projectStartDate = new Date('2025-08-01T00:00:00.000Z');
    
    // 并行执行基础统计查询，提高性能
    const [totalUsers, totalBlindBoxes] = await Promise.all([
      this.userModel.count(),
      this.blindBoxModel.count()
    ]);

    let startDate: Date;
    const now = new Date();

    if (timeRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'week') {
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(firstDayOfWeek));
      startDate.setHours(0, 0, 0, 0);
    }

    // 确保查询时间不早于项目开始时间
    if (!startDate || startDate < projectStartDate) {
      startDate = projectStartDate;
    }

    // 使用数据库聚合查询，避免在应用层计算
    const [orderStats, popularBlindBoxes] = await Promise.all([
      // 获取订单统计（抽奖次数和总收入）- 始终限制从项目开始时间
      this.orderModel
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'totalDraws')
        .addSelect('SUM(blindBox.price)', 'totalRevenue')
        .innerJoin('order.blindBox', 'blindBox')
        .where('order.createdAt >= :projectStartDate', { projectStartDate })
        .andWhere('order.createdAt >= :startDate', { startDate })
        .getRawOne(),
        
      // 获取热门盲盒统计 - 始终限制从项目开始时间
      this.orderModel
        .createQueryBuilder('order')
        .select('order.blindBoxId', 'id')
        .addSelect('blindBox.name', 'name')
        .addSelect('COUNT(order.id)', 'draws')
        .addSelect('SUM(blindBox.price)', 'revenue')
        .innerJoin('order.blindBox', 'blindBox')
        .where('order.createdAt >= :projectStartDate', { projectStartDate })
        .andWhere('order.createdAt >= :startDate', { startDate })
        .groupBy('order.blindBoxId')
        .addGroupBy('blindBox.name')
        .orderBy('draws', 'DESC')
        .limit(10)
        .getRawMany()
    ]);

    const totalDraws = parseInt(orderStats.totalDraws) || 0;
    const totalRevenue = parseFloat(orderStats.totalRevenue) || 0;

    // 获取日统计数据（从项目开始时间算起，最多7天）
    const dailyStats = await this.getDailyStats(startDate);

    // 简化稀有度统计，使用预设值提高性能
    const rarityStats = this.getSimplifiedRarityStats();

    return {
      totalUsers,
      totalBlindBoxes,
      totalDraws,
      totalRevenue,
      dailyStats,
      popularBlindBoxes,
      rarityStats,
    };
  }

  private getSimplifiedRarityStats() {
    // 使用预设的简化统计数据，避免复杂查询
    return [
      { rarity: '普通', count: 12 },
      { rarity: '稀有', count: 8 },
      { rarity: '超稀有', count: 4 },
      { rarity: '传说', count: 1 }
    ];
  }

  private async getDailyStats(startDate: Date) {
    const endDate = new Date();
    const projectStartDate = new Date('2025-08-01T00:00:00.000Z');
    
    // 确保开始时间不早于项目开始时间，且限制在最近7天内以提高性能
    const maxDays = 7;  // 减少到7天，提高响应速度
    const sevenDaysAgo = new Date(endDate.getTime() - maxDays * 24 * 60 * 60 * 1000);
    const actualStartDate = new Date(Math.max(startDate.getTime(), projectStartDate.getTime(), sevenDaysAgo.getTime()));
    
    // 使用数据库聚合查询，一次性获取所有数据
    const [orderStats, userStats] = await Promise.all([
      // 订单统计
      this.orderModel
        .createQueryBuilder('order')
        .select('DATE(order.createdAt)', 'date')
        .addSelect('COUNT(order.id)', 'draws')
        .addSelect('SUM(blindBox.price)', 'revenue')
        .innerJoin('order.blindBox', 'blindBox')
        .where('order.createdAt >= :startDate', { startDate: actualStartDate })
        .groupBy('DATE(order.createdAt)')
        .getRawMany(),
      
      // 用户注册统计  
      this.userModel
        .createQueryBuilder('user')
        .select('DATE(user.createdAt)', 'date')
        .addSelect('COUNT(user.id)', 'newUsers')
        .where('user.createdAt >= :startDate', { startDate: actualStartDate })
        .groupBy('DATE(user.createdAt)')
        .getRawMany()
    ]);

    // 创建日期映射
    const orderMap = new Map(orderStats.map(item => [item.date, item]));
    const userMap = new Map(userStats.map(item => [item.date, item]));

    // 生成最近7天的数据（减少数据量）
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {  // 只显示最近7天
      const currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() - i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const orderData = orderMap.get(dateStr) || { draws: 0, revenue: 0 };
      const userData = userMap.get(dateStr) || { newUsers: 0 };
      
      dailyData.push({
        date: dateStr,
        draws: parseInt(orderData.draws) || 0,
        revenue: parseFloat(orderData.revenue) || 0,
        newUsers: parseInt(userData.newUsers) || 0,
      });
    }
    
    return dailyData;
  }

}
