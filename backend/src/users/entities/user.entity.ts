import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Article } from 'src/articles/entities/article.entity';

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    length: 100,
  })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  following: boolean;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToMany(() => Article, (article) => article.slug)
  articles: Article[];
}
