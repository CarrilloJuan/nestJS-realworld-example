import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import { User } from './user.entity';

@Entity()
export class Profile {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Column({ type: 'text', nullable: true, default: null })
  bio: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Expose({ groups: ['profile'] })
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

  @OneToOne(() => User, (user) => user.id, {
    cascade: ['insert'],
  })
  user: User;
}
