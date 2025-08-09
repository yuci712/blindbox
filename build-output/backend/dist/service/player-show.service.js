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
exports.PlayerShowService = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const player_show_entity_1 = require("../entity/player-show.entity");
const user_entity_1 = require("../entity/user.entity");
let PlayerShowService = class PlayerShowService {
    async createPlayerShow(userId, createPlayerShowDTO, imageUrl) {
        const user = await this.userModel.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const playerShow = new player_show_entity_1.PlayerShow();
        playerShow.content = createPlayerShowDTO.content;
        playerShow.imageUrl = imageUrl;
        playerShow.user = user;
        return await this.playerShowModel.save(playerShow);
    }
    async getPlayerShows() {
        const playerShows = await this.playerShowModel.find({
            relations: ['user', 'comments'],
            order: { createdAt: 'DESC' }
        });
        // 添加评论数量字段并移除评论详情（只保留数量）
        return playerShows.map(show => ({
            ...show,
            commentCount: show.comments ? show.comments.length : 0,
            comments: undefined // 移除评论详情，只保留数量
        }));
    }
    async likePlayerShow(id) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('Player show not found');
        }
        playerShow.likes += 1;
        return await this.playerShowModel.save(playerShow);
    }
    // 管理员功能：删除玩家秀
    async deletePlayerShow(id) {
        const playerShow = await this.playerShowModel.findOne({ where: { id } });
        if (!playerShow) {
            throw new Error('玩家秀不存在');
        }
        await this.playerShowModel.delete(id);
        return { message: '玩家秀删除成功' };
    }
    // 管理员功能：获取所有玩家秀（包含更多管理信息）
    async getPlayerShowsForAdmin() {
        return this.playerShowModel.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                content: true,
                imageUrl: true,
                likes: true,
                createdAt: true,
                user: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        });
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(player_show_entity_1.PlayerShow),
    __metadata("design:type", typeorm_2.Repository)
], PlayerShowService.prototype, "playerShowModel", void 0);
__decorate([
    (0, typeorm_1.InjectEntityModel)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], PlayerShowService.prototype, "userModel", void 0);
PlayerShowService = __decorate([
    (0, core_1.Provide)()
], PlayerShowService);
exports.PlayerShowService = PlayerShowService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLXNob3cuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlL3BsYXllci1zaG93LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXlDO0FBQ3pDLCtDQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMscUVBQTBEO0FBRTFELHVEQUE2QztBQUd0QyxJQUFNLGlCQUFpQixHQUF2QixNQUFNLGlCQUFpQjtJQU81QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLG1CQUF3QyxFQUFFLFFBQXVCO1FBQ3RHLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbkM7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLCtCQUFVLEVBQUUsQ0FBQztRQUNwQyxVQUFVLENBQUMsT0FBTyxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztRQUNqRCxVQUFVLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUMvQixVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUV2QixPQUFPLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDaEQsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztZQUMvQixLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO1NBQy9CLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLEdBQUcsSUFBSTtZQUNQLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxRQUFRLEVBQUUsU0FBUyxDQUFDLGVBQWU7U0FDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFVO1FBQzdCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUNELFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsY0FBYztJQUNkLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFVO1FBQy9CLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0I7UUFFRCxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELDBCQUEwQjtJQUMxQixLQUFLLENBQUMsc0JBQXNCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDL0IsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ25CLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7WUFDNUIsTUFBTSxFQUFFO2dCQUNOLEVBQUUsRUFBRSxJQUFJO2dCQUNSLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEtBQUssRUFBRSxJQUFJO2dCQUNYLFNBQVMsRUFBRSxJQUFJO2dCQUNmLElBQUksRUFBRTtvQkFDSixFQUFFLEVBQUUsSUFBSTtvQkFDUixRQUFRLEVBQUUsSUFBSTtvQkFDZCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUE7QUF6RUM7SUFBQyxJQUFBLDJCQUFpQixFQUFDLCtCQUFVLENBQUM7OEJBQ2Isb0JBQVU7MERBQWE7QUFFeEM7SUFBQyxJQUFBLDJCQUFpQixFQUFDLGtCQUFJLENBQUM7OEJBQ2Isb0JBQVU7b0RBQU87QUFMakIsaUJBQWlCO0lBRDdCLElBQUEsY0FBTyxHQUFFO0dBQ0csaUJBQWlCLENBMEU3QjtBQTFFWSw4Q0FBaUIifQ==