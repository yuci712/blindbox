import { BlindBoxService } from '../service/blindbox.service';
export declare class BlindBoxController {
    blindBoxService: BlindBoxService;
    getBlindBoxes(page?: number, limit?: number, category?: string): Promise<{
        success: boolean;
        data: {
            items: import("../entity/blindbox.entity").BlindBox[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    getCategories(): Promise<{
        success: boolean;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    searchBlindBoxes(keyword: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            items: import("../entity/blindbox.entity").BlindBox[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message?: undefined;
    }>;
    getBlindBoxById(id: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("../entity/blindbox.entity").BlindBox;
        message?: undefined;
    }>;
    drawBlindBox(blindBoxId: number, body: {
        userId: number;
    }): Promise<{
        success: boolean;
        data: {
            item: {
                name: string;
                rarity: "N" | "R" | "SR" | "SSR";
                probability: number;
                image?: string;
            };
            order: import("../entity/order.entity").Order;
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getUserBlindBoxes(userId: number): Promise<{
        success: boolean;
        data: import("../entity/user-blindbox.entity").UserBlindBox[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
