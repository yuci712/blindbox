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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderController = exports.OrderController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const order_service_1 = require("../service/order.service");
let OrderController = class OrderController {
    // 获取用户的订单列表
    async getUserOrders(page = 1, limit = 10, status) {
        try {
            const userId = this.ctx.state.user.id;
            const orders = await this.orderService.getUserOrders(userId, page, limit, status);
            return { success: true, data: orders };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取订单列表失败', error: error.message };
        }
    }
    // 获取订单详情
    async getOrderById(id) {
        try {
            const userId = this.ctx.state.user.id;
            const order = await this.orderService.getOrderById(id, userId);
            if (!order) {
                this.ctx.status = 404;
                return { success: false, message: '订单不存在' };
            }
            return { success: true, data: order };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取订单详情失败', error: error.message };
        }
    }
    // 更新订单状态（仅用户自己的订单）
    async updateOrderStatus(id, status) {
        try {
            const userId = this.ctx.state.user.id;
            const order = await this.orderService.updateOrderStatus(id, userId, status);
            if (!order) {
                this.ctx.status = 404;
                return { success: false, message: '订单不存在或无权限' };
            }
            return { success: true, data: order };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '更新订单状态失败', error: error.message };
        }
    }
};
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", Object)
], OrderController.prototype, "ctx", void 0);
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", order_service_1.OrderService)
], OrderController.prototype, "orderService", void 0);
__decorate([
    (0, decorator_1.Get)('/'),
    __param(0, (0, decorator_1.Query)('page')),
    __param(1, (0, decorator_1.Query)('limit')),
    __param(2, (0, decorator_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrders", null);
__decorate([
    (0, decorator_1.Get)('/:id'),
    __param(0, (0, decorator_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, decorator_1.Put)('/:id/status'),
    __param(0, (0, decorator_1.Param)('id')),
    __param(1, (0, decorator_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
OrderController = __decorate([
    (0, decorator_1.Controller)('/api/orders', { middleware: [jwt_middleware_1.JwtMiddleware] })
], OrderController);
exports.OrderController = OrderController;
// 管理员订单管理控制器
let AdminOrderController = class AdminOrderController {
    // 获取所有订单（管理员）
    async getAllOrders(page = 1, limit = 10, status, userId) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const orders = await this.orderService.getAllOrders(page, limit, status, userId);
            return { success: true, data: orders };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取订单列表失败', error: error.message };
        }
    }
    // 管理员更新订单状态
    async adminUpdateOrderStatus(id, status) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const order = await this.orderService.adminUpdateOrderStatus(id, status);
            if (!order) {
                this.ctx.status = 404;
                return { success: false, message: '订单不存在' };
            }
            return { success: true, data: order };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '更新订单状态失败', error: error.message };
        }
    }
    // 获取订单统计
    async getOrderStats() {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const stats = await this.orderService.getOrderStats();
            return { success: true, data: stats };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取订单统计失败', error: error.message };
        }
    }
    // 删除订单（管理员）
    async deleteOrder(id) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const result = await this.orderService.deleteOrder(id);
            if (!result) {
                this.ctx.status = 404;
                return { success: false, message: '订单不存在' };
            }
            return { success: true, message: '订单删除成功' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '删除订单失败', error: error.message };
        }
    }
};
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", Object)
], AdminOrderController.prototype, "ctx", void 0);
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", order_service_1.OrderService)
], AdminOrderController.prototype, "orderService", void 0);
__decorate([
    (0, decorator_1.Get)('/'),
    __param(0, (0, decorator_1.Query)('page')),
    __param(1, (0, decorator_1.Query)('limit')),
    __param(2, (0, decorator_1.Query)('status')),
    __param(3, (0, decorator_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], AdminOrderController.prototype, "getAllOrders", null);
__decorate([
    (0, decorator_1.Put)('/:id/status'),
    __param(0, (0, decorator_1.Param)('id')),
    __param(1, (0, decorator_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminOrderController.prototype, "adminUpdateOrderStatus", null);
__decorate([
    (0, decorator_1.Get)('/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminOrderController.prototype, "getOrderStats", null);
__decorate([
    (0, decorator_1.Del)('/:id'),
    __param(0, (0, decorator_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminOrderController.prototype, "deleteOrder", null);
AdminOrderController = __decorate([
    (0, decorator_1.Controller)('/api/admin/orders', { middleware: [jwt_middleware_1.JwtMiddleware] })
], AdminOrderController);
exports.AdminOrderController = AdminOrderController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL29yZGVyLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBUzZCO0FBRTdCLGlFQUE2RDtBQUM3RCw0REFBd0Q7QUFHakQsSUFBTSxlQUFlLEdBQXJCLE1BQU0sZUFBZTtJQU8xQixZQUFZO0lBRU4sQUFBTixLQUFLLENBQUMsYUFBYSxDQUNGLE9BQWUsQ0FBQyxFQUNmLFFBQWdCLEVBQUUsRUFDakIsTUFBZTtRQUVoQyxJQUFJO1lBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN0QyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUN4QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN0RTtJQUNILENBQUM7SUFFRCxTQUFTO0lBRUgsQUFBTixLQUFLLENBQUMsWUFBWSxDQUFjLEVBQVU7UUFDeEMsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FB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