"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const path_1 = require("path");
async function fixAdminRole() {
    try {
        // 连接数据库
        const connection = await (0, typeorm_1.createConnection)({
            type: 'sqlite',
            database: (0, path_1.join)(__dirname, '../../database.sqlite'),
            entities: [user_entity_1.User],
            synchronize: false,
        });
        const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
        // 查找所有用户
        const users = await userRepository.find();
        console.log('所有用户:');
        users.forEach(user => {
            console.log(`ID: ${user.id}, 用户名: ${user.username}, 角色: ${user.role || '未设置'}`);
        });
        // 检查 admin 用户
        const adminUser = await userRepository.findOne({ where: { username: 'admin' } });
        if (adminUser) {
            console.log(`\nAdmin 用户当前角色: ${adminUser.role}`);
            if (adminUser.role !== 'admin') {
                // 更新 admin 用户角色
                await userRepository.update(adminUser.id, { role: 'admin' });
                console.log('✅ Admin 用户角色已更新为 admin');
                // 验证更新
                const updatedAdmin = await userRepository.findOne({ where: { username: 'admin' } });
                console.log(`更新后的 Admin 用户角色: ${updatedAdmin === null || updatedAdmin === void 0 ? void 0 : updatedAdmin.role}`);
            }
            else {
                console.log('✅ Admin 用户角色已经是 admin，无需更新');
            }
        }
        else {
            console.log('❌ 未找到 admin 用户');
        }
        await connection.close();
    }
    catch (error) {
        console.error('修复管理员角色失败:', error);
    }
}
fixAdminRole();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LWFkbWluLXJvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9maXgtYWRtaW4tcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUEwRDtBQUMxRCx1REFBNkM7QUFDN0MsK0JBQTRCO0FBRTVCLEtBQUssVUFBVSxZQUFZO0lBQ3pCLElBQUk7UUFDRixRQUFRO1FBQ1IsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLDBCQUFnQixFQUFDO1lBQ3hDLElBQUksRUFBRSxRQUFRO1lBQ2QsUUFBUSxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQztZQUNsRCxRQUFRLEVBQUUsQ0FBQyxrQkFBSSxDQUFDO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLElBQUEsdUJBQWEsRUFBQyxrQkFBSSxDQUFDLENBQUM7UUFFM0MsU0FBUztRQUNULE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsVUFBVSxJQUFJLENBQUMsUUFBUSxTQUFTLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUMsQ0FBQztRQUVILGNBQWM7UUFDZCxNQUFNLFNBQVMsR0FBRyxNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpGLElBQUksU0FBUyxFQUFFO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFakQsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDOUIsZ0JBQWdCO2dCQUNoQixNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBRXRDLE9BQU87Z0JBQ1AsTUFBTSxZQUFZLEdBQUcsTUFBTSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDcEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDdkQ7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMvQjtRQUVELE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzFCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwQztBQUNILENBQUM7QUFFRCxZQUFZLEVBQUUsQ0FBQyJ9