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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const core_1 = require("@midwayjs/core");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const uuid_1 = require("uuid");
let UploadController = class UploadController {
    async uploadImage(files) {
        try {
            if (!files || files.length === 0) {
                return { success: false, message: '没有上传的文件' };
            }
            const file = files[0];
            // 验证文件类型
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.mimeType)) {
                return {
                    success: false,
                    message: '不支持的文件类型，仅支持 JPG、PNG、GIF、WebP 格式'
                };
            }
            // 验证文件大小 (5MB)
            const maxSize = 5 * 1024 * 1024;
            const fileStats = require('fs').statSync(file.data);
            if (fileStats.size > maxSize) {
                return {
                    success: false,
                    message: '文件大小不能超过 5MB'
                };
            }
            // 生成唯一文件名
            const ext = file.filename.split('.').pop();
            const newFilename = `${(0, uuid_1.v4)()}.${ext}`;
            // 按日期分类存储
            const dateFolder = new Date().toISOString().slice(0, 7); // YYYY-MM
            const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'images', dateFolder);
            // 确保目录存在
            await (0, fs_extra_1.ensureDir)(uploadDir);
            // 移动文件到目标位置
            const targetPath = (0, path_1.join)(uploadDir, newFilename);
            await (0, fs_extra_1.move)(file.data, targetPath);
            // 返回访问URL - 使用完整的服务器地址
            const imageUrl = `http://127.0.0.1:7001/uploads/images/${dateFolder}/${newFilename}`;
            return {
                success: true,
                data: {
                    imageUrl,
                    filename: newFilename,
                    originalName: file.filename,
                    size: fileStats.size,
                    mimeType: file.mimeType
                }
            };
        }
        catch (error) {
            console.error('图片上传失败:', error);
            return {
                success: false,
                message: '图片上传失败，请重试'
            };
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", Object)
], UploadController.prototype, "ctx", void 0);
__decorate([
    (0, core_1.Post)('/image'),
    __param(0, (0, core_1.Files)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
UploadController = __decorate([
    (0, core_1.Controller)('/api/upload')
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlci91cGxvYWQuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBaUU7QUFFakUsK0JBQTRCO0FBQzVCLHVDQUEyQztBQUMzQywrQkFBb0M7QUFHN0IsSUFBTSxnQkFBZ0IsR0FBdEIsTUFBTSxnQkFBZ0I7SUFLckIsQUFBTixLQUFLLENBQUMsV0FBVyxDQUFVLEtBQVk7UUFDckMsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUMvQztZQUVELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0QixTQUFTO1lBQ1QsTUFBTSxZQUFZLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN6QyxPQUFPO29CQUNMLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxrQ0FBa0M7aUJBQzVDLENBQUM7YUFDSDtZQUVELGVBQWU7WUFDZixNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFO2dCQUM1QixPQUFPO29CQUNMLE9BQU8sRUFBRSxLQUFLO29CQUNkLE9BQU8sRUFBRSxjQUFjO2lCQUN4QixDQUFDO2FBQ0g7WUFFRCxVQUFVO1lBQ1YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0MsTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFBLFNBQU0sR0FBRSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBRXpDLFVBQVU7WUFDVixNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO1lBQ25FLE1BQU0sU0FBUyxHQUFHLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRXZFLFNBQVM7WUFDVCxNQUFNLElBQUEsb0JBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQztZQUUzQixZQUFZO1lBQ1osTUFBTSxVQUFVLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sSUFBQSxlQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVsQyx1QkFBdUI7WUFDdkIsTUFBTSxRQUFRLEdBQUcsd0NBQXdDLFVBQVUsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUVyRixPQUFPO2dCQUNMLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRTtvQkFDSixRQUFRO29CQUNSLFFBQVEsRUFBRSxXQUFXO29CQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQzNCLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUN4QjthQUNGLENBQUM7U0FFSDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEMsT0FBTztnQkFDTCxPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsWUFBWTthQUN0QixDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQXBFQztJQUFDLElBQUEsYUFBTSxHQUFFOzs2Q0FDSTtBQUdQO0lBREwsSUFBQSxXQUFJLEVBQUMsUUFBUSxDQUFDO0lBQ0ksV0FBQSxJQUFBLFlBQUssR0FBRSxDQUFBOzs7O21EQStEekI7QUFwRVUsZ0JBQWdCO0lBRDVCLElBQUEsaUJBQVUsRUFBQyxhQUFhLENBQUM7R0FDYixnQkFBZ0IsQ0FxRTVCO0FBckVZLDRDQUFnQiJ9