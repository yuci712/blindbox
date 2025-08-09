import { Order } from './order.entity';
import { UserBlindBox } from './user-blindbox.entity';
export declare class BlindBox {
    id: number;
    name: string;
    series: string;
    description: string;
    price: number;
    image: string;
    items: Array<{
        name: string;
        rarity: 'N' | 'R' | 'SR' | 'SSR';
        probability: number;
        image?: string;
    }>;
    category: string;
    tags: string[];
    isActive: boolean;
    totalSold: number;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    userBlindBoxes: UserBlindBox[];
}
