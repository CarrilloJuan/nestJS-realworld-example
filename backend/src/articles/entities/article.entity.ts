import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';

import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Tag } from './tag.entity';

@Entity()
export class Article {
  @PrimaryColumn()
  slug: string;

  @Column({ type: 'varchar', unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

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

  @Column({ default: 0, name: 'favorites_count' })
  favoritesCount: number;

  // TODO: Extract to helper, go out of the entity, try leftJoinAndMap
  @Transform(({ value: author }) => {
    const { profile: { id = '', following = '', ...profileProps } = {} } =
      author;
    return {
      username: author.username,
      ...profileProps,
      following: !!following,
    };
  })
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @OneToMany(() => Comment, (comments) => comments.id)
  @JoinColumn()
  comments: Comment[];

  @Exclude({ toPlainOnly: true })
  @ManyToMany(() => User, (user) => user.favoriteArticles)
  favoritedUsers: User[];

  @Transform(({ value: tags }) => tags.map(({ name }) => name))
  @Expose({ name: 'tagList' })
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @Exclude({ toPlainOnly: true })
  favoritedUserIds: string[];

  @Transform(({ value }) => !!value)
  favorited: boolean;
}
