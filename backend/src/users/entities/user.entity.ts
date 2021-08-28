import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    length: 100,
  })
  password: string;

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

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  profileId: number;

  @OneToOne(() => Profile, (profile) => profile.username, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Article, (article) => article.favoritedUsers)
  @JoinTable()
  favoriteArticles: Article[];

  @OneToMany(() => Article, (article) => article.slug)
  @JoinColumn()
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.id)
  @JoinColumn()
  comments: Comment[];
}
