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
exports.AdminController = void 0;
const core_1 = require("@midwayjs/core");
const admin_service_1 = require("../service/admin.service");
const blindbox_service_1 = require("../service/blindbox.service");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
let AdminController = class AdminController {
    async getDashboardStats(timeRange = 'all') {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const stats = await this.adminService.getDashboardStats(timeRange);
            return { success: true, data: stats };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取仪表板统计数据失败', error: error.message };
        }
    }
    async createBlindBox(blindBoxData) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const newBlindBox = await this.blindBoxService.createBlindBox(blindBoxData);
            return { success: true, data: newBlindBox, message: '盲盒创建成功' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '创建盲盒失败', error: error.message };
        }
    }
    async getAllBlindBoxes() {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const blindBoxes = await this.blindBoxService.getAllBlindBoxesForAdmin();
            return { success: true, data: blindBoxes };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '获取盲盒列表失败', error: error.message };
        }
    }
    async updateBlindBox(id, blindBoxData) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const updatedBlindBox = await this.blindBoxService.updateBlindBox(parseInt(id), blindBoxData);
            return { success: true, data: updatedBlindBox, message: '盲盒更新成功' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '更新盲盒失败', error: error.message };
        }
    }
    async deleteBlindBox(id) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            await this.blindBoxService.deleteBlindBox(parseInt(id));
            return { success: true, message: '盲盒删除成功' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '删除盲盒失败', error: error.message };
        }
    }
    async toggleBlindBoxActive(id) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const updatedBlindBox = await this.blindBoxService.toggleBlindBoxActive(parseInt(id));
            return { success: true, data: updatedBlindBox, message: '盲盒状态更新成功' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '更新盲盒状态失败', error: error.message };
        }
    }
    async fixProbabilityData() {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const result = await this.blindBoxService.fixProbabilityData();
            return { success: true, data: result, message: '概率数据修复完成' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '修复概率数据失败', error: error.message };
        }
    }
    async clearAllCollections() {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const result = await this.blindBoxService.clearAllUserCollections();
            return { success: true, data: result, message: '用户收藏数据清空完成' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '清空用户收藏数据失败', error: error.message };
        }
    }
    async clearUserCollection(userId) {
        var _a;
        try {
            // 验证是否为管理员
            if (((_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                this.ctx.status = 403;
                return { success: false, message: '权限不足' };
            }
            const result = await this.blindBoxService.clearUserCollection(parseInt(userId));
            return { success: true, data: result, message: '用户收藏数据清空完成' };
        }
        catch (error) {
            this.ctx.status = 500;
            return { success: false, message: '清空用户收藏数据失败', error: error.message };
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", Object)
], AdminController.prototype, "ctx", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", admin_service_1.AdminService)
], AdminController.prototype, "adminService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", blindbox_service_1.BlindBoxService)
], AdminController.prototype, "blindBoxService", void 0);
__decorate([
    (0, core_1.Get)('/dashboard-stats'),
    __param(0, (0, core_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, core_1.Post)('/blindboxes'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBlindBox", null);
__decorate([
    (0, core_1.Get)('/blindboxes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBlindBoxes", null);
__decorate([
    (0, core_1.Put)('/blindboxes/:id'),
    __param(0, (0, core_1.Param)('id')),
    __param(1, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBlindBox", null);
__decorate([
    (0, core_1.Del)('/blindboxes/:id'),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBlindBox", null);
__decorate([
    (0, core_1.Patch)('/blindboxes/:id/toggle'),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleBlindBoxActive", null);
__decorate([
    (0, core_1.Post)('/fix-probability-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "fixProbabilityData", null);
__decorate([
    (0, core_1.Post)('/clear-collections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "clearAllCollections", null);
__decorate([
    (0, core_1.Post)('/clear-user-collection/:userId'),
    __param(0, (0, core_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "clearUserCollection", null);
AdminController = __decorate([
    (0, core_1.Controller)('/api/admin', { middleware: [jwt_middleware_1.JwtMiddleware] })
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2FkbWluLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQW9HO0FBQ3BHLDREQUF3RDtBQUN4RCxrRUFBOEQ7QUFFOUQsaUVBQTZEO0FBR3RELElBQU0sZUFBZSxHQUFyQixNQUFNLGVBQWU7SUFXcEIsQUFBTixLQUFLLENBQUMsaUJBQWlCLENBQXFCLFlBQXNDLEtBQUs7O1FBQ3JGLElBQUk7WUFDRixXQUFXO1lBQ1gsSUFBSSxDQUFBLE1BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSwwQ0FBRSxJQUFJLE1BQUssT0FBTyxFQUFFO2dCQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ3RCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUM1QztZQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FDdkM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUN0QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBR0ssQUFBTixLQUFLLENBQUMsY0FBYyxDQUFTLFlBQWlCOztRQUM1QyxJQUFJO1lBQ0YsV0FBVztZQUNYLElBQUksQ0FBQSxNQUFBLElBQUksQ0FBQyxHQUFH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