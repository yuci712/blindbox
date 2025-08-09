"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const user_entity_1 = require("../entity/user.entity");
const blindbox_entity_1 = require("../entity/blindbox.entity");
const order_entity_1 = require("../entity/order.entity");
const user_blindbox_entity_1 = require("../entity/user-blindbox.entity");
const comment_entity_1 = require("../entity/comment.entity");
const player_show_entity_1 = require("../entity/player-show.entity");
exports.default = {
    // use for cookie sign key, should change to your own and keep security
    keys: '1754157449291_8973',
    koa: {
        port: 7001,
        hostname: '0.0.0.0', // 明确绑定到所有接口
    },
    cors: {
        origin: '*',
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
                database: (0, path_1.join)(__dirname, '../../database.sqlite'),
                synchronize: true,
                logging: ['error'],
                entities: [user_entity_1.User, blindbox_entity_1.BlindBox, order_entity_1.Order, user_blindbox_entity_1.UserBlindBox, comment_entity_1.Comment, player_show_entity_1.PlayerShow], // 直接引用实体类
            },
        },
    },
    // 文件上传配置
    upload: {
        mode: 'file',
        fileSize: '10mb',
        whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
        tmpdir: (0, path_1.join)(__dirname, '../../uploads/temp'),
        cleanTimeout: 5 * 60 * 1000,
    },
    // 静态文件服务
    staticFile: {
        dirs: {
            default: {
                prefix: '/uploads/',
                dir: (0, path_1.join)(__dirname, '../../uploads'),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQTRCO0FBQzVCLHVEQUE2QztBQUM3QywrREFBcUQ7QUFDckQseURBQStDO0FBQy9DLHlFQUE4RDtBQUM5RCw2REFBbUQ7QUFDbkQscUVBQTBEO0FBRTFELGtCQUFlO0lBQ2IsdUVBQXVFO0lBQ3ZFLElBQUksRUFBRSxvQkFBb0I7SUFDMUIsR0FBRyxFQUFFO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixRQUFRLEVBQUUsU0FBUyxFQUFFLFlBQVk7S0FDbEM7SUFDRCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxJQUFJO0tBQ2xCO0lBQ0QsU0FBUztJQUNULEdBQUcsRUFBRTtRQUNILE1BQU0sRUFBRSxzQ0FBc0M7UUFDOUMsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxnQkFBZ0I7SUFDaEIsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxRQUFRO2dCQUNkLFFBQVEsRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUM7Z0JBQ2xELFdBQVcsRUFBRSxJQUFJO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLFFBQVEsRUFBRSxDQUFDLGtCQUFJLEVBQUUsMEJBQVEsRUFBRSxvQkFBSyxFQUFFLG1DQUFZLEVBQUUsd0JBQU8sRUFBRSwrQkFBVSxDQUFDLEVBQUUsVUFBVTthQUNqRjtTQUNGO0tBQ0Y7SUFDRCxTQUFTO0lBQ1QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsTUFBTTtRQUNoQixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDNUMsTUFBTSxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztRQUM3QyxZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJO0tBQzVCO0lBQ0QsU0FBUztJQUNULFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsR0FBRyxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxlQUFlLENBQUM7YUFDdEM7U0FDRjtLQUNGO0NBQ2MsQ0FBQyJ9