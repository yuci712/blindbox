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
exports.UpdatePlayerShowDto = exports.CreatePlayerShowDto = void 0;
const swagger_1 = require("@midwayjs/swagger");
class CreatePlayerShowDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户ID' }),
    __metadata("design:type", Number)
], CreatePlayerShowDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '标题' }),
    __metadata("design:type", String)
], CreatePlayerShowDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '描述' }),
    __metadata("design:type", String)
], CreatePlayerShowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '图片URL' }),
    __metadata("design:type", String)
], CreatePlayerShowDto.prototype, "imageUrl", void 0);
exports.CreatePlayerShowDto = CreatePlayerShowDto;
class UpdatePlayerShowDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '标题', required: false }),
    __metadata("design:type", String)
], UpdatePlayerShowDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '描述', required: false }),
    __metadata("design:type", String)
], UpdatePlayerShowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '图片URL', required: false }),
    __metadata("design:type", String)
], UpdatePlayerShowDto.prototype, "imageUrl", void 0);
exports.UpdatePlayerShowDto = UpdatePlayerShowDto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyU2hvdy5kdG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHRvL3BsYXllclNob3cuZHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFnRDtBQUVoRCxNQUFhLG1CQUFtQjtDQVkvQjtBQVhDO0lBQUMsSUFBQSxxQkFBVyxFQUFDLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDOzttREFDdEI7QUFFZjtJQUFDLElBQUEscUJBQVcsRUFBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7a0RBQ3JCO0FBRWQ7SUFBQyxJQUFBLHFCQUFXLEVBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7O3dEQUNmO0FBRXBCO0lBQUMsSUFBQSxxQkFBVyxFQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDOztxREFDckI7QUFYbkIsa0RBWUM7QUFFRCxNQUFhLG1CQUFtQjtDQVMvQjtBQVJDO0lBQUMsSUFBQSxxQkFBVyxFQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O2tEQUNyQztBQUVmO0lBQUMsSUFBQSxxQkFBVyxFQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O3dEQUMvQjtBQUVyQjtJQUFDLElBQUEscUJBQVcsRUFBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOztxREFDckM7QUFScEIsa0RBU0MifQ==