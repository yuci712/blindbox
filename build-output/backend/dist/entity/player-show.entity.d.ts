import { User } from './user.entity';
import { Comment } from './comment.entity';
export declare class PlayerShow {
    id: number;
    content: string;
    imageUrl: string;
    createdAt: Date;
    userId: number;
    user: User;
    likes: number;
    comments: Comment[];
}
