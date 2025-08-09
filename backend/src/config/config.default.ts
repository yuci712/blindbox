import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';
import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';
import { Order } from '../entity/order.entity';
import { UserBlindBox } from '../entity/user-blindbox.entity';
import { Comment } from '../entity/comment.entity';
import { PlayerShow } from '../entity/player-show.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1754157449291_8973',
  koa: {
    port: 7001,
    hostname: '0.0.0.0', // 明确绑定到所有接口
  },
  cors: {
    origin: '*', // 允许所有来源，避免端口变化导致的跨域问题
    credentials: true,
  },
  // JWT 配置
  jwt: {
    secret: 'your-secret-key-change-in-production',
    expiresIn: '7d',
  },
  // TypeORM 数据库配置
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: join(__dirname, '../../database.sqlite'), // 使用 join 确保路径正确
        synchronize: true, // 开发环境自动同步
        logging: ['error'],
        entities: [User, BlindBox, Order, UserBlindBox, Comment, PlayerShow], // 直接引用实体类
      },
    },
  },
  // 文件上传配置
  upload: {
    mode: 'file',
    fileSize: '10mb',
    whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
    tmpdir: join(__dirname, '../../uploads/temp'),
    cleanTimeout: 5 * 60 * 1000,
  },
  // 静态文件服务
  staticFile: {
    dirs: {
      default: {
        prefix: '/uploads/',
        dir: join(__dirname, '../../uploads'),
      },
    },
  },
} as MidwayConfig;
