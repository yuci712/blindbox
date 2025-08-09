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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const blindbox_entity_1 = require("./blindbox.entity");
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "blindBoxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.orders),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blindbox_entity_1.BlindBox, blindBox => blindBox.orders),
    (0, typeorm_1.JoinColumn)({ name: 'blindBoxId' }),
    __metadata("design:type", blindbox_entity_1.BlindBox)
], Order.prototype, "blindBox", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
exports.Order = Order;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudGl0eS9vcmRlci5lbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBUWlCO0FBQ2pCLCtDQUFxQztBQUNyQyx1REFBNkM7QUFHdEMsSUFBTSxLQUFLLEdBQVgsTUFBTSxLQUFLO0NBNkJqQixDQUFBO0FBNUJDO0lBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7aUNBQ2Q7QUFFWDtJQUFDLElBQUEsZ0JBQU0sR0FBRTs7cUNBQ007QUFFZjtJQUFDLElBQUEsZ0JBQU0sR0FBRTs7eUNBQ1U7QUFFbkI7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDOztxQ0FDdEM7QUFFZjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQzs7cUNBQ2hCO0FBRWY7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNSLElBQUk7d0NBQUM7QUFFaEI7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNSLElBQUk7d0NBQUM7QUFFaEI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsa0JBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDMUMsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDOzhCQUN6QixrQkFBSTttQ0FBQztBQUVYO0lBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3RELElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs4QkFDekIsMEJBQVE7dUNBQUM7QUE1QlIsS0FBSztJQURqQixJQUFBLGdCQUFNLEVBQUMsUUFBUSxDQUFDO0dBQ0osS0FBSyxDQTZCakI7QUE3Qlksc0JBQUsifQ==