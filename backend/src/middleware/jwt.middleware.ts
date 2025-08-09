import { Middleware, IMiddleware, NextFunction, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('jwt')
  jwtConfig: { secret: string };

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
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
        
        const token = authHeader?.replace('Bearer ', '');
        console.log('Extracted token:', token ? `${token.substring(0, 20)}...` : 'none');

        if (!token) {
          console.log('JWT: No token provided');
          ctx.status = 401;
          ctx.body = { success: false, message: '未提供认证令牌' };
          return;
        }

        const decoded = jwt.verify(token, this.jwtConfig.secret) as any;
        console.log('JWT decoded:', decoded);
        
        ctx.state.user = {
          id: decoded.userId,
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role
        };

        console.log('User set in ctx.state:', ctx.state.user);
        await next();
      } catch (error) {
        console.error('JWT verification error:', error);
        ctx.status = 401;
        ctx.body = { success: false, message: '无效的认证令牌' };
        return;
      }
    };
  }
}
