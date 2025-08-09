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
exports.CreateCommentDTO = void 0;
const validate_1 = require("@midwayjs/validate");
class CreateCommentDTO {
}
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().required()),
    __metadata("design:type", Number)
], CreateCommentDTO.prototype, "playerShowId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    __metadata("design:type", String)
], CreateCommentDTO.prototype, "content", void 0);
exports.CreateCommentDTO = CreateCommentDTO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC5kdG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHRvL2NvbW1lbnQuZHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUVwRCxNQUFhLGdCQUFnQjtDQU01QjtBQUxDO0lBQUMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7c0RBQ2Q7QUFFckI7SUFBQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDOztpREFDbkI7QUFMbEIsNENBTUMifQ==