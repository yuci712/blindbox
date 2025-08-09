import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Comment } from '../entity/comment.entity';
import { Repository } from 'typeorm';

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentModel: Repository<Comment>;

  async createComment(userId: number, playerShowId: number, content: string) {
    const comment = new Comment();
    comment.userId = userId;
    comment.playerShowId = playerShowId;
    comment.content = content;
    const savedComment = await this.commentModel.save(comment);
    
    // 返回包含用户信息的完整评论数据
    return await this.commentModel.findOne({
      where: { id: savedComment.id },
      relations: ['user']
    });
  }

  async getCommentsByShowId(playerShowId: number) {
    return await this.commentModel.find({
      where: { playerShowId },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteComment(id: number, userId: number) {
    const result = await this.commentModel.delete({ id, userId });
    return result.affected > 0;
  }
}
