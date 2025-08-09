import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderRepository: Repository<Order>;

  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @InjectEntityModel(BlindBox)
  blindBoxRepository: Repository<BlindBox>;

  // 获取用户的订单列表
  async getUserOrders(userId: number, page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.blindBox', 'blindBox')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 获取订单详情
  async getOrderById(id: number, userId?: number) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.blindBox', 'blindBox')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id = :id', { id });

    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    return await queryBuilder.getOne();
  }

  // 更新订单状态（用户）
  async updateOrderStatus(id: number, userId: number, status: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['blindBox', 'user'],
    });

    if (!order) {
      return null;
    }

    // 只允许用户取消pending状态的订单
    if (order.status !== 'pending' || status !== 'cancelled') {
      throw new Error('无法更新此订单状态');
    }

    order.status = status;
    order.updatedAt = new Date();

    return await this.orderRepository.save(order);
  }

  // 获取所有订单（管理员）
  async getAllOrders(page: number = 1, limit: number = 10, status?: string, userId?: number) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.blindBox', 'blindBox')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 管理员更新订单状态
  async adminUpdateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['blindBox', 'user'],
    });

    if (!order) {
      return null;
    }

    order.status = status;
    order.updatedAt = new Date();

    return await this.orderRepository.save(order);
  }

  // 获取订单统计
  async getOrderStats() {
    const totalOrders = await this.orderRepository.count();
    
    const statusStats = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .addSelect('SUM(order.amount)', 'totalAmount')
      .groupBy('order.status')
      .getRawMany();

    const recentOrders = await this.orderRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
      relations: ['blindBox', 'user'],
    });

    // 计算总收入
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'sum')
      .where('order.status = :status', { status: 'completed' })
      .getRawOne();

    // 获取热门盲盒（按订单数量排序）
    const popularBlindBoxes = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.blindBox', 'blindBox')
      .select('blindBox.id', 'id')
      .addSelect('blindBox.name', 'name')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('SUM(order.amount)', 'revenue')
      .groupBy('blindBox.id')
      .orderBy('orderCount', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      totalOrders,
      totalRevenue: totalRevenue?.sum || 0,
      statusStats: statusStats.map(stat => ({
        status: stat.status,
        count: parseInt(stat.count),
        totalAmount: parseFloat(stat.totalAmount) || 0,
      })),
      recentOrders,
      popularBlindBoxes: popularBlindBoxes.map(box => ({
        id: box.id,
        name: box.name,
        orderCount: parseInt(box.orderCount),
        revenue: parseFloat(box.revenue) || 0,
      })),
    };
  }

  // 删除订单
  async deleteOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    
    if (!order) {
      return null;
    }

    await this.orderRepository.remove(order);
    return true;
  }
}
