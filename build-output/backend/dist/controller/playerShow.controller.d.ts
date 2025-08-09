import { PlayerShowService } from '../service/playerShow.service';
import { CreatePlayerShowDto, UpdatePlayerShowDto } from '../dto/playerShow.dto';
export declare class PlayerShowController {
    playerShowService: PlayerShowService;
    create(body: CreatePlayerShowDto): Promise<import("../entity/playerShow.entity").PlayerShow>;
    findAll(): Promise<import("../entity/playerShow.entity").PlayerShow[]>;
    findById(id: number): Promise<import("../entity/playerShow.entity").PlayerShow>;
    update(id: number, body: UpdatePlayerShowDto): Promise<import("../entity/playerShow.entity").PlayerShow>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
