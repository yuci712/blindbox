import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BlindBox } from './blindbox.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  blindBoxId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, completed, cancelled

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BlindBox, blindBox => blindBox.orders)
  @JoinColumn({ name: 'blindBoxId' })
  blindBox: BlindBox;
}
