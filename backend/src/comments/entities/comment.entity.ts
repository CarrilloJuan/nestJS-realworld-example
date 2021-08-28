import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @Column({
    type: 'text',
  })
  body: string;

  @ManyToOne(() => User, (user) => user.id)
  autor: User;

  @Exclude()
  @ManyToOne(() => Article, (article) => article.slug)
  article: Article;
}
