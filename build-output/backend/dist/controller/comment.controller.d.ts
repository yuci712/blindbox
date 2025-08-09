import { Context } from '@midwayjs/koa';
import { CommentService } from '../service/comment.service';
import { CreateCommentDTO } from '../dto/comment.dto';
export declare class CommentController {
    ctx: Context;
    commentService: CommentService;
    createComment(body: CreateCommentDTO): Promise<{
        success: boolean;
        data: import("../entity/comment.entity").Comment;
    }>;
    getCommentsByShowId(showId: number): Promise<{
        success: boolean;
        data: import("../entity/comment.entity").Comment[];
    }>;
    deleteComment(id: number): Promise<{
        success: boolean;
    }>;
}
