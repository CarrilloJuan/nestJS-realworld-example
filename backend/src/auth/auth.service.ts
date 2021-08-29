import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private connection: Connection,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .addSelect('user.password')
      .where('user.email =:email', { email })
      .getOne();

    if (user) {
      const passMatch = await bcrypt.compare(password, user.password);
      if (passMatch) return user;
    }
    return null;
  }

  login(user: User) {
    const token = this.jwtService.sign({ sub: user.id });
    const parsedUser = classToPlain(user);
    return { token, ...parsedUser };
  }

  currentUser(userId: string) {
    return this.userRepository.findOneOrFail(userId);
  }
}
