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
exports.CommentService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const comment_entity_1 = require("../entity/comment.entity");
const typeorm_2 = require("typeorm");
let CommentService = class CommentService {
    async createComment(userId, playerShowId, content) {
        const comment = new comment_entity_1.Comment();
        comment.userId = userId;
        comment.playerShowId = playerShowId;
        comment.content = content;
        const savedComment = await this.commentModel.save(comment);
        // 返回包含用户信息的完整评论数据
        return await this.commentModel.findOne({
            where: { id: savedComment.id },
            relations: ['user']
        });
    }
    async getCommentsByShowId(playerShowId) {
        return await this.commentModel.find({
            where: { playerShowId },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async deleteComment(id, userId) {
        const result = await this.commentModel.delete({ id, userId });
        return result.affected > 0;
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(comment_entity_1.Comment),
    __metadata("design:type", typeorm_2.Repository)
], CommentService.prototype, "commentModel", void 0);
CommentService = __decorate([
    (0, core_1.Provide)()
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UvY29tbWVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5QztBQUN6QywrQ0FBc0Q7QUFDdEQsNkRBQW1EO0FBQ25ELHFDQUFxQztBQUc5QixJQUFNLGNBQWMsR0FBcEIsTUFBTSxjQUFjO0lBSXpCLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBYyxFQUFFLFlBQW9CLEVBQUUsT0FBZTtRQUN2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFPLEVBQUUsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN4QixPQUFPLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNwQyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMxQixNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNELGtCQUFrQjtRQUNsQixPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7WUFDckMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUU7WUFDOUIsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQ3BCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsWUFBb0I7UUFDNUMsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ2xDLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBRTtZQUN2QixTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDbkIsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBVSxFQUFFLE1BQWM7UUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNGLENBQUE7QUEvQkM7SUFBQyxJQUFBLDJCQUFpQixFQUFDLHdCQUFPLENBQUM7OEJBQ2Isb0JBQVU7b0RBQVU7QUFGdkIsY0FBYztJQUQxQixJQUFBLGNBQU8sR0FBRTtHQUNHLGNBQWMsQ0FnQzFCO0FBaENZLHdDQUFjIn0=