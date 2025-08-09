import { Configuration, App, ILifeCycle } from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';

@Configuration({
  imports: [],
})
export class FixAdminRoleConfig implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {
    try {
      const container = this.app.getApplicationContext();
      const authService = await container.getAsync(AuthService);
      
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
        } else {
          console.log('✅ Admin 用户角色已经是 admin');
        }
      }
    } catch (error) {
      console.error('修复管理员角色失败:', error);
    }
  }
}
