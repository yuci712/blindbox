import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUserOptions } from '../interface';
export declare class UserService {
    userRepository: Repository<User>;
    getUser(options: IUserOptions): Promise<{
        uid: number;
        username: string;
        phone: string;
        email: string;
    }>;
    getUserById(id: number): Promise<User>;
    isAdmin(userId: number): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    updateUserRole(userId: number, role: string): Promise<User>;
}
