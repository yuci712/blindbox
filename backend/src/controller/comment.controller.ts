import { Inject, Controller, Post, Get, Del, Param, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommentService } from '../service/comment.service';
import { CreateCommentDTO } from '../dto/comment.dto';
import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/api/comments')
export class CommentController {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  @Post('/', { middleware: [JwtMiddleware] })
  async createComment(@Body() body: CreateCommentDTO) {
    const userId = this.ctx.state.user.id;
    const { playerShowId, content } = body;
    const comment = await this.commentService.createComment(userId, playerShowId, content);
    return { success: true, data: comment };
  }

  @Get('/show/:showId')
  async getCommentsByShowId(@Param('showId') showId: number) {
    const comments = await this.commentService.getCommentsByShowId(showId);
    return { success: true, data: comments };
  }

  @Del('/:id', { middleware: [JwtMiddleware] })
  async deleteComment(@Param('id') id: number) {
    const userId = this.ctx.state.user.id;
    const success = await this.commentService.deleteComment(id, userId);
    return { success };
  }
}
