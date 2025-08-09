import { IMiddleware, NextFunction } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
export declare class JwtMiddleware implements IMiddleware<Context, NextFunction> {
    jwtConfig: {
        secret: string;
    };
    resolve(): (ctx: Context, next: NextFunction) => Promise<void>;
}
