import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';
export declare class AuthController {
    authService: AuthService;
    ctx: Context;
    register(body: any): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                username: string;
                email: string;
                password: string;
                avatar: string;
                nickname: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
                orders: import("../entity/order.entity").Order[];
                userBlindBoxes: import("../entity/user-blindbox.entity").UserBlindBox[];
                comments: import("../entity/comment.entity").Comment[];
                playerShows: import("../entity/player-show.entity").PlayerShow[];
            };
            token: string;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    login(body: any): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                username: string;
                email: string;
                password: string;
                avatar: string;
                nickname: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
                orders: import("../entity/order.entity").Order[];
                userBlindBoxes: import("../entity/user-blindbox.entity").UserBlindBox[];
                comments: import("../entity/comment.entity").Comment[];
                playerShows: import("../entity/player-show.entity").PlayerShow[];
            };
            token: string;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getProfile(): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: number;
            username: string;
            email: string;
            password: string;
            avatar: string;
            nickname: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            orders: import("../entity/order.entity").Order[];
            userBlindBoxes: import("../entity/user-blindbox.entity").UserBlindBox[];
            comments: import("../entity/comment.entity").Comment[];
            playerShows: import("../entity/player-show.entity").PlayerShow[];
        };
        message?: undefined;
    }>;
    uploadAvatar(files: any): Promise<{
        success: boolean;
        data: {
            avatarUrl: string;
            message: string;
        };
    } | {
        success: boolean;
        message: string;
    }>;
    updateProfile(body: any): Promise<{
        success: boolean;
        data: {
            id: number;
            username: string;
            email: string;
            password: string;
            avatar: string;
            nickname: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            orders: import("../entity/order.entity").Order[];
            userBlindBoxes: import("../entity/user-blindbox.entity").UserBlindBox[];
            comments: import("../entity/comment.entity").Comment[];
            playerShows: import("../entity/player-show.entity").PlayerShow[];
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
