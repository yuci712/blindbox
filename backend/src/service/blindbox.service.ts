import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';
import { UserBlindBox } from '../entity/user-blindbox.entity';
import { Order } from '../entity/order.entity';

@Provide()
export class BlindBoxService {
  @InjectEntityModel(BlindBox)
  blindBoxRepository: Repository<BlindBox>;

  @InjectEntityModel(UserBlindBox)
  userBlindBoxRepository: Repository<UserBlindBox>;

  @InjectEntityModel(Order)
  orderRepository: Repository<Order>;

  async getAllBlindBoxes(page = 1, limit = 10, category?: string) {
    const skip = (page - 1) * limit;
    const whereCondition: any = { isActive: true };

    if (category) {
      whereCondition.category = category;
    }

    const [items, total] = await this.blindBoxRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategories() {
    const result = await this.blindBoxRepository
      .createQueryBuilder('blindbox')
      .select('DISTINCT blindbox.category', 'category')
      .where('blindbox.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map(item => item.category);
  }

  async getBlindBoxById(id: number) {
    return await this.blindBoxRepository.findOne({ where: { id } });
  }

  async searchBlindBoxes(keyword: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.blindBoxRepository.findAndCount({
      where: [
        {
          name: Like(`%${keyword}%`),
          isActive: true,
        },
        {
          description: Like(`%${keyword}%`),
          isActive: true,
        },
        {
          series: Like(`%${keyword}%`),
          isActive: true,
        }
      ],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async drawBlindBox(blindBoxId: number, userId: number) {
    const blindBox = await this.blindBoxRepository.findOne({
      where: { id: blindBoxId },
    });

    if (!blindBox || !blindBox.isActive) {
      throw new Error('盲盒不存在或已下架');
    }

    if (!blindBox.items || blindBox.items.length === 0) {
      throw new Error('盲盒没有可抽取的物品');
    }

    // 随机选择一个物品
    const randomIndex = Math.floor(Math.random() * blindBox.items.length);
    const drawnItem = blindBox.items[randomIndex];

    // 使用事务确保数据一致性
    const queryRunner =
      this.blindBoxRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建订单
      const order = this.orderRepository.create({
        userId,
        blindBoxId,
        amount: blindBox.price,
        status: 'completed',
      });
      await queryRunner.manager.save(order);

      // 记录用户获得的物品
      const userBlindBox = this.userBlindBoxRepository.create({
        userId,
        blindBoxId,
        item: drawnItem,
      });
      await queryRunner.manager.save(userBlindBox);

      // 更新销量
      await queryRunner.manager.update(BlindBox, blindBoxId, {
        totalSold: blindBox.totalSold + 1,
      });

      await queryRunner.commitTransaction();
      return { item: drawnItem, order };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserBlindBoxes(userId: number) {
    return await this.userBlindBoxRepository.find({
      where: { userId },
      relations: ['blindBox'],
      order: { obtainedAt: 'DESC' },
    });
  }

  // 管理员功能：获取所有盲盒（包括未激活的）
  async getAllBlindBoxesForAdmin() {
    const blindBoxes = await this.blindBoxRepository.find({
      order: { createdAt: 'DESC' },
    });

    const total = blindBoxes.length;
    const activeCount = blindBoxes.filter(box => box.isActive).length;

    return {
      items: blindBoxes,
      total,
      activeCount,
      inactiveCount: total - activeCount,
    };
  }

  // 管理员功能：创建盲盒
  async createBlindBox(blindBoxData: any) {
    const { name, description, price, image, items, category } = blindBoxData;

    if (!name || !description || !price || !items || !category) {
      throw new Error('缺少必要字段');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('盲盒必须包含至少一个物品');
    }

    // 验证和修正概率数据
    const processedItems = items.map(item => ({
      ...item,
      // 确保概率是小数格式存储（0-1之间）- 修复：包含等于1的情况
      probability: item.probability >= 1 ? item.probability / 100 : item.probability
    }));
    
    // 验证概率总和
    const totalProbability = processedItems.reduce((sum, item) => sum + item.probability, 0);
    if (Math.abs(totalProbability - 1) > 0.001) {
      console.warn(`警告：新盲盒的概率总和不等于1，当前为：${totalProbability}`);
    }

    const blindBox = this.blindBoxRepository.create({
      name,
      description,
      price: Number(price),
      image: image || '/placeholder-box.jpg',
      items: processedItems,
      category,
      isActive: true,
      totalSold: 0,
    });

    return await this.blindBoxRepository.save(blindBox);
  }

  // 管理员功能：更新盲盒
  async updateBlindBox(id: number, blindBoxData: any) {
    const blindBox = await this.blindBoxRepository.findOne({ where: { id } });

    if (!blindBox) {
      throw new Error('盲盒不存在');
    }

    const { name, description, price, image, items, category, isActive } =
      blindBoxData;

    if (items && (!Array.isArray(items) || items.length === 0)) {
      throw new Error('盲盒必须包含至少一个物品');
    }

    // 验证和修正概率数据
    let processedItems = items;
    if (items && Array.isArray(items)) {
      processedItems = items.map(item => ({
        ...item,
        // 确保概率是小数格式存储（0-1之间）- 修复：包含等于1的情况
        probability: item.probability >= 1 ? item.probability / 100 : item.probability
      }));
      
      // 验证概率总和
      const totalProbability = processedItems.reduce((sum, item) => sum + item.probability, 0);
      if (Math.abs(totalProbability - 1) > 0.001) {
        console.warn(`警告：盲盒 ${id} 的概率总和不等于1，当前为：${totalProbability}`);
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (image !== undefined) updateData.image = image;
    if (processedItems !== undefined) updateData.items = processedItems;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    await this.blindBoxRepository.update(id, updateData);
    return await this.blindBoxRepository.findOne({ where: { id } });
  }

  // 管理员功能：删除盲盒
  async deleteBlindBox(id: number) {
    const blindBox = await this.blindBoxRepository.findOne({ where: { id } });

    if (!blindBox) {
      throw new Error('盲盒不存在');
    }

    try {
      // 统计相关数据，用于日志记录
      const userBlindBoxCount = await this.userBlindBoxRepository.count({ where: { blindBoxId: id } });
      const orderCount = await this.orderRepository.count({ where: { blindBoxId: id } });
      
      console.log(`准备删除盲盒 ${id} (${blindBox.name})`);
      console.log(`- 用户收藏记录: ${userBlindBoxCount} 条`);
      console.log(`- 订单记录: ${orderCount} 条`);
      
      // 删除前先清理相关的外键引用数据
      if (userBlindBoxCount > 0) {
        console.log('正在删除用户收藏记录...');
        await this.userBlindBoxRepository.delete({ blindBoxId: id });
        console.log('用户收藏记录删除完成');
      }
      
      if (orderCount > 0) {
        console.log('正在删除订单记录...');
        await this.orderRepository.delete({ blindBoxId: id });
        console.log('订单记录删除完成');
      }
      
      // 最后删除盲盒本身
      console.log('正在删除盲盒主记录...');
      await this.blindBoxRepository.delete(id);
      console.log('盲盒删除完成');
      
      return { 
        message: '盲盒及相关数据删除成功',
        details: {
          deletedUserBlindBoxes: userBlindBoxCount,
          deletedOrders: orderCount
        }
      };
    } catch (error) {
      console.error('删除盲盒时出错:', error);
      throw new Error(`删除盲盒失败: ${error.message}`);
    }
  }

  // 管理员功能：切换盲盒激活状态
  async toggleBlindBoxActive(id: number) {
    const blindBox = await this.blindBoxRepository.findOne({ where: { id } });

    if (!blindBox) {
      throw new Error('盲盒不存在');
    }

    await this.blindBoxRepository.update(id, { isActive: !blindBox.isActive });
    return await this.blindBoxRepository.findOne({ where: { id } });
  }

  // 管理员功能：获取统计数据
  async getStatistics() {
    const totalBlindBoxes = await this.blindBoxRepository.count();
    const activeBlindBoxes = await this.blindBoxRepository.count({
      where: { isActive: true },
    });
    const totalOrders = await this.orderRepository.count();
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'sum')
      .where('order.status = :status', { status: 'completed' })
      .getRawOne();

    const topSellingBlindBoxes = await this.blindBoxRepository.find({
      order: { totalSold: 'DESC' },
      take: 5,
    });

    return {
      totalBlindBoxes,
      activeBlindBoxes,
      inactiveBlindBoxes: totalBlindBoxes - activeBlindBoxes,
      totalOrders,
      totalRevenue: totalRevenue?.sum || 0,
      topSellingBlindBoxes,
    };
  }

  // 修复概率数据
  async fixProbabilityData() {
    const allBlindBoxes = await this.blindBoxRepository.find();
    let fixedCount = 0;
    const fixedBoxes = [];

    for (const blindBox of allBlindBoxes) {
      let needsUpdate = false;
      const updatedItems = blindBox.items.map(item => {
        // 检查概率是否需要修正 - 修复：包含等于1的情况
        if (item.probability >= 1) {
          console.log(`修正盲盒 "${blindBox.name}" 中物品 "${item.name}" 的概率：${item.probability} -> ${item.probability / 100}`);
          needsUpdate = true;
          return {
            ...item,
            probability: item.probability / 100
          };
        }
        return item;
      });

      if (needsUpdate) {
        blindBox.items = updatedItems;
        await this.blindBoxRepository.save(blindBox);
        fixedCount++;
        fixedBoxes.push(blindBox.name);
        console.log(`已更新盲盒 "${blindBox.name}"`);
      }
    }

    return {
      totalBoxes: allBlindBoxes.length,
      fixedCount,
      fixedBoxes
    };
  }

  // 清空所有用户收藏数据
  async clearAllUserCollections() {
    const deletedCount = await this.userBlindBoxRepository.count();
    await this.userBlindBoxRepository.clear();
    
    console.log(`已清空所有用户收藏数据，共删除 ${deletedCount} 条记录`);
    
    return {
      deletedCount,
      message: `成功清空所有用户收藏数据，共删除 ${deletedCount} 条记录`
    };
  }

  // 清空指定用户的收藏数据
  async clearUserCollection(userId: number) {
    const userCollections = await this.userBlindBoxRepository.find({
      where: { userId }
    });
    
    const deletedCount = userCollections.length;
    await this.userBlindBoxRepository.delete({ userId });
    
    console.log(`已清空用户 ${userId} 的收藏数据，共删除 ${deletedCount} 条记录`);
    
    return {
      deletedCount,
      message: `成功清空用户收藏数据，共删除 ${deletedCount} 条记录`
    };
  }
}
