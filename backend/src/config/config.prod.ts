import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: process.env.COOKIE_KEYS || '1754157449291_8973',
  koa: {
    port: parseInt(process.env.PORT || '7001'),
    cors: {
      origin: process.env.FRONTEND_URL || 'https://your-production-domain.com',
      credentials: true,
    },
  },
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d',
  },
  // 生产环境数据库配置 - 使用 SQLite
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: false, // 生产环境不自动同步
        logging: ['error'],
        entities: ['dist/entity/*.entity.js'],
      },
    },
  },
  // 日志配置
  midwayLogger: {
    default: {
      level: 'info',
      consoleLevel: 'info',
    },
  },
  // 安全配置
  security: {
    csrf: {
      enable: false, // API 模式关闭 CSRF
    },
  },
} as MidwayConfig;
