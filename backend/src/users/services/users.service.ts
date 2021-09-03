import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { User } from '../entities/user.entity';
import { userQuery } from '../interfaces/user-query';
import { Profile } from '../entities/profile.entity';
import { splitUpdateProperties } from '../helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async create(userData: CreateUserDto) {
    // TODO:  we recommend using a helper factory class (e.g., QueryRunnerFactory
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newUser = queryRunner.manager.create(User, userData);
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;

      const profile = queryRunner.manager.create(Profile);
      await queryRunner.manager.save(profile);

      newUser.profile = profile;
      await queryRunner.manager.save(newUser);

      await queryRunner.commitTransaction();
      return newUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findOne(query: userQuery) {
    return this.usersRepository.findOne({
      where: { ...query },
    });
  }

  findOneOrFail(id: string) {
    return this.usersRepository.findOneOrFail(id);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if ('password' in updateUserDto) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const { userProperties, profileProperties } = splitUpdateProperties(
      updateUserDto,
      user,
    );

    await this.connection.transaction(async (manager) => {
      if (Object.keys(userProperties).length > 0) {
        await manager.update(User, { id: user.id }, userProperties);
      }

      if (Object.keys(profileProperties).length > 0) {
        await manager.update(
          Profile,
          { id: user.profileId },
          profileProperties,
        );
      }
    });
    return this.usersRepository.findOneOrFail(userId);
  }
}
