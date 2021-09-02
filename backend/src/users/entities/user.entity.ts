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
import { Comment } from 'src/articles/entities/comment.entity';
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
    select: false,
  })
  password: string;

  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Exclude()
  @CreateDateColumn({
    select: false,
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    select: false,
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, name: 'profile_id' })
  profileId: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Article, (article) => article.slug)
  articles: string[];

  @OneToMany(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'comments_id' })
  comments: Comment[];

  @ManyToMany(() => Profile, (profile) => profile.followedUsers, {
    cascade: true,
  })
  @JoinTable({ name: 'users_followed_profiles' })
  followedProfiles: Profile[];

  @ManyToMany(() => Article, (article) => article.favoritedUsers)
  @JoinTable({ name: 'users_favorites_articles' })
  favoriteArticles: Article[];
}
