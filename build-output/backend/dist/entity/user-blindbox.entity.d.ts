import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';
export declare class UserBlindBox {
    id: number;
    userId: number;
    blindBoxId: number;
    item: {
        name: string;
        rarity: 'N' | 'R' | 'SR' | 'SSR';
        image?: string;
    };
    obtainedAt: Date;
    user: User;
    blindBox: BlindBox;
}
