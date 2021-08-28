import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
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
