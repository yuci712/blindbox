import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity('player_shows')
export class PlayerShow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.playerShows)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => Comment, comment => comment.playerShow)
  comments: Comment[];
}
