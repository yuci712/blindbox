import { Repository } from 'typeorm';
import { PlayerShow } from '../entity/player-show.entity';
import { CreatePlayerShowDTO } from '../dto/player-show.dto';
import { User } from '../entity/user.entity';
export declare class PlayerShowService {
    playerShowModel: Repository<PlayerShow>;
    userModel: Repository<User>;
    createPlayerShow(userId: number, createPlayerShowDTO: CreatePlayerShowDTO, imageUrl: string | null): Promise<PlayerShow>;
    getPlayerShows(): Promise<{
        commentCount: number;
        comments: any;
        id: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        userId: number;
        user: User;
        likes: number;
    }[]>;
    likePlayerShow(id: number): Promise<PlayerShow>;
    deletePlayerShow(id: number): Promise<{
        message: string;
    }>;
    getPlayerShowsForAdmin(): Promise<PlayerShow[]>;
}
