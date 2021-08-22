import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    length: 100,
  })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

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
}
