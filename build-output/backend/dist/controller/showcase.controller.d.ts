import { Repository } from 'typeorm';
import { UserBlindBox } from '../entity/user-blindbox.entity';
export declare class ShowcaseController {
    userBlindBoxRepository: Repository<UserBlindBox>;
    getShowcaseItems(filter?: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            items: {
                id: number;
                userId: number;
                user: {
                    id: number;
                    username: string;
                    email: string;
                    avatar: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
                blindBoxName: string;
                itemName: string;
                itemImage: string;
                rarity: "N" | "R" | "SR" | "SSR";
                description: string;
                likes: number;
                comments: number;
                isLiked: boolean;
                createdAt: Date;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    getShowcaseItem(id: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            userId: number;
            user: {
                id: number;
                username: string;
                email: string;
                avatar: string;
                createdAt: Date;
                updatedAt: Date;
            };
            blindBoxName: string;
            itemName: string;
            itemImage: string;
            rarity: "N" | "R" | "SR" | "SSR";
            description: string;
            likes: number;
            comments: number;
            isLiked: boolean;
            createdAt: Date;
        };
        message?: undefined;
    }>;
}
