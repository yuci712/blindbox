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
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const player_show_entity_1 = require("./player-show.entity");
let Comment = class Comment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Comment.prototype, "playerShowId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.comments),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Comment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_show_entity_1.PlayerShow, playerShow => playerShow.comments),
    (0, typeorm_1.JoinColumn)({ name: 'playerShowId' }),
    __metadata("design:type", player_show_entity_1.PlayerShow)
], Comment.prototype, "playerShow", void 0);
Comment = __decorate([
    (0, typeorm_1.Entity)('comments')
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC5lbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L2NvbW1lbnQuZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQU9pQjtBQUNqQiwrQ0FBcUM7QUFDckMsNkRBQWtEO0FBRzNDLElBQU0sT0FBTyxHQUFiLE1BQU0sT0FBTztDQXVCbkIsQ0FBQTtBQXRCQztJQUFDLElBQUEsZ0NBQXNCLEdBQUU7O21DQUNkO0FBRVg7SUFBQyxJQUFBLGdCQUFNLEdBQUU7O3VDQUNNO0FBRWY7SUFBQyxJQUFBLGdCQUFNLEdBQUU7OzZDQUNZO0FBRXJCO0lBQUMsSUFBQSxnQkFBTSxFQUFDLE1BQU0sQ0FBQzs7d0NBQ0M7QUFFaEI7SUFBQyxJQUFBLDBCQUFnQixHQUFFOzhCQUNSLElBQUk7MENBQUM7QUFFaEI7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsa0JBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDNUMsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDOzhCQUN6QixrQkFBSTtxQ0FBQztBQUVYO0lBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLCtCQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0lBQzlELElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQzs4QkFDekIsK0JBQVU7MkNBQUM7QUF0QlosT0FBTztJQURuQixJQUFBLGdCQUFNLEVBQUMsVUFBVSxDQUFDO0dBQ04sT0FBTyxDQXVCbkI7QUF2QlksMEJBQU8ifQ==