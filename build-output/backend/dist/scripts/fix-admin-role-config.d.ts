import { ILifeCycle } from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
export declare class FixAdminRoleConfig implements ILifeCycle {
    app: Application;
    onReady(): Promise<void>;
}
