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
import { Comment } from './comment.entity';
import { PlayerShow } from './player-show.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ default: 'customer' })
  role: string; // 'admin' | 'customer'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => UserBlindBox, userBlindBox => userBlindBox.user)
  userBlindBoxes: UserBlindBox[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => PlayerShow, playerShow => playerShow.user)
  playerShows: PlayerShow[];
}
