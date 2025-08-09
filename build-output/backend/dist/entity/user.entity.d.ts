import { Order } from './order.entity';
import { UserBlindBox } from './user-blindbox.entity';
import { Comment } from './comment.entity';
import { PlayerShow } from './player-show.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    nickname: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    userBlindBoxes: UserBlindBox[];
    comments: Comment[];
    playerShows: PlayerShow[];
}
