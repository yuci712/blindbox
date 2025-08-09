import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';
export declare class OrderService {
    orderRepository: Repository<Order>;
    userRepository: Repository<User>;
    blindBoxRepository: Repository<BlindBox>;
    getUserOrders(userId: number, page?: number, limit?: number, status?: string): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrderById(id: number, userId?: number): Promise<Order>;
    updateOrderStatus(id: number, userId: number, status: string): Promise<Order>;
    getAllOrders(page?: number, limit?: number, status?: string, userId?: number): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    adminUpdateOrderStatus(id: number, status: string): Promise<Order>;
    getOrderStats(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        statusStats: {
            status: any;
            count: number;
            totalAmount: number;
        }[];
        recentOrders: Order[];
        popularBlindBoxes: {
            id: any;
            name: any;
            orderCount: number;
            revenue: number;
        }[];
    }>;
    deleteOrder(id: number): Promise<boolean>;
}
