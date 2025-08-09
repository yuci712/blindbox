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
exports.ShowcaseController = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const user_blindbox_entity_1 = require("../entity/user-blindbox.entity");
let ShowcaseController = class ShowcaseController {
    async getShowcaseItems(filter = 'all', page = 1, limit = 10) {
        try {
            const pageNum = typeof page === 'string' ? parseInt(page) : page;
            const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
            const skip = (pageNum - 1) * limitNum;
            // 从数据库获取真实的用户盲盒数据
            const queryBuilder = this.userBlindBoxRepository
                .createQueryBuilder('ub')
                .leftJoinAndSelect('ub.user', 'user')
                .leftJoinAndSelect('ub.blindBox', 'blindBox')
                .orderBy('ub.obtainedAt', 'DESC')
                .skip(skip)
                .take(limitNum);
            // 根据稀有度过滤
            if (filter !== 'all') {
                if (filter === 'rare') {
                    queryBuilder.andWhere("JSON_EXTRACT(ub.item, '$.rarity') = 'SSR'");
                }
                else if (filter === 'normal') {
                    queryBuilder.andWhere("JSON_EXTRACT(ub.item, '$.rarity') IN ('N', 'R', 'SR')");
                }
            }
            const userBlindBoxes = await queryBuilder.getMany();
            const total = await queryBuilder.getCount();
            // 转换为展示格式
            const items = userBlindBoxes.map(ub => ({
                id: ub.id,
                userId: ub.userId,
                user: {
                    id: ub.user.id,
                    username: ub.user.username,
                    email: ub.user.email,
                    avatar: ub.user.avatar || null,
                    createdAt: ub.user.createdAt,
                    updatedAt: ub.user.updatedAt,
                },
                blindBoxName: ub.blindBox.name,
                itemName: ub.item.name,
                itemImage: ub.item.image || null,
                rarity: ub.item.rarity,
                description: `获得了${ub.item.rarity}级稀有度的${ub.item.name}！`,
                likes: 0,
                comments: 0,
                isLiked: false,
                createdAt: ub.obtainedAt,
            }));
            return {
                success: true,
                data: {
                    items,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        pages: Math.ceil(total / limitNum)
                    }
                }
            };
        }
        catch (error) {
            console.error('Get showcase items error:', error);
            return { success: false, message: '获取展示数据失败' };
        }
    }
    async getShowcaseItem(id) {
        try {
            const userBlindBox = await this.userBlindBoxRepository
                .createQueryBuilder('ub')
                .leftJoinAndSelect('ub.user', 'user')
                .leftJoinAndSelect('ub.blindBox', 'blindBox')
                .where('ub.id = :id', { id })
                .getOne();
            if (!userBlindBox) {
                return { success: false, message: '展示项目不存在' };
            }
            const showcaseItem = {
                id: userBlindBox.id,
                userId: userBlindBox.userId,
                user: {
                    id: userBlindBox.user.id,
                    username: userBlindBox.user.username,
                    email: userBlindBox.user.email,
                    avatar: userBlindBox.user.avatar || null,
                    createdAt: userBlindBox.user.createdAt,
                    updatedAt: userBlindBox.user.updatedAt,
                },
                blindBoxName: userBlindBox.blindBox.name,
                itemName: userBlindBox.item.name,
                itemImage: userBlindBox.item.image || null,
                rarity: userBlindBox.item.rarity,
                description: `获得了${userBlindBox.item.rarity}级稀有度的${userBlindBox.item.name}！`,
                likes: 0,
                comments: 0,
                isLiked: false,
                createdAt: userBlindBox.obtainedAt,
            };
            return { success: true, data: showcaseItem };
        }
        catch (error) {
            console.error('Get showcase item error:', error);
            return { success: false, message: '获取展示项目失败' };
        }
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_blindbox_entity_1.UserBlindBox),
    __metadata("design:type", typeorm_2.Repository)
], ShowcaseController.prototype, "userBlindBoxRepository", void 0);
__decorate([
    (0, core_1.Get)('/'),
    __param(0, (0, core_1.Query)('filter')),
    __param(1, (0, core_1.Query)('page')),
    __param(2, (0, core_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ShowcaseController.prototype, "getShowcaseItems", null);
__decorate([
    (0, core_1.Get)('/:id'),
    __param(0, (0, core_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowcaseController.prototype, "getShowcaseItem", null);
ShowcaseController = __decorate([
    (0, core_1.Controller)('/api/showcase')
], ShowcaseController);
exports.ShowcaseController = ShowcaseController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd2Nhc2UuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3Nob3djYXNlLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXdEO0FBQ3hELCtDQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMseUVBQThEO0FBR3ZELElBQU0sa0JBQWtCLEdBQXhCLE1BQU0sa0JBQWtCO0lBS3ZCLEFBQU4sS0FBSyxDQUFDLGdCQUFnQixDQUNILFNBQVMsS0FBSyxFQUNoQixPQUFPLENBQUMsRUFDUCxRQUFRLEVBQUU7UUFFMUIsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakUsTUFBTSxRQUFRLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyRSxNQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7WUFFdEMsa0JBQWtCO1lBQ2xCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxzQkFBc0I7aUJBQzdDLGtCQUFrQixDQUFDLElBQUksQ0FBQztpQkFDeEIsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztpQkFDcEMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQztpQkFDNUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7aUJBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxCLFVBQVU7WUFDVixJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7Z0JBQ3BCLElBQUksTUFB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