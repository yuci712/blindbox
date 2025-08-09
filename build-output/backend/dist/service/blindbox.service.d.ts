import { Repository } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';
import { UserBlindBox } from '../entity/user-blindbox.entity';
import { Order } from '../entity/order.entity';
export declare class BlindBoxService {
    blindBoxRepository: Repository<BlindBox>;
    userBlindBoxRepository: Repository<UserBlindBox>;
    orderRepository: Repository<Order>;
    getAllBlindBoxes(page?: number, limit?: number, category?: string): Promise<{
        items: BlindBox[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCategories(): Promise<any[]>;
    getBlindBoxById(id: number): Promise<BlindBox>;
    searchBlindBoxes(keyword: string, page?: number, limit?: number): Promise<{
        items: BlindBox[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    drawBlindBox(blindBoxId: number, userId: number): Promise<{
        item: {
            name: string;
            rarity: "N" | "R" | "SR" | "SSR";
            probability: number;
            image?: string;
        };
        order: Order;
    }>;
    getUserBlindBoxes(userId: number): Promise<UserBlindBox[]>;
    getAllBlindBoxesForAdmin(): Promise<{
        items: BlindBox[];
        total: number;
        activeCount: number;
        inactiveCount: number;
    }>;
    createBlindBox(blindBoxData: any): Promise<BlindBox>;
    updateBlindBox(id: number, blindBoxData: any): Promise<BlindBox>;
    deleteBlindBox(id: number): Promise<{
        message: string;
        details: {
            deletedUserBlindBoxes: number;
            deletedOrders: number;
        };
    }>;
    toggleBlindBoxActive(id: number): Promise<BlindBox>;
    getStatistics(): Promise<{
        totalBlindBoxes: number;
        activeBlindBoxes: number;
        inactiveBlindBoxes: number;
        totalOrders: number;
        totalRevenue: any;
        topSellingBlindBoxes: BlindBox[];
    }>;
    fixProbabilityData(): Promise<{
        totalBoxes: number;
        fixedCount: number;
        fixedBoxes: any[];
    }>;
    clearAllUserCollections(): Promise<{
        deletedCount: number;
        message: string;
    }>;
    clearUserCollection(userId: number): Promise<{
        deletedCount: number;
        message: string;
    }>;
}
