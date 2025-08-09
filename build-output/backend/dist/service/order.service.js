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
exports.OrderService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entity/order.entity");
const user_entity_1 = require("../entity/user.entity");
const blindbox_entity_1 = require("../entity/blindbox.entity");
let OrderService = class OrderService {
    // 获取用户的订单列表
    async getUserOrders(userId, page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.blindBox', 'blindBox')
            .leftJoinAndSelect('order.user', 'user')
            .where('order.userId = :userId', { userId })
            .orderBy('order.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (status) {
            queryBuilder.andWhere('order.status = :status', { status });
        }
        const [orders, total] = await queryBuilder.getManyAndCount();
        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // 获取订单详情
    async getOrderById(id, userId) {
        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.blindBox', 'blindBox')
            .leftJoinAndSelect('order.user', 'user')
            .where('order.id = :id', { id });
        if (userId) {
            queryBuilder.andWhere('order.userId = :userId', { userId });
        }
        return await queryBuilder.getOne();
    }
    // 更新订单状态（用户）
    async updateOrderStatus(id, userId, status) {
        const order = await this.orderRepository.findOne({
            where: { id, userId },
            relations: ['blindBox', 'user'],
        });
        if (!order) {
            return null;
        }
        // 只允许用户取消pending状态的订单
        if (order.status !== 'pending' || status !== 'cancelled') {
            throw new Error('无法更新此订单状态');
        }
        order.status = status;
        order.updatedAt = new Date();
        return await this.orderRepository.save(order);
    }
    // 获取所有订单（管理员）
    async getAllOrders(page = 1, limit = 10, status, userId) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.blindBox', 'blindBox')
            .leftJoinAndSelect('order.user', 'user')
            .orderBy('order.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (status) {
            queryBuilder.andWhere('order.status = :status', { status });
        }
        if (userId) {
            queryBuilder.andWhere('order.userId = :userId', { userId });
        }
        const [orders, total] = await queryBuilder.getManyAndCount();
        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // 管理员更新订单状态
    async adminUpdateOrderStatus(id, status) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['blindBox', 'user'],
        });
        if (!order) {
            return null;
        }
        order.status = status;
        order.updatedAt = new Date();
        return await this.orderRepository.save(order);
    }
    // 获取订单统计
    async getOrderStats() {
        const totalOrders = await this.orderRepository.count();
        const statusStats = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .addSelect('SUM(order.amount)', 'totalAmount')
            .groupBy('order.status')
            .getRawMany();
        const recentOrders = await this.orderRepository.find({
            take: 10,
            order: { createdAt: 'DESC' },
            relations: ['blindBox', 'user'],
        });
        // 计算总收入
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.amount)', 'sum')
            .where('order.status = :status', { status: 'completed' })
            .getRawOne();
        // 获取热门盲盒（按订单数量排序）
        const popularBlindBoxes = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.blindBox', 'blindBox')
            .select('blindBox.id', 'id')
            .addSelect('blindBox.name', 'name')
            .addSelect('COUNT(order.id)', 'orderCount')
            .addSelect('SUM(order.amount)', 'revenue')
            .groupBy('blindBox.id')
            .orderBy('orderCount', 'DESC')
            .limit(5)
            .getRawMany();
        return {
            totalOrders,
            totalRevenue: (totalRevenue === null || totalRevenue === void 0 ? void 0 : totalRevenue.sum) || 0,
            statusStats: statusStats.map(stat => ({
                status: stat.status,
                count: parseInt(stat.count),
                totalAmount: parseFloat(stat.totalAmount) || 0,
            })),
            recentOrders,
            popularBlindBoxes: popularBlindBoxes.map(box => ({
                id: box.id,
                name: box.name,
                orderCount: parseInt(box.orderCount),
                revenue: parseFloat(box.revenue) || 0,
            })),
        };
    }
    // 删除订单
    async deleteOrder(id) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            return null;
        }
        await this.orderRepository.remove(order);
        return true;
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(order_entity_1.Order),
    __metadata("design:type", typeorm_2.Repository)
], OrderService.prototype, "orderRepository", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], OrderService.prototype, "userRepository", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(blindbox_entity_1.BlindBox),
    __metadata("design:type", typeorm_2.Repository)
], OrderService.prototype, "blindBoxRepository", void 0);
OrderService = __decorate([
    (0, decorator_1.Provide)()
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlL29yZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQThDO0FBQzlDLCtDQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMseURBQStDO0FBQy9DLHVEQUE2QztBQUM3QywrREFBcUQ7QUFHOUMsSUFBTSxZQUFZLEdBQWxCLE1BQU0sWUFBWTtJQVV2QixZQUFZO0lBQ1osS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFjLEVBQUUsT0FBZSxDQUFDLEVBQUUsUUFBZ0IsRUFBRSxFQUFFLE1BQWU7UUFDdkYsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRWhDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlO2FBQ3RDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQzthQUMzQixpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUM7YUFDL0MsaUJBQWlCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQzthQUN2QyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUMzQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDO2FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFZixJQUFJLE1BQU0sRUFBRTtZQUNWLFlBQVksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUU3RCxPQUFPO1lBQ0wsTUFBTTtZQUNOLEtBQUs7WUFDTCxJQUFJO1lBQ0osS0FBSztZQUNMLFVBQVUsRUFBRSxJ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