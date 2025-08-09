import { Context } from '@midwayjs/koa';
export declare class UploadService {
    ctx: Context;
    upload(files: any[]): Promise<any[]>;
}
