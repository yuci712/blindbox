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
exports.FixAdminRoleConfig = void 0;
const core_1 = require("@midwayjs/core");
const auth_service_1 = require("../service/auth.service");
let FixAdminRoleConfig = class FixAdminRoleConfig {
    async onReady() {
        try {
            const container = this.app.getApplicationContext();
            const authService = await container.getAsync(auth_service_1.AuthService);
            // 获取用户仓库
            const userRepository = authService.userRepository;
            // 查找所有用户
            const users = await userRepository.find();
            console.log('所有用户:');
            users.forEach(user => {
                console.log(`ID: ${user.id}, 用户名: ${user.username}, 角色: ${user.role || '未设置'}`);
            });
            // 检查并修复 admin 用户
            const adminUser = await userRepository.findOne({ where: { username: 'admin' } });
            if (adminUser) {
                console.log(`\nAdmin 用户当前角色: ${adminUser.role}`);
                if (adminUser.role !== 'admin') {
                    await userRepository.update(adminUser.id, { role: 'admin' });
                    console.log('✅ Admin 用户角色已更新为 admin');
                }
                else {
                    console.log('✅ Admin 用户角色已经是 admin');
                }
            }
        }
        catch (error) {
            console.error('修复管理员角色失败:', error);
        }
    }
};
__decorate([
    (0, core_1.App)(),
    __metadata("design:type", Object)
], FixAdminRoleConfig.prototype, "app", void 0);
FixAdminRoleConfig = __decorate([
    (0, core_1.Configuration)({
        imports: [],
    })
], FixAdminRoleConfig);
exports.FixAdminRoleConfig = FixAdminRoleConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LWFkbWluLXJvbGUtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdHMvZml4LWFkbWluLXJvbGUtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRTtBQUVoRSwwREFBc0Q7QUFLL0MsSUFBTSxrQkFBa0IsR0FBeEIsTUFBTSxrQkFBa0I7SUFJN0IsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJO1lBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ25ELE1BQU0sV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQywwQkFBVyxDQUFDLENBQUM7WUFFMUQsU0FBUztZQUNULE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUM7WUFFbEQsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLFVBQVUsSUFBSSxDQUFDLFFBQVEsU0FBUyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEYsQ0FBQyxDQUFDLENBQUM7WUFFSCxpQkFBaUI7WUFDakIsTUFBTSxTQUFTLEdBQUcsTUFBTSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVqRixJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFFakQsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtvQkFDOUIsTUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ3RDO2FBQ0Y7U0FDRjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQW5DQztJQUFDLElBQUEsVUFBRyxHQUFFOzsrQ0FDVztBQUZOLGtCQUFrQjtJQUg5QixJQUFBLG9CQUFhLEVBQUM7UUFDYixPQUFPLEVBQUUsRUFBRTtLQUNaLENBQUM7R0FDVyxrQkFBa0IsQ0FvQzlCO0FBcENZLGdEQUFrQiJ9