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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const user_blindbox_entity_1 = require("./user-blindbox.entity");
const comment_entity_1 = require("./comment.entity");
const player_show_entity_1 = require("./player-show.entity");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'customer' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_blindbox_entity_1.UserBlindBox, userBlindBox => userBlindBox.user),
    __metadata("design:type", Array)
], User.prototype, "userBlindBoxes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, comment => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_show_entity_1.PlayerShow, playerShow => playerShow.user),
    __metadata("design:type", Array)
], User.prototype, "playerShows", void 0);
User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
exports.User = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5lbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L3VzZXIuZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQU9pQjtBQUNqQixpREFBdUM7QUFDdkMsaUVBQXNEO0FBQ3RELHFEQUEyQztBQUMzQyw2REFBa0Q7QUFHM0MsSUFBTSxJQUFJLEdBQVYsTUFBTSxJQUFJO0NBdUNoQixDQUFBO0FBdENDO0lBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7Z0NBQ2Q7QUFFWDtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQzs7c0NBQ1I7QUFFakI7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7O21DQUNYO0FBRWQ7SUFBQyxJQUFBLGdCQUFNLEdBQUU7O3NDQUNRO0FBRWpCO0lBQUMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztvQ0FDWjtBQUVmO0lBQUMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztzQ0FDVjtBQUVqQjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQzs7a0NBQ25CO0FBRWI7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNSLElBQUk7dUNBQUM7QUFFaEI7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNSLElBQUk7dUNBQUM7QUFFaEI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsb0JBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7O29DQUM1QjtBQUVoQjtJQUFDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQ0FBWSxFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQzs7NENBQ2xDO0FBRS9CO0lBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDOztzQ0FDOUI7QUFFcEI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsK0JBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7O3lDQUNqQztBQXRDZixJQUFJO0lBRGhCLElBQUEsZ0JBQU0sRUFBQyxPQUFPLENBQUM7R0FDSCxJQUFJLENBdUNoQjtBQXZDWSxvQkFBSSJ9