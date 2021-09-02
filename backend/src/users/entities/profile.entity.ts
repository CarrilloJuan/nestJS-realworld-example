import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { Exclude, Transform } from 'class-transformer';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true, default: null })
  bio: string;

  @Column({ nullable: true, default: null })
  image: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Exclude()
  @ManyToMany(() => User, (user) => user.followedProfiles)
  followedUsers: User[];

  @Transform(({ value }) => !!value)
  following: boolean;
}
