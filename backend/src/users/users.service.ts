import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user-repository';
import { userQuery } from './models/user-query';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    const newUserModel = this.usersRepository.create(user);
    const hashPassword = await bcrypt.hash(newUserModel.password, 10);
    newUserModel.password = hashPassword;
    return this.usersRepository.saveUser(newUserModel);
  }

  findAll() {
    return this.usersRepository.findOne();
  }

  findOne(query: userQuery) {
    return this.usersRepository.findOne({ where: { ...query } });
  }

  async update(changes: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ username: 'email2' });
    this.usersRepository.merge(user, changes);
    return this.usersRepository.save(user);
  }
}
