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
exports.BlindBox = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const user_blindbox_entity_1 = require("./user-blindbox.entity");
let BlindBox = class BlindBox {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlindBox.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlindBox.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlindBox.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlindBox.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BlindBox.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlindBox.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], BlindBox.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlindBox.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], BlindBox.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BlindBox.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], BlindBox.prototype, "totalSold", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlindBox.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BlindBox.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.blindBox),
    __metadata("design:type", Array)
], BlindBox.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_blindbox_entity_1.UserBlindBox, userBlindBox => userBlindBox.blindBox),
    __metadata("design:type", Array)
], BlindBox.prototype, "userBlindBoxes", void 0);
BlindBox = __decorate([
    (0, typeorm_1.Entity)('blindboxes')
], BlindBox);
exports.BlindBox = BlindBox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxpbmRib3guZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudGl0eS9ibGluZGJveC5lbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBT2lCO0FBQ2pCLGlEQUF1QztBQUN2QyxpRUFBc0Q7QUFHL0MsSUFBTSxRQUFRLEdBQWQsTUFBTSxRQUFRO0NBa0RwQixDQUFBO0FBakRDO0lBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7b0NBQ2Q7QUFFWDtJQUFDLElBQUEsZ0JBQU0sR0FBRTs7c0NBQ0k7QUFFYjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7d0NBQ1o7QUFFZjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7NkNBQ0w7QUFFcEI7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDOzt1Q0FDdkM7QUFFZDtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7dUNBQ2I7QUFFZDtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs4QkFDbEIsS0FBSzt1Q0FLVDtBQUVIO0lBQUMsSUFBQSxnQkFBTSxHQUFFOzswQ0FDUTtBQUVqQjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztzQ0FDbEM7QUFFZjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQzs7MENBQ1I7QUFFbEI7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7OzJDQUNMO0FBRWxCO0lBQUMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUixJQUFJOzJDQUFDO0FBRWhCO0lBQUMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUixJQUFJOzJDQUFDO0FBRWhCO0lBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDOzt3Q0FDaEM7QUFFaEI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUNBQVksRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7O2dEQUN0QztBQWpEcEIsUUFBUTtJQURwQixJQUFBLGdCQUFNLEVBQUMsWUFBWSxDQUFDO0dBQ1IsUUFBUSxDQWtEcEI7QUFsRFksNEJBQVEifQ==