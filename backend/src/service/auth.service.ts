import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @Config('jwt')
  jwtConfig: any;

  async register(username: string, email: string, password: string) {
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

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('用户名或密码错误');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      this.jwtConfig.secret,
      { expiresIn: this.jwtConfig.expiresIn }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  async generateToken(userId: number, username: string, role?: string) {
    // 如果没有提供role，从数据库获取
    if (!role) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      role = user?.role || 'customer';
    }
    
    return jwt.sign(
      { userId, username, role },
      this.jwtConfig.secret,
      { expiresIn: this.jwtConfig.expiresIn }
    );
  }

  async updateUserAvatar(userId: number, avatarUrl: string) {
    await this.userRepository.update(userId, { avatar: avatarUrl });
    return this.getUserById(userId);
  }

  async updateUserProfile(userId: number, profileData: { nickname?: string }) {
    await this.userRepository.update(userId, profileData);
    return this.getUserById(userId);
  }
}
