import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';

import { Comment } from 'src/articles/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Tag } from './tag.entity';
import { UpsertDate } from './upsert-date.entity';
import { transformAuthorProperty } from '../helpers/helpers';

@Entity()
export class Article extends UpsertDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

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

  @Transform(({ value }) => value)
  favoritesCount = 0;

  @Transform(({ value }) => !!value)
  favorited = false;
}
