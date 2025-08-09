import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';
import { Order } from '../entity/order.entity';
import { Repository } from 'typeorm';
export declare class AdminService {
    userModel: Repository<User>;
    blindBoxModel: Repository<BlindBox>;
    orderModel: Repository<Order>;
    getDashboardStats(timeRange: 'all' | 'month' | 'week'): Promise<{
        totalUsers: number;
        totalBlindBoxes: number;
        totalDraws: number;
        totalRevenue: number;
        dailyStats: any[];
        popularBlindBoxes: any[];
        rarityStats: {
            rarity: string;
            count: number;
        }[];
    }>;
    private getSimplifiedRarityStats;
    private getDailyStats;
}
