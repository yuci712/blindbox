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
exports.JwtMiddleware = void 0;
const core_1 = require("@midwayjs/core");
const jwt = require("jsonwebtoken");
let JwtMiddleware = class JwtMiddleware {
    resolve() {
        return async (ctx, next) => {
            // 跳过不需要认证的路由
            const skipAuthPaths = [
                '/api/auth/login',
                '/api/auth/register',
            ];
            const allowAnonymousGET = [
                '/api/blindboxes/categories',
                '/api/blindboxes',
                '/api/player-show'
            ];
            const path = ctx.path;
            // 登录注册始终跳过认证
            if (skipAuthPaths.some(skipPath => path.startsWith(skipPath))) {
                await next();
                return;
            }
            // 某些路径的GET请求允许匿名访问
            if (allowAnonymousGET.some(skipPath => path.startsWith(skipPath)) && ctx.method === 'GET') {
                await next();
                return;
            }
            try {
                const authHeader = ctx.headers.authorization;
                console.log('Authorization header:', authHeader);
                const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace('Bearer ', '');
                console.log('Extracted token:', token ? `${token.substring(0, 20)}...` : 'none');
                if (!token) {
                    console.log('JWT: No token provided');
                    ctx.status = 401;
                    ctx.body = { success: false, message: '未提供认证令牌' };
                    return;
                }
                const decoded = jwt.verify(token, this.jwtConfig.secret);
                console.log('JWT decoded:', decoded);
                ctx.state.user = {
                    id: decoded.userId,
                    userId: decoded.userId,
                    username: decoded.username,
                    role: decoded.role
                };
                console.log('User set in ctx.state:', ctx.state.user);
                await next();
            }
            catch (error) {
                console.error('JWT verification error:', error);
                ctx.status = 401;
                ctx.body = { success: false, message: '无效的认证令牌' };
                return;
            }
        };
    }
};
__decorate([
    (0, core_1.Config)('jwt'),
    __metadata("design:type", Object)
], JwtMiddleware.prototype, "jwtConfig", void 0);
JwtMiddleware = __decorate([
    (0, core_1.Middleware)()
], JwtMiddleware);
exports.JwtMiddleware = JwtMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9qd3QubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBK0U7QUFFL0Usb0NBQW9DO0FBRzdCLElBQU0sYUFBYSxHQUFuQixNQUFNLGFBQWE7SUFJeEIsT0FBTztRQUNMLE9BQU8sS0FBSyxFQUFFLEdBQVksRUFBRSxJQUFrQixFQUFFLEVBQUU7WUFDaEQsYUFBYTtZQUNiLE1BQU0sYUFBYSxHQUFHO2dCQUNwQixpQkFBaUI7Z0JBQ2pCLG9CQUFvQjthQUNyQixDQUFDO1lBRUYsTUFBTSxpQkFBaUIsR0FBRztnQkFDeEIsNEJBQTRCO2dCQUM1QixpQkFBaUI7Z0JBQ2pCLGtCQUFrQjthQUNuQixDQUFDO1lBRUYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUV0QixhQUFhO1lBQ2IsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM3RCxNQUFNLElBQUksRUFBRSxDQUFDO2dCQUNiLE9BQU87YUFDUjtZQUVELG1CQUFtQjtZQUNuQixJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtnQkFDekYsTUFBTSxJQUFJLEVBQUUsQ0FBQztnQkFDYixPQUFPO2FBQ1I7WUFFRCxJQUFJO2dCQUNGLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVqRCxNQUFNLEtBQUssR0FBRyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWpGLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO29CQUN0QyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO29CQUNsRCxPQUFPO2lCQUNSO2dCQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFRLENBQUM7Z0JBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUVyQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRztvQkFDZixFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ2xCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtvQkFDdEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO29CQUMxQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7aUJBQ25CLENBQUM7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLElBQUksRUFBRSxDQUFDO2FBQ2Q7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO2dCQUNsRCxPQUFPO2FBQ1I7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQTtBQWpFQztJQUFDLElBQUEsYUFBTSxFQUFDLEtBQUssQ0FBQzs7Z0RBQ2dCO0FBRm5CLGFBQWE7SUFEekIsSUFBQSxpQkFBVSxHQUFFO0dBQ0EsYUFBYSxDQWtFekI7QUFsRVksc0NBQWEifQ==