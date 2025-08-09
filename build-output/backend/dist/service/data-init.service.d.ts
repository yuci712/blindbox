import { Repository } from 'typeorm';
import { BlindBox } from '../entity/blindbox.entity';
import { User } from '../entity/user.entity';
export declare class DataInitService {
    blindBoxRepository: Repository<BlindBox>;
    userRepository: Repository<User>;
    initSampleData(): Promise<void>;
    initUsers(): Promise<void>;
    initBlindBoxes(): Promise<void>;
}
