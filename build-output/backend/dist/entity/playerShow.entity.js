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
exports.PlayerShow = void 0;
const typeorm_1 = require("typeorm");
let PlayerShow = class PlayerShow {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlayerShow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlayerShow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], PlayerShow.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PlayerShow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], PlayerShow.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlayerShow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PlayerShow.prototype, "updatedAt", void 0);
PlayerShow = __decorate([
    (0, typeorm_1.Entity)('player_show')
], PlayerShow);
exports.PlayerShow = PlayerShow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyU2hvdy5lbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L3BsYXllclNob3cuZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFxRztBQUc5RixJQUFNLFVBQVUsR0FBaEIsTUFBTSxVQUFVO0NBcUJ0QixDQUFBO0FBcEJDO0lBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7c0NBQ2Q7QUFFWDtJQUFDLElBQUEsZ0JBQU0sR0FBRTs7MENBQ007QUFFZjtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQzs7eUNBQ1Y7QUFFZDtJQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7K0NBQ0w7QUFFcEI7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7OzRDQUNQO0FBRWpCO0lBQUMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUixJQUFJOzZDQUFDO0FBRWhCO0lBQUMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUixJQUFJOzZDQUFDO0FBcEJMLFVBQVU7SUFEdEIsSUFBQSxnQkFBTSxFQUFDLGFBQWEsQ0FBQztHQUNULFVBQVUsQ0FxQnRCO0FBckJZLGdDQUFVIn0=