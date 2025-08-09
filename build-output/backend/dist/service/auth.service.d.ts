import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
export declare class AuthService {
    userRepository: Repository<User>;
    jwtConfig: any;
    register(username: string, email: string, password: string): Promise<{
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
    }>;
    login(username: string, password: string): Promise<{
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
    }>;
    getUserById(id: number): Promise<{
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
    }>;
    generateToken(userId: number, username: string, role?: string): Promise<string>;
    updateUserAvatar(userId: number, avatarUrl: string): Promise<{
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
    }>;
    updateUserProfile(userId: number, profileData: {
        nickname?: string;
    }): Promise<{
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
    }>;
}
