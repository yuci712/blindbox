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
exports.AuthController = void 0;
const core_1 = require("@midwayjs/core");
const auth_service_1 = require("../service/auth.service");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
let AuthController = class AuthController {
    async register(body) {
        try {
            const { username, email, password, role = 'customer' } = body;
            // 真实注册逻辑
            if (!username || !email || !password) {
                return { success: false, message: '请填写所有必填字段' };
            }
            // 验证角色是否有效
            if (role && !['customer', 'admin'].includes(role)) {
                return { success: false, message: '无效的用户角色' };
            }
            const user = await this.authService.register(username, email, password);
            const token = await this.authService.generateToken(user.id, user.username);
            return {
                success: true,
                data: {
                    user,
                    token,
                },
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.message || '注册失败' };
        }
    }
    async login(body) {
        try {
            const { username, password } = body;
            // 真实登录逻辑
            if (!username || !password) {
                return { success: false, message: '请填写用户名和密码' };
            }
            const result = await this.authService.login(username, password);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message || '登录失败' };
        }
    }
    async getProfile() {
        try {
            const userId = this.ctx.state.user.id;
            const user = await this.authService.getUserById(userId);
            if (!user) {
                return { success: false, message: '用户不存在' };
            }
            return { success: true, data: user };
        }
        catch (error) {
            console.error('Get profile error:', error);
            return { success: false, message: '获取用户信息失败' };
        }
    }
    async uploadAvatar(files) {
        var _a;
        console.log('=== 头像上传请求 ===');
        console.log('userId:', (_a = this.ctx.state.user) === null || _a === void 0 ? void 0 : _a.id);
        console.log('files:', (files === null || files === void 0 ? void 0 : files.length) || 0);
        try {
            if (!files || files.length === 0) {
                console.log('❌ 没有文件上传');
                return { success: false, message: '请选择要上传的头像文件' };
            }
            const file = files[0];
            const userId = this.ctx.state.user.id;
            console.log('📁 文件信息:', {
                filename: file.filename,
                mimeType: file.mimeType,
                filepath: file.data
            });
            // 验证文件类型
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.mimeType)) {
                console.log('❌ 文件类型不支持:', file.mimeType);
                return { success: false, message: '只允许上传 JPG、PNG、GIF 格式的图片' };
            }
            // 读取临时文件并获取文件大小
            const fs = require('fs');
            const tempFilePath = file.data; // 这是临时文件路径
            const fileStats = fs.statSync(tempFilePath);
            const fileSize = fileStats.size;
            console.log('📊 文件大小:', fileSize);
            // 验证文件大小 (最大 2MB)
            if (fileSize > 2 * 1024 * 1024) {
                console.log('❌ 文件过大:', fileSize);
                return { success: false, message: '头像文件大小不能超过 2MB' };
            }
            // 创建上传目录
            const now = new Date();
            const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const uploadDir = (0, path_1.join)(__dirname, '../../uploads/images', yearMonth);
            console.log('📂 上传目录:', uploadDir);
            if (!(0, fs_1.existsSync)(uploadDir)) {
                (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
                console.log('✅ 创建目录成功');
            }
            // 生成唯一文件名
            const fileExtension = file.filename.split('.').pop();
            const filename = `${(0, uuid_1.v4)()}.${fileExtension}`;
            const savePath = (0, path_1.join)(uploadDir, filename);
            console.log('💾 保存路径:', savePath);
            // 从临时文件复制到目标位置
            fs.copyFileSync(tempFilePath, savePath);
            console.log('✅ 文件保存成功');
            // 生成头像URL - 使用完整的服务器地址
            const avatarUrl = `http://127.0.0.1:7001/uploads/images/${yearMonth}/${filename}`;
            console.log('🔗 头像URL:', avatarUrl);
            // 更新用户头像
            await this.authService.updateUserAvatar(userId, avatarUrl);
            console.log('✅ 数据库更新成功');
            const result = {
                success: true,
                data: {
                    avatarUrl,
                    message: '头像上传成功'
                }
            };
            console.log('🎉 上传完成，返回结果:', result);
            return result;
        }
        catch (error) {
            console.error('❌ 头像上传失败:', error);
            return { success: false, message: '头像上传失败，请重试' };
        }
    }
    async updateProfile(body) {
        try {
            const userId = this.ctx.state.user.id;
            const { nickname } = body;
            const updatedUser = await this.authService.updateUserProfile(userId, { nickname });
            return {
                success: true,
                data: updatedUser
            };
        }
        catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: '更新用户信息失败' };
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], AuthController.prototype, "authService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", Object)
], AuthController.prototype, "ctx", void 0);
__decorate([
    (0, core_1.Post)('/register'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, core_1.Post)('/login'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, core_1.Get)('/profile', { middleware: [jwt_middleware_1.JwtMiddleware] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, core_1.Post)('/upload-avatar', { middleware: [jwt_middleware_1.JwtMiddleware] }),
    __param(0, (0, core_1.Files)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadAvatar", null);
__decorate([
    (0, core_1.Put)('/profile', { middleware: [jwt_middleware_1.JwtMiddleware] }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
AuthController = __decorate([
    (0, core_1.Controller)('/api/auth')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvYXV0aC5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRjtBQUVqRiwwREFBc0Q7QUFDdEQsaUVBQTZEO0FBQzdELCtCQUE0QjtBQUM1QiwyQkFBMkM7QUFDM0MsK0JBQW9DO0FBRzdCLElBQU0sY0FBYyxHQUFwQixNQUFNLGNBQWM7SUFRbkIsQUFBTixLQUFLLENBQUMsUUFBUSxDQUFTLElBQVM7UUFDOUIsSUFBSTtZQUNGLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEdBQUcsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRTlELFNBQVM7WUFDVCxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUM7YUFDakQ7WUFFRCxXQUFXO1lBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUMvQztZQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTNFLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLElBQUk7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