import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.findOne();
  }

  findOne() {
    return this.usersRepository.findOne();
  }

  async update(changes: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ username: 'email2' });
    this.usersRepository.merge(user, changes);
    return this.usersRepository.save(user);
  }
}
