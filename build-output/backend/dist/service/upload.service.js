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
exports.UploadService = void 0;
const core_1 = require("@midwayjs/core");
const core_2 = require("@midwayjs/core");
const fs = require("fs-extra");
const path_1 = require("path");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    async upload(files) {
        const urls = [];
        for (const file of files) {
            const filename = (0, uuid_1.v4)() + (0, path_1.join)(file.filename);
            const targetPath = (0, path_1.join)(__dirname, '../../uploads/images', filename);
            await fs.move(file.data, targetPath);
            urls.push(`/public/${filename}`);
        }
        return urls;
    }
};
__decorate([
    (0, core_2.Inject)(),
    __metadata("design:type", Object)
], UploadService.prototype, "ctx", void 0);
UploadService = __decorate([
    (0, core_1.Provide)()
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZS91cGxvYWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMseUNBQXdDO0FBRXhDLCtCQUErQjtBQUMvQiwrQkFBNEI7QUFDNUIsK0JBQW9DO0FBRzdCLElBQU0sYUFBYSxHQUFuQixNQUFNLGFBQWE7SUFJeEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFZO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFBLFNBQU0sR0FBRSxHQUFHLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFBO0FBYkM7SUFBQyxJQUFBLGFBQU0sR0FBRTs7MENBQ0k7QUFGRixhQUFhO0lBRHpCLElBQUEsY0FBTyxHQUFFO0dBQ0csYUFBYSxDQWN6QjtBQWRZLHNDQUFhIn0=