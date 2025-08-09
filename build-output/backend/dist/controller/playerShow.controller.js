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
exports.PlayerShowController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const playerShow_service_1 = require("../service/playerShow.service");
const playerShow_dto_1 = require("../dto/playerShow.dto");
let PlayerShowController = class PlayerShowController {
    async create(body) {
        return await this.playerShowService.create(body);
    }
    async findAll() {
        return await this.playerShowService.findAll();
    }
    async findById(id) {
        return await this.playerShowService.findById(id);
    }
    async update(id, body) {
        return await this.playerShowService.update(id, body);
    }
    async remove(id) {
        await this.playerShowService.remove(id);
        return { success: true };
    }
};
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", playerShow_service_1.PlayerShowService)
], PlayerShowController.prototype, "playerShowService", void 0);
__decorate([
    (0, decorator_1.Post)('/'),
    __param(0, (0, decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playerShow_dto_1.CreatePlayerShowDto]),
    __metadata("design:returntype", Promise)
], PlayerShowController.prototype, "create", null);
__decorate([
    (0, decorator_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlayerShowController.prototype, "findAll", null);
__decorate([
    (0, decorator_1.Get)('/:id'),
    __param(0, (0, decorator_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerShowController.prototype, "findById", null);
__decorate([
    (0, decorator_1.Put)('/:id'),
    __param(0, (0, decorator_1.Param)('id')),
    __param(1, (0, decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, playerShow_dto_1.UpdatePlayerShowDto]),
    __metadata("design:returntype", Promise)
], PlayerShowController.prototype, "update", null);
__decorate([
    (0, decorator_1.Del)('/:id'),
    __param(0, (0, decorator_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerShowController.prototype, "remove", null);
PlayerShowController = __decorate([
    (0, decorator_1.Controller)('/api/playerShow')
], PlayerShowController);
exports.PlayerShowController = PlayerShowController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyU2hvdy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvcGxheWVyU2hvdy5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEyRjtBQUMzRixzRUFBa0U7QUFDbEUsMERBQWlGO0FBRzFFLElBQU0sb0JBQW9CLEdBQTFCLE1BQU0sb0JBQW9CO0lBS3pCLEFBQU4sS0FBSyxDQUFDLE1BQU0sQ0FBUyxJQUF5QjtRQUM1QyxPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBR0ssQUFBTixLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUdLLEFBQU4sS0FBSyxDQUFDLFFBQVEsQ0FBYyxFQUFVO1FBQ3BDLE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFHSyxBQUFOLEtBQUssQ0FBQyxNQUFNLENBQWMsRUFBVSxFQUFVLElBQXlCO1FBQ3JFLE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBR0ssQUFBTixLQUFLLENBQUMsTUFBTSxDQUFjLEVBQVU7UUFDbEMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztDQUNGLENBQUE7QUE1QkM7SUFBQyxJQUFBLGtCQUFNLEdBQUU7OEJBQ1Usc0NBQWlCOytEQUFDO0FBRy9CO0lBREwsSUFBQSxnQkFBSSxFQUFDLEdBQUcsQ0FBQztJQUNJLFdBQUEsSUFBQSxnQkFBSSxHQUFFLENBQUE7O3FDQUFPLG9DQUFtQjs7a0RBRTdDO0FBR0s7SUFETCxJQUFBLGVBQUcsRUFBQyxHQUFHLENBQUM7Ozs7bURBR1I7QUFHSztJQURMLElBQUEsZUFBRyxFQUFDLE1BQU0sQ0FBQztJQUNJLFdBQUEsSUFBQSxpQkFBSyxFQUFDLElBQUksQ0FBQyxDQUFBOzs7O29EQUUxQjtBQUdLO0lBREwsSUFBQSxlQUFHLEVBQUMsTUFBTSxDQUFDO0lBQ0UsV0FBQSxJQUFBLGlCQUFLLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFBYyxXQUFBLElBQUEsZ0JBQUksR0FBRSxDQUFBOzs2Q0FBTyxvQ0FBbUI7O2tEQUV0RTtBQUdLO0lBREwsSUFBQSxlQUFHLEVBQUMsTUFBTSxDQUFDO0lBQ0UsV0FBQSxJQUFBLGlCQUFLLEVBQUMsSUFBSSxDQUFDLENBQUE7Ozs7a0RBR3hCO0FBNUJVLG9CQUFvQjtJQURoQyxJQUFBLHNCQUFVLEVBQUMsaUJBQWlCLENBQUM7R0FDakIsb0JBQW9CLENBNkJoQztBQTdCWSxvREFBb0IifQ==