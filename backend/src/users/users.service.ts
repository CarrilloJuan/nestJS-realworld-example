import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { userQuery } from './models/user-query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return this.usersRepository.save(newUser);
  }

  findOne(query: userQuery) {
    return this.usersRepository.findOne({
      where: { ...query },
      relations: ['favoriteArticles'],
    });
  }

  findOneOrFail(id: string) {
    return this.usersRepository.findOneOrFail(id);
  }

  async update(userId: string, changes: UpdateUserDto) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      this.usersRepository.merge(user, changes);
      return this.usersRepository.save(user);
    }
  }
}
