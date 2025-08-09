import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import * as upload from '@midwayjs/upload';
import { join } from 'path';
import * as cors from '@koa/cors';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { DataInitService } from './service/data-init.service';

@Configuration({
  imports: [
    koa,
    validate,
    info,
    typeorm,
    upload,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // 添加CORS中间件 - 开发环境使用宽松配置
    this.app.use(cors({
      origin: '*', // 允许所有来源（仅开发环境）
      credentials: false, // 与origin: '*'一起使用时必须为false
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // 添加静态文件服务 - 使用路由方式
    this.app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/uploads/')) {
        const filePath = join(__dirname, '..', ctx.path);
        
        try {
          const fs = require('fs').promises;
          const stat = await fs.stat(filePath);
          if (stat.isFile()) {
            const content = await fs.readFile(filePath);
            const ext = ctx.path.split('.').pop()?.toLowerCase();
            
            // 设置正确的 Content-Type
            if (ext === 'png') ctx.type = 'image/png';
            else if (ext === 'jpg' || ext === 'jpeg') ctx.type = 'image/jpeg';
            else if (ext === 'gif') ctx.type = 'image/gif';
            else if (ext === 'svg') ctx.type = 'image/svg+xml';
            
            ctx.body = content;
            return;
          }
        } catch (error) {
          // 文件不存在，继续到下一个中间件
        }
      }
      await next();
    });

    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);

    // 初始化示例数据
    const dataInitService = await this.app.getApplicationContext().getAsync(DataInitService);
    await dataInitService.initSampleData();
  }
}
