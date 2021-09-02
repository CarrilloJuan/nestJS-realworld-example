import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Exclude, Transform } from 'class-transformer';
import { UpsertDate } from './upsert-date.entity';
import { transformAuthorProperty } from '../helpers';

@Entity()
export class Comment extends UpsertDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  body: string;

  @Transform(transformAuthorProperty)
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Article, (article) => article.slug)
  article: Article;
}
