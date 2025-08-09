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
exports.UserService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
let UserService = class UserService {
    async getUser(options) {
        // 从数据库获取真实用户数据
        const user = await this.userRepository.findOne({ where: { id: options.uid } });
        if (!user) {
            return null;
        }
        return {
            uid: user.id,
            username: user.username,
            phone: '',
            email: user.email,
        };
    }
    // 根据ID获取用户
    async getUserById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    // 检查用户是否为管理员
    async isAdmin(userId) {
        const user = await this.getUserById(userId);
        return (user === null || user === void 0 ? void 0 : user.role) === 'admin';
    }
    // 获取所有用户（管理员功能）
    async getAllUsers() {
        return await this.userRepository.find({
            select: ['id', 'username', 'email', 'role', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }
    // 更新用户角色（管理员功能）
    async updateUserRole(userId, role) {
        if (!['admin', 'customer'].includes(role)) {
            throw new Error('无效的用户角色');
        }
        await this.userRepository.update(userId, { role });
        return await this.getUserById(userId);
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
UserService = __decorate([
    (0, core_1.Provide)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5QztBQUN6QywrQ0FBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLHVEQUE2QztBQUl0QyxJQUFNLFdBQVcsR0FBakIsTUFBTSxXQUFXO0lBSXRCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBcUI7UUFDakMsZUFBZTtRQUNmLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO0lBQ1gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFVO1FBQzFCLE9BQU8sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsYUFBYTtJQUNiLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYztRQUMxQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLE1BQUssT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7WUFDcEMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQztZQUN4RCxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFjLEVBQUUsSUFBWTtRQUMvQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUI7UUFFRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkQsT0FBTyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNGLENBQUE7QUE5Q0M7SUFBQyxJQUFBLDJCQUFpQixFQUFDLGtCQUFJLENBQUM7OEJBQ1Isb0JBQVU7bURBQU87QUFGdEIsV0FBVztJQUR2QixJQUFBLGNBQU8sR0FBRTtHQUNHLFdBQVcsQ0ErQ3ZCO0FBL0NZLGtDQUFXIn0=