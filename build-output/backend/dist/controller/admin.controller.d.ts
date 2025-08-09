import { AdminService } from '../service/admin.service';
import { BlindBoxService } from '../service/blindbox.service';
import { Context } from '@midwayjs/koa';
export declare class AdminController {
    ctx: Context;
    adminService: AdminService;
    blindBoxService: BlindBoxService;
    getDashboardStats(timeRange?: 'all' | 'month' | 'week'): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
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
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    createBlindBox(blindBoxData: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/blindbox.entity").BlindBox;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAllBlindBoxes(): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            items: import("../entity/blindbox.entity").BlindBox[];
            total: number;
            activeCount: number;
            inactiveCount: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateBlindBox(id: string, blindBoxData: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/blindbox.entity").BlindBox;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    deleteBlindBox(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    toggleBlindBoxActive(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: import("../entity/blindbox.entity").BlindBox;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    fixProbabilityData(): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            totalBoxes: number;
            fixedCount: number;
            fixedBoxes: any[];
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    clearAllCollections(): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            deletedCount: number;
            message: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    clearUserCollection(userId: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            deletedCount: number;
            message: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
