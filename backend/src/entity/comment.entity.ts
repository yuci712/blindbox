import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PlayerShow } from './player-show.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  playerShowId: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PlayerShow, playerShow => playerShow.comments)
  @JoinColumn({ name: 'playerShowId' })
  playerShow: PlayerShow;
}
