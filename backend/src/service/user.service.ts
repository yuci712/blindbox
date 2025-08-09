import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUserOptions } from '../interface';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepository: Repository<User>;

  async getUser(options: IUserOptions) {
    // 从数据库获取真实用户数据
    const user = await this.userRepository.findOne({ where: { id: options.uid } });
    if (!user) {
      return null;
    }

    return {
      uid: user.id,
      username: user.username,
      phone: '', // User实体没有phone字段，返回空字符串
      email: user.email,
    };
  }

  // 根据ID获取用户
  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  // 检查用户是否为管理员
  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user?.role === 'admin';
  }

  // 获取所有用户（管理员功能）
  async getAllUsers() {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  // 更新用户角色（管理员功能）
  async updateUserRole(userId: number, role: string) {
    if (!['admin', 'customer'].includes(role)) {
      throw new Error('无效的用户角色');
    }

    await this.userRepository.update(userId, { role });
    return await this.getUserById(userId);
  }
}
