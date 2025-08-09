import { User } from './user.entity';
import { PlayerShow } from './player-show.entity';
export declare class Comment {
    id: number;
    userId: number;
    playerShowId: number;
    content: string;
    createdAt: Date;
    user: User;
    playerShow: PlayerShow;
}
