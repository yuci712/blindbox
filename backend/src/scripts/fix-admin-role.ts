import { createConnection, getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import { join } from 'path';

async function fixAdminRole() {
  try {
    // 连接数据库
    const connection = await createConnection({
      type: 'sqlite',
      database: join(__dirname, '../../database.sqlite'),
      entities: [User],
      synchronize: false,
    });

    const userRepository = getRepository(User);

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
        console.log(`更新后的 Admin 用户角色: ${updatedAdmin?.role}`);
      } else {
        console.log('✅ Admin 用户角色已经是 admin，无需更新');
      }
    } else {
      console.log('❌ 未找到 admin 用户');
    }

    await connection.close();
  } catch (error) {
    console.error('修复管理员角色失败:', error);
  }
}

fixAdminRole();
