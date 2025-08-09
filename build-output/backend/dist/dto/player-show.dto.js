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
exports.LikePlayerShowDTO = exports.CreatePlayerShowDTO = void 0;
const validate_1 = require("@midwayjs/validate");
class CreatePlayerShowDTO {
}
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    __metadata("design:type", String)
], CreatePlayerShowDTO.prototype, "content", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().optional()),
    __metadata("design:type", String)
], CreatePlayerShowDTO.prototype, "imageUrl", void 0);
exports.CreatePlayerShowDTO = CreatePlayerShowDTO;
class LikePlayerShowDTO {
}
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().required()),
    __metadata("design:type", Number)
], LikePlayerShowDTO.prototype, "id", void 0);
exports.LikePlayerShowDTO = LikePlayerShowDTO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLXNob3cuZHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R0by9wbGF5ZXItc2hvdy5kdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW9EO0FBRXBELE1BQWEsbUJBQW1CO0NBTS9CO0FBTEM7SUFBQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDOztvREFDbkI7QUFFaEI7SUFBQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDOztxREFDakI7QUFMcEIsa0RBTUM7QUFFRCxNQUFhLGlCQUFpQjtDQUc3QjtBQUZHO0lBQUMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7NkNBQ3hCO0FBRmYsOENBR0MifQ==