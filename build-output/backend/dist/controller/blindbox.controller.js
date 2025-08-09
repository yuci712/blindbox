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
exports.BlindBoxController = void 0;
const core_1 = require("@midwayjs/core");
const blindbox_service_1 = require("../service/blindbox.service");
let BlindBoxController = class BlindBoxController {
    async getBlindBoxes(page = 1, limit = 10, category) {
        try {
            const result = await this.blindBoxService.getAllBlindBoxes(Number(page), Number(limit), category);
            return { success: true, data: result };
        }
        catch (error) {
            console.error('获取盲盒列表失败:', error);
            return { success: false, message: 'Failed to get blind boxes' };
        }
    }
    async getCategories() {
        try {
            const categories = await this.blindBoxService.getCategories();
            return { success: true, data: categories };
        }
        catch (error) {
            console.error('获取分类失败:', error);
            return { success: false, message: 'Failed to get categories' };
        }
    }
    async searchBlindBoxes(keyword, page = 1, limit = 10) {
        if (!keyword || keyword.trim().length === 0) {
            return { success: false, message: '搜索关键词不能为空' };
        }
        if (keyword.trim().length < 2) {
            return { success: false, message: '搜索关键词至少需要2个字符' };
        }
        try {
            const result = await this.blindBoxService.searchBlindBoxes(keyword.trim(), Number(page), Number(limit));
            return { success: true, data: result };
        }
        catch (error) {
            console.error('搜索盲盒失败:', error);
            return { success: false, message: 'Search failed' };
        }
    }
    async getBlindBoxById(id) {
        try {
            const blindBox = await this.blindBoxService.getBlindBoxById(Number(id));
            if (!blindBox) {
                return { success: false, message: 'Blind box not found' };
            }
            return { success: true, data: blindBox };
        }
        catch (error) {
            console.error('获取盲盒详情失败:', error);
            return { success: false, message: 'Failed to get blind box' };
        }
    }
    async drawBlindBox(blindBoxId, body) {
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
            const result = await this.blindBoxService.drawBlindBox(Number(blindBoxId), Number(body.userId));
            return {
                success: true,
                data: result,
                message: '抽取成功',
            };
        }
        catch (error) {
            console.error('抽奖失败:', error);
            return {
                success: false,
                message: error.message || '抽取失败',
            };
        }
    }
    async getUserBlindBoxes(userId) {
        try {
            const result = await this.blindBoxService.getUserBlindBoxes(Number(userId));
            return { success: true, data: result };
        }
        catch (error) {
            console.error('获取用户盲盒失败:', error);
            return { success: false, message: 'Failed to get user blind boxes' };
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", blindbox_service_1.BlindBoxService)
], BlindBoxController.prototype, "blindBoxService", void 0);
__decorate([
    (0, core_1.Get)('/'),
    __param(0, (0, core_1.Query)('page')),
    __param(1, (0, core_1.Query)('limit')),
    __param(2, (0, core_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "getBlindBoxes", null);
__decorate([
    (0, core_1.Get)('/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "getCategories", null);
__decorate([
    (0, core_1.Get)('/search'),
    __param(0, (0, core_1.Query)('keyword')),
    __param(1, (0, core_1.Query)('page')),
    __param(2, (0, core_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "searchBlindBoxes", null);
__decorate([
    (0, core_1.Get)('/:id'),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "getBlindBoxById", null);
__decorate([
    (0, core_1.Post)('/draw/:id'),
    __param(0, (0, core_1.Param)('id')),
    __param(1, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "drawBlindBox", null);
__decorate([
    (0, core_1.Get)('/user/:userId'),
    __param(0, (0, core_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BlindBoxController.prototype, "getUserBlindBoxes", null);
BlindBoxController = __decorate([
    (0, core_1.Controller)('/api/blindboxes')
], BlindBoxController);
exports.BlindBoxController = BlindBoxController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxpbmRib3guY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2JsaW5kYm94LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQW1GO0FBQ25GLGtFQUE4RDtBQUd2RCxJQUFNLGtCQUFrQixHQUF4QixNQUFNLGtCQUFrQjtJQUt2QixBQUFOLEtBQUssQ0FBQyxhQUFhLENBQ0YsT0FBTyxDQUFDLEVBQ1AsUUFBUSxFQUFFLEVBQ1AsUUFBaUI7UUFFcEMsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUNaLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFDYixRQUFRLENBQ1QsQ0FBQztZQUNGLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUN4QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLENBQUM7U0FDakU7SUFDSCxDQUFDO0lBR0ssQUFBTixLQUFLLENBQUMsYUFBYTtRQUNqQixJQUFJO1lBQ0YsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUM1QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVB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