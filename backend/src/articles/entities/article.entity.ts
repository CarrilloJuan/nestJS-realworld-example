import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
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
} from 'typeorm';

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

  @Column('simple-array', { name: 'tag_list' })
  tagList: string[];

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

  @Column({ default: false })
  favorited: boolean;

  @Column({ default: 0, name: 'favorites_count' })
  favoritesCount: number;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @OneToMany(() => Comment, (comments) => comments.id)
  @JoinColumn()
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.favoriteArticles)
  favoritedUsers: User[];
}
