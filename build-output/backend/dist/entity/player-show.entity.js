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
const user_entity_1 = require("./user.entity");
const comment_entity_1 = require("./comment.entity");
let PlayerShow = class PlayerShow {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlayerShow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PlayerShow.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlayerShow.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlayerShow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlayerShow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.playerShows),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], PlayerShow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PlayerShow.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, comment => comment.playerShow),
    __metadata("design:type", Array)
], PlayerShow.prototype, "comments", void 0);
PlayerShow = __decorate([
    (0, typeorm_1.Entity)('player_shows')
], PlayerShow);
exports.PlayerShow = PlayerShow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLXNob3cuZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudGl0eS9wbGF5ZXItc2hvdy5lbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXFIO0FBQ3JILCtDQUFxQztBQUNyQyxxREFBMkM7QUFHcEMsSUFBTSxVQUFVLEdBQWhCLE1BQU0sVUFBVTtDQXlCdEIsQ0FBQTtBQXhCQztJQUFDLElBQUEsZ0NBQXNCLEdBQUU7O3NDQUNkO0FBRVg7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7OzJDQUNUO0FBRWhCO0lBQUMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzs0Q0FDVjtBQUVqQjtJQUFDLElBQUEsMEJBQWdCLEdBQUU7OEJBQ1IsSUFBSTs2Q0FBQztBQUVoQjtJQUFDLElBQUEsZ0JBQU0sR0FBRTs7MENBQ007QUFFZjtJQUFDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMvQyxJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7OEJBQ3pCLGtCQUFJO3dDQUFDO0FBRVg7SUFBQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7O3lDQUNUO0FBRWQ7SUFBQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsd0JBQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7OzRDQUNwQztBQXhCVCxVQUFVO0lBRHRCLElBQUEsZ0JBQU0sRUFBQyxjQUFjLENBQUM7R0FDVixVQUFVLENBeUJ0QjtBQXpCWSxnQ0FBVSJ9