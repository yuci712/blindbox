import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerShow } from '../entity/player-show.entity';
import { CreatePlayerShowDTO } from '../dto/player-show.dto';
import { User } from '../entity/user.entity';

@Provide()
export class PlayerShowService {
  @InjectEntityModel(PlayerShow)
  playerShowModel: Repository<PlayerShow>;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async createPlayerShow(userId: number, createPlayerShowDTO: CreatePlayerShowDTO, imageUrl: string | null) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const playerShow = new PlayerShow();
    playerShow.content = createPlayerShowDTO.content;
    playerShow.imageUrl = imageUrl;
    playerShow.user = user;

    return await this.playerShowModel.save(playerShow);
  }

  async getPlayerShows() {
    const playerShows = await this.playerShowModel.find({
        relations: ['user', 'comments'],
        order: { createdAt: 'DESC' }
    });

    // 添加评论数量字段并移除评论详情（只保留数量）
    return playerShows.map(show => ({
      ...show,
      commentCount: show.comments ? show.comments.length : 0,
      comments: undefined // 移除评论详情，只保留数量
    }));
  }

  async likePlayerShow(id: number) {
    const playerShow = await this.playerShowModel.findOne({ where: { id } });
    if (!playerShow) {
      throw new Error('Player show not found');
    }
    playerShow.likes += 1;
    return await this.playerShowModel.save(playerShow);
  }

  // 管理员功能：删除玩家秀
  async deletePlayerShow(id: number) {
    const playerShow = await this.playerShowModel.findOne({ where: { id } });
    if (!playerShow) {
      throw new Error('玩家秀不存在');
    }

    await this.playerShowModel.delete(id);
    return { message: '玩家秀删除成功' };
  }

  // 管理员功能：获取所有玩家秀（包含更多管理信息）
  async getPlayerShowsForAdmin() {
    return this.playerShowModel.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        likes: true,
        createdAt: true,
        user: {
          id: true,
          username: true,
          email: true
        }
      }
    });
  }
}
