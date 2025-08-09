import { Context } from '@midwayjs/koa';
export declare class UploadController {
    ctx: Context;
    uploadImage(files: any[]): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            imageUrl: string;
            filename: string;
            originalName: any;
            size: any;
            mimeType: any;
        };
        message?: undefined;
    }>;
}
