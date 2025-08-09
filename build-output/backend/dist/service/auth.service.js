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
exports.AuthService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    async register(username, email, password) {
        const existingUser = await this.userRepository.findOne({
            where: [{ username }, { email }],
        });
        if (existingUser) {
            throw new Error('用户名或邮箱已存在');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(user);
        const userWithoutPassword = { ...savedUser };
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }
    async login(username, password) {
        const user = await this.userRepository.findOne({
            where: { username },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('用户名或密码错误');
        }
        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.expiresIn });
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return { user: userWithoutPassword, token };
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            return null;
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }
    async generateToken(userId, username, role) {
        // 如果没有提供role，从数据库获取
        if (!role) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            role = (user === null || user === void 0 ? void 0 : user.role) || 'customer';
        }
        return jwt.sign({ userId, username, role }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.expiresIn });
    }
    async updateUserAvatar(userId, avatarUrl) {
        await this.userRepository.update(userId, { avatar: avatarUrl });
        return this.getUserById(userId);
    }
    async updateUserProfile(userId, profileData) {
        await this.userRepository.update(userId, profileData);
        return this.getUserById(userId);
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], AuthService.prototype, "userRepository", void 0);
__decorate([
    (0, core_1.Config)('jwt'),
    __metadata("design:type", Object)
], AuthService.prototype, "jwtConfig", void 0);
AuthService = __decorate([
    (0, core_1.Provide)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUNqRCwrQ0FBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLHVEQUE2QztBQUM3QyxtQ0FBbUM7QUFDbkMsb0NBQW9DO0FBRzdCLElBQU0sV0FBVyxHQUFqQixNQUFNLFdBQVc7SUFPdEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFnQixFQUFFLEtBQWEsRUFBRSxRQUFnQjtRQUM5RCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1lBQ3JELEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUNqQyxDQUFDLENBQUM7UUFFSCxJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzlCO1FBRUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztZQUN0QyxRQUFRO1lBQ1IsS0FBSztZQUNMLFFBQVEsRUFBRSxjQUFjO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLENBQUM7UUFDN0MsT0FBTyxtQkFBbUIsQ0FBQyxRQUFRLENBQUM7UUFDcEMsT0FBTyxtQkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQzVDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7WUFDN0MsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFO1NBQ3BCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtRQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQ3BCLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ3JCLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQ3hDLENBQUM7UUFFRixNQUFNLG1CQUFtQixHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLG1CQUFtQixDQUFDLFFBQVEsQ0FBQztRQUNwQyxPQUFPLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQVU7UUFDMUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ3hDLE9BQU8sbUJBQW1CLENBQUMsUUFBUSxDQUFDO1FBQ3BDLE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUUsSUFBYTtRQUNqRSxvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLElBQUksR0FBRyxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLEtBQUksVUFBVSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUNiLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ3JCLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQ3hDLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQWMsRUFBRSxTQUFpQjtRQUN0RCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxXQUFrQztRQUN4RSxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUE7QUEvRUM7SUFBQyxJQUFBLDJCQUFpQixFQUFDLGtCQUFJLENBQUM7OEJBQ1Isb0JBQVU7bURBQU87QUFFakM7SUFBQyxJQUFBLGFBQU0sRUFBQyxLQUFLLENBQUM7OzhDQUNDO0FBTEosV0FBVztJQUR2QixJQUFBLGNBQU8sR0FBRTtHQUNHLFdBQVcsQ0FnRnZCO0FBaEZZLGtDQUFXIn0=