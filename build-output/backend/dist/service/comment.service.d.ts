import { Comment } from '../entity/comment.entity';
import { Repository } from 'typeorm';
export declare class CommentService {
    commentModel: Repository<Comment>;
    createComment(userId: number, playerShowId: number, content: string): Promise<Comment>;
    getCommentsByShowId(playerShowId: number): Promise<Comment[]>;
    deleteComment(id: number, userId: number): Promise<boolean>;
}
