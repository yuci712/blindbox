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
exports.ContainerLifeCycle = void 0;
const core_1 = require("@midwayjs/core");
const koa = require("@midwayjs/koa");
const validate = require("@midwayjs/validate");
const info = require("@midwayjs/info");
const typeorm = require("@midwayjs/typeorm");
const upload = require("@midwayjs/upload");
const path_1 = require("path");
const cors = require("@koa/cors");
const default_filter_1 = require("./filter/default.filter");
const notfound_filter_1 = require("./filter/notfound.filter");
const report_middleware_1 = require("./middleware/report.middleware");
const data_init_service_1 = require("./service/data-init.service");
let ContainerLifeCycle = class ContainerLifeCycle {
    async onReady() {
        // 添加CORS中间件 - 开发环境使用宽松配置
        this.app.use(cors({
            origin: '*',
            credentials: false,
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        }));
        // 添加静态文件服务 - 使用路由方式
        this.app.use(async (ctx, next) => {
            var _a;
            if (ctx.path.startsWith('/uploads/')) {
                const filePath = (0, path_1.join)(__dirname, '..', ctx.path);
                try {
                    const fs = require('fs').promises;
                    const stat = await fs.stat(filePath);
                    if (stat.isFile()) {
                        const content = await fs.readFile(filePath);
                        const ext = (_a = ctx.path.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        // 设置正确的 Content-Type
                        if (ext === 'png')
                            ctx.type = 'image/png';
                        else if (ext === 'jpg' || ext === 'jpeg')
                            ctx.type = 'image/jpeg';
                        else if (ext === 'gif')
                            ctx.type = 'image/gif';
                        else if (ext === 'svg')
                            ctx.type = 'image/svg+xml';
                        ctx.body = content;
                        return;
                    }
                }
                catch (error) {
                    // 文件不存在，继续到下一个中间件
                }
            }
            await next();
        });
        // add middleware
        this.app.useMiddleware([report_middleware_1.ReportMiddleware]);
        // add filter
        this.app.useFilter([notfound_filter_1.NotFoundFilter, default_filter_1.DefaultErrorFilter]);
        // 初始化示例数据
        const dataInitService = await this.app.getApplicationContext().getAsync(data_init_service_1.DataInitService);
        await dataInitService.initSampleData();
    }
};
__decorate([
    (0, core_1.App)(),
    __metadata("design:type", Object)
], ContainerLifeCycle.prototype, "app", void 0);
ContainerLifeCycle = __decorate([
    (0, core_1.Configuration)({
        imports: [
            koa,
            validate,
            info,
            typeorm,
            upload,
        ],
        importConfigs: [(0, path_1.join)(__dirname, './config')],
    })
], ContainerLifeCycle);
exports.ContainerLifeCycle = ContainerLifeCycle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFvRDtBQUNwRCxxQ0FBcUM7QUFDckMsK0NBQStDO0FBQy9DLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLCtCQUE0QjtBQUM1QixrQ0FBa0M7QUFDbEMsNERBQTZEO0FBQzdELDhEQUEwRDtBQUMxRCxzRUFBa0U7QUFDbEUsbUVBQThEO0FBWXZELElBQU0sa0JBQWtCLEdBQXhCLE1BQU0sa0JBQWtCO0lBSTdCLEtBQUssQ0FBQyxPQUFPO1FBQ1gseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNoQixNQUFNLEVBQUUsR0FBRztZQUNYLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO1lBQ2xFLFlBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUM7U0FDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSixvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTs7WUFDL0IsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDcEMsTUFBTSxRQUFRLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpELElBQUk7b0JBQ0YsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDbEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTt3QkFDakIsTUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM1QyxNQUFNLEdBQUcsR0FBRyxNQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSwwQ0FBRSxXQUFXLEVBQUUsQ0FBQzt3QkFFckQscUJBQXFCO3dCQUNyQixJQUFJLEdBQUcsS0FBSyxLQUFLOzRCQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDOzZCQUNyQyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU07NEJBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7NkJBQzdELElBQUksR0FBRyxLQUFLLEtBQUs7NEJBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7NkJBQzFDLElBQUksR0FBRyxLQUFLLEtBQUs7NEJBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7d0JBRW5ELEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3dCQUNuQixPQUFPO3FCQUNSO2lCQUNGO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLGtCQUFrQjtpQkFDbkI7YUFDRjtZQUNELE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUVILGlCQUFpQjtRQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9DQUFnQixDQUFDLENBQUMsQ0FBQztRQUMzQyxhQUFhO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQ0FBYyxFQUFFLG1DQUFrQixDQUFDLENBQUMsQ0FBQztRQUV6RCxVQUFVO1FBQ1YsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsUUFBUSxDQUFDLG1DQUFlLENBQUMsQ0FBQztRQUN6RixNQUFNLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0NBQ0YsQ0FBQTtBQWpEQztJQUFDLElBQUEsVUFBRyxHQUFFOzsrQ0FDZTtBQUZWLGtCQUFrQjtJQVY5QixJQUFBLG9CQUFhLEVBQUM7UUFDYixPQUFPLEVBQUU7WUFDUCxHQUFHO1lBQ0gsUUFBUTtZQUNSLElBQUk7WUFDSixPQUFPO1lBQ1AsTUFBTTtTQUNQO1FBQ0QsYUFBYSxFQUFFLENBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzdDLENBQUM7R0FDVyxrQkFBa0IsQ0FrRDlCO0FBbERZLGdEQUFrQiJ9