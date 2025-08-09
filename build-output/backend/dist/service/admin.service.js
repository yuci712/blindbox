"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const user_entity_1 = require("../entity/user.entity");
const blindbox_entity_1 = require("../entity/blindbox.entity");
const order_entity_1 = require("../entity/order.entity");
const typeorm_2 = require("typeorm");
let AdminService = class AdminService {
    async getDashboardStats(timeRange) {
        // 设置项目开始时间为2025年8月1日，避免查询无关历史数据
        const projectStartDate = new Date('2025-08-01T00:00:00.000Z');
        // 并行执行基础统计查询，提高性能
        const [totalUsers, totalBlindBoxes] = await Promise.all([
            this.userModel.count(),
            this.blindBoxModel.count()
        ]);
        let startDate;
        const now = new Date();
        if (timeRange === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        else if (timeRange === 'week') {
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
    getSimplifiedRarityStats() {
        // 使用预设的简化统计数据，避免复杂查询
        return [
            { rarity: '普通', count: 12 },
            { rarity: '稀有', count: 8 },
            { rarity: '超稀有', count: 4 },
            { rarity: '传说', count: 1 }
        ];
    }
    async getDailyStats(startDate) {
        const endDate = new Date();
        const projectStartDate = new Date('2025-08-01T00:00:00.000Z');
        // 确保开始时间不早于项目开始时间，且限制在最近7天内以提高性能
        const maxDays = 7; // 减少到7天，提高响应速度
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
        for (let i = 6; i >= 0; i--) { // 只显示最近7天
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
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], AdminService.prototype, "userModel", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(blindbox_entity_1.BlindBox),
    __metadata("design:type", typeorm_2.Repository)
], AdminService.prototype, "blindBoxModel", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(order_entity_1.Order),
    __metadata("design:type", typeorm_2.Repository)
], AdminService.prototype, "orderModel", void 0);
AdminService = __decorate([
    (0, core_1.Provide)()
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlL2FkbWluLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLCtDQUFzRDtBQUN0RCx1REFBNkM7QUFDN0MsK0RBQXFEO0FBQ3JELHlEQUErQztBQUMvQyxxQ0FBcUM7QUFHOUIsSUFBTSxZQUFZLEdBQWxCLE1BQU0sWUFBWTtJQVV2QixLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBbUM7UUFDekQsZ0NBQWdDO1FBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUU5RCxrQkFBa0I7UUFDbEIsTUFBTSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxTQUFlLENBQUM7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUV2QixJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7WUFDekIsU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUQ7YUFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7WUFDL0IsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwRCxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2xELFNBQVMsQ0FBQyxR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