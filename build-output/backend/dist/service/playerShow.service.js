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
const typeorm_1 = require("@midwayjs/typeorm");
const playerShow_entity_1 = require("../entity/playerShow.entity");
const typeorm_2 = require("typeorm");
const decorator_1 = require("@midwayjs/decorator");
let PlayerShowService = class PlayerShowService {
    async create(data) {
        const show = this.playerShowModel.create(data);
        return await this.playerShowModel.save(show);
    }
    async findAll() {
        return await this.playerShowModel.find({ order: { createdAt: 'DESC' } });
    }
    async findById(id) {
        return await this.playerShowModel.findOneBy({ id });
    }
    async update(id, data) {
        await this.playerShowModel.update(id, data);
        return await this.findById(id);
    }
    async remove(id) {
        await this.playerShowModel.delete(id);
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(playerShow_entity_1.PlayerShow),
    __metadata("design:type", typeorm_2.Repository)
], PlayerShowService.prototype, "playerShowModel", void 0);
PlayerShowService = __decorate([
    (0, decorator_1.Provide)()
], PlayerShowService);
exports.PlayerShowService = PlayerShowService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyU2hvdy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UvcGxheWVyU2hvdy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFzRDtBQUN0RCxtRUFBeUQ7QUFDekQscUNBQXFDO0FBR3JDLG1EQUE4QztBQUd2QyxJQUFNLGlCQUFpQixHQUF2QixNQUFNLGlCQUFpQjtJQUk1QixLQUFLLENBQUMsTUFBTSxDQUFDLElBQXlCO1FBQ3BDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLE9BQU8sTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDdkIsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsSUFBeUI7UUFDaEQsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVTtRQUNyQixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRixDQUFBO0FBeEJDO0lBQUMsSUFBQSwyQkFBaUIsRUFBQyw4QkFBVSxDQUFDOzhCQUNiLG9CQUFVOzBEQUFhO0FBRjdCLGlCQUFpQjtJQUQ3QixJQUFBLG1CQUFPLEdBQUU7R0FDRyxpQkFBaUIsQ0F5QjdCO0FBekJZLDhDQUFpQiJ9