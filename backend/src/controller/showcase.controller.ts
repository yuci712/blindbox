import { Controller, Get, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserBlindBox } from '../entity/user-blindbox.entity';

@Controller('/api/showcase')
export class ShowcaseController {
  @InjectEntityModel(UserBlindBox)
  userBlindBoxRepository: Repository<UserBlindBox>;

  @Get('/')
  async getShowcaseItems(
    @Query('filter') filter = 'all',
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    try {
      const pageNum = typeof page === 'string' ? parseInt(page) : page;
      const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
      const skip = (pageNum - 1) * limitNum;

      // 从数据库获取真实的用户盲盒数据
      const queryBuilder = this.userBlindBoxRepository
        .createQueryBuilder('ub')
        .leftJoinAndSelect('ub.user', 'user')
        .leftJoinAndSelect('ub.blindBox', 'blindBox')
        .orderBy('ub.obtainedAt', 'DESC')
        .skip(skip)
        .take(limitNum);

      // 根据稀有度过滤
      if (filter !== 'all') {
        if (filter === 'rare') {
          queryBuilder.andWhere("JSON_EXTRACT(ub.item, '$.rarity') = 'SSR'");
        } else if (filter === 'normal') {
          queryBuilder.andWhere("JSON_EXTRACT(ub.item, '$.rarity') IN ('N', 'R', 'SR')");
        }
      }

      const userBlindBoxes = await queryBuilder.getMany();
      const total = await queryBuilder.getCount();

      // 转换为展示格式
      const items = userBlindBoxes.map(ub => ({
        id: ub.id,
        userId: ub.userId,
        user: {
          id: ub.user.id,
          username: ub.user.username,
          email: ub.user.email,
          avatar: ub.user.avatar || null,
          createdAt: ub.user.createdAt,
          updatedAt: ub.user.updatedAt,
        },
        blindBoxName: ub.blindBox.name,
        itemName: ub.item.name,
        itemImage: ub.item.image || null,
        rarity: ub.item.rarity,
        description: `获得了${ub.item.rarity}级稀有度的${ub.item.name}！`,
        likes: 0, // 需要实现点赞功能时可以添加
        comments: 0, // 需要实现评论功能时可以添加
        isLiked: false,
        createdAt: ub.obtainedAt,
      }));

      return {
        success: true,
        data: {
          items,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
          }
        }
      };
    } catch (error) {
      console.error('Get showcase items error:', error);
      return { success: false, message: '获取展示数据失败' };
    }
  }

  @Get('/:id')
  async getShowcaseItem(@Query('id') id: number) {
    try {
      const userBlindBox = await this.userBlindBoxRepository
        .createQueryBuilder('ub')
        .leftJoinAndSelect('ub.user', 'user')
        .leftJoinAndSelect('ub.blindBox', 'blindBox')
        .where('ub.id = :id', { id })
        .getOne();

      if (!userBlindBox) {
        return { success: false, message: '展示项目不存在' };
      }

      const showcaseItem = {
        id: userBlindBox.id,
        userId: userBlindBox.userId,
        user: {
          id: userBlindBox.user.id,
          username: userBlindBox.user.username,
          email: userBlindBox.user.email,
          avatar: userBlindBox.user.avatar || null,
          createdAt: userBlindBox.user.createdAt,
          updatedAt: userBlindBox.user.updatedAt,
        },
        blindBoxName: userBlindBox.blindBox.name,
        itemName: userBlindBox.item.name,
        itemImage: userBlindBox.item.image || null,
        rarity: userBlindBox.item.rarity,
        description: `获得了${userBlindBox.item.rarity}级稀有度的${userBlindBox.item.name}！`,
        likes: 0,
        comments: 0,
        isLiked: false,
        createdAt: userBlindBox.obtainedAt,
      };

      return { success: true, data: showcaseItem };
    } catch (error) {
      console.error('Get showcase item error:', error);
      return { success: false, message: '获取展示项目失败' };
    }
  }
}
