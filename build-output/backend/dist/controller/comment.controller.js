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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const core_1 = require("@midwayjs/core");
const comment_service_1 = require("../service/comment.service");
const comment_dto_1 = require("../dto/comment.dto");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
let CommentController = class CommentController {
    async createComment(body) {
        const userId = this.ctx.state.user.id;
        const { playerShowId, content } = body;
        const comment = await this.commentService.createComment(userId, playerShowId, content);
        return { success: true, data: comment };
    }
    async getCommentsByShowId(showId) {
        const comments = await this.commentService.getCommentsByShowId(showId);
        return { success: true, data: comments };
    }
    async deleteComment(id) {
        const userId = this.ctx.state.user.id;
        const success = await this.commentService.deleteComment(id, userId);
        return { success };
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", Object)
], CommentController.prototype, "ctx", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", comment_service_1.CommentService)
], CommentController.prototype, "commentService", void 0);
__decorate([
    (0, core_1.Post)('/', { middleware: [jwt_middleware_1.JwtMiddleware] }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CreateCommentDTO]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    (0, core_1.Get)('/show/:showId'),
    __param(0, (0, core_1.Param)('showId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentsByShowId", null);
__decorate([
    (0, core_1.Del)('/:id', { middleware: [jwt_middleware_1.JwtMiddleware] }),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    (0, core_1.Controller)('/api/comments')
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29tbWVudC5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRjtBQUVqRixnRUFBNEQ7QUFDNUQsb0RBQXNEO0FBQ3RELGlFQUE2RDtBQUd0RCxJQUFNLGlCQUFpQixHQUF2QixNQUFNLGlCQUFpQjtJQVF0QixBQUFOLEtBQUssQ0FBQyxhQUFhLENBQVMsSUFBc0I7UUFDaEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QyxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkYsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFHSyxBQUFOLEtBQUssQ0FBQyxtQkFBbUIsQ0FBa0IsTUFBYztRQUN2RCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFHSyxBQUFOLEtBQUssQ0FBQyxhQUFhLENBQWMsRUFBVTtRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQ0YsQ0FBQTtBQTFCQztJQUFDLElBQUEsYUFBTSxHQUFFOzs4Q0FDSTtBQUViO0lBQUMsSUFBQSxhQUFNLEdBQUU7OEJBQ08sZ0NBQWM7eURBQUM7QUFHekI7SUFETCxJQUFBLFdBQUksRUFBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQztJQUN0QixXQUFBLElBQUEsV0FBSSxHQUFFLENBQUE7O3FDQUFPLDhCQUFnQjs7c0RBS2pEO0FBR0s7SUFETCxJQUFBLFVBQUcsRUFBQyxlQUFlLENBQUM7SUFDTSxXQUFBLElBQUEsWUFBSyxFQUFDLFFBQVEsQ0FBQyxDQUFBOzs7OzREQUd6QztBQUdLO0lBREwsSUFBQSxVQUFHLEVBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsOEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFDeEIsV0FBQSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsQ0FBQTs7OztzREFJL0I7QUExQlUsaUJBQWlCO0lBRDdCLElBQUEsaUJBQVUsRUFBQyxlQUFlLENBQUM7R0FDZixpQkFBaUIsQ0EyQjdCO0FBM0JZLDhDQUFpQiJ9