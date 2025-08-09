import { PlayerShow } from '../entity/playerShow.entity';
import { Repository } from 'typeorm';
import { CreatePlayerShowDto, UpdatePlayerShowDto } from '../dto/playerShow.dto';
export declare class PlayerShowService {
    playerShowModel: Repository<PlayerShow>;
    create(data: CreatePlayerShowDto): Promise<PlayerShow>;
    findAll(): Promise<PlayerShow[]>;
    findById(id: number): Promise<PlayerShow>;
    update(id: number, data: UpdatePlayerShowDto): Promise<PlayerShow>;
    remove(id: number): Promise<void>;
}
