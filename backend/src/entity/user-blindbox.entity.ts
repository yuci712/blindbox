import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';

@Entity('user_blindboxes')
export class UserBlindBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  blindBoxId: number;

  @Column({ type: 'json' })
  item: {
    name: string;
    rarity: 'N' | 'R' | 'SR' | 'SSR';
    image?: string; // 物品图片URL
  };

  @CreateDateColumn()
  obtainedAt: Date;

  @ManyToOne(() => User, user => user.userBlindBoxes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BlindBox, blindBox => blindBox.userBlindBoxes)
  @JoinColumn({ name: 'blindBoxId' })
  blindBox: BlindBox;
}
