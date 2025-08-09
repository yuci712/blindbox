import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { UserBlindBox } from './user-blindbox.entity';

@Entity('blindboxes')
export class BlindBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  series: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'json' })
  items: Array<{
    name: string;
    rarity: 'N' | 'R' | 'SR' | 'SSR';
    probability: number;
    image?: string; // 物品图片URL
  }>;

  @Column()
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  totalSold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.blindBox)
  orders: Order[];

  @OneToMany(() => UserBlindBox, userBlindBox => userBlindBox.blindBox)
  userBlindBoxes: UserBlindBox[];
}
