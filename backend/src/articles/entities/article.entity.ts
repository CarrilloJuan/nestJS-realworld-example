import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';

import { Comment } from 'src/articles/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Tag } from './tag.entity';
import { UpsertDate } from './upsert-date.entity';
import { transformAuthorProperty } from '../helpers';

@Entity()
export class Article extends UpsertDate {
  @PrimaryColumn()
  slug: string;

  @Column({ type: 'varchar', unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 0, name: 'favorites_count' })
  favoritesCount: number;

  @Transform(transformAuthorProperty)
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @OneToMany(() => Comment, (comments) => comments.id)
  @JoinColumn()
  comments: Comment[];

  @Exclude({ toPlainOnly: true })
  @ManyToMany(() => User, (user) => user.favoriteArticles, {
    onDelete: 'CASCADE',
  })
  favoritedUsers: User[];

  @Transform(({ value: tags = [] }) => tags.map(({ name }) => name))
  @Expose({ name: 'tagList' })
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @Exclude({ toPlainOnly: true })
  favoritedUserIds: string[];

  @Transform(({ value }) => !!value)
  favorited: boolean;
}
