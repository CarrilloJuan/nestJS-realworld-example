import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true, default: null })
  bio: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Exclude()
  @CreateDateColumn({
    select: false,
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    select: false,
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToOne(() => User, (user) => user.id)
  user: User;

  @Exclude()
  @ManyToMany(() => User, (user) => user.followedProfiles)
  followedUsers: User[];

  following: boolean;
}
