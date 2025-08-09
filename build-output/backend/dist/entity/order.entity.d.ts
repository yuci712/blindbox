import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';
export declare class Order {
    id: number;
    userId: number;
    blindBoxId: number;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    blindBox: BlindBox;
}
