"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
                synchronize: false,
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWU7SUFDYix1RUFBdUU7SUFDdkUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLG9CQUFvQjtJQUNyRCxHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQztRQUMxQyxJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksb0NBQW9DO1lBQ3hFLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0Y7SUFDRCxTQUFTO0lBQ1QsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHNDQUFzQztRQUN4RSxTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELHdCQUF3QjtJQUN4QixPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDbEIsUUFBUSxFQUFFLENBQUMseUJBQXlCLENBQUM7YUFDdEM7U0FDRjtLQUNGO0lBQ0QsT0FBTztJQUNQLFlBQVksRUFBRTtRQUNaLE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRSxNQUFNO1lBQ2IsWUFBWSxFQUFFLE1BQU07U0FDckI7S0FDRjtJQUNELE9BQU87SUFDUCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsS0FBSyxFQUFFLGdCQUFnQjtTQUNoQztLQUNGO0NBQ2MsQ0FBQyJ9