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
exports.UserBlindBox = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const blindbox_entity_1 = require("./blindbox.entity");
let UserBlindBox = class UserBlindBox {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserBlindBox.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserBlindBox.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserBlindBox.prototype, "blindBoxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], UserBlindBox.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserBlindBox.prototype, "obtainedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.userBlindBoxes),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserBlindBox.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blindbox_entity_1.BlindBox, blindBox => blindBox.userBlindBoxes),
    (0, typeorm_1.JoinColumn)({ name: 'blindBoxId' }),
    __metadata("design:type", blindbox_entity_1.BlindBox)
], UserBlindBox.prototype, "blindBox", void 0);
UserBlindBox = __decorate([
    (0, typeorm_1.Entity)('user_blindboxes')
], UserBlindBox);
exports.UserBlindBox = UserBlindBox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1ibGluZGJveC5lbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L3VzZXItYmxpbmRib3guZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQU9pQjtBQUNqQiwrQ0FBcUM7QUFDckMsdURBQTZDO0FBR3RDLElBQU0sWUFBWSxHQUFsQixNQUFNLFlBQVk7Q0EyQnhCLENBQUE7QUExQkM7SUFBQyxJQUFBLGdDQUFzQixHQUFFOzt3Q0FDZDtBQUVYO0lBQUMsSUFBQSxnQkFBTSxHQUFFOzs0Q0FDTTtBQUVmO0lBQUMsSUFBQSxnQkFBTSxHQUFFOztnREFDVTtBQUVuQjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7MENBS3ZCO0FBRUY7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNQLElBQUk7Z0RBQUM7QUFFakI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsa0JBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDbEQsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDOzhCQUN6QixrQkFBSTswQ0FBQztBQUVYO0lBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO0lBQzlELElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs4QkFDekIsMEJBQVE7OENBQUM7QUExQlIsWUFBWTtJQUR4QixJQUFBLGdCQUFNLEVBQUMsaUJBQWlCLENBQUM7R0FDYixZQUFZLENBMkJ4QjtBQTNCWSxvQ0FBWSJ9