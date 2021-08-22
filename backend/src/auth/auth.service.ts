import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      const passMatch = await bcrypt.compare(password, user?.password);
      if (passMatch) return user;
    }
    return null;
  }

  login(currentUser: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createAt, updateAt, id, ...user } = currentUser;
    return {
      token: this.jwtService.sign({ sub: currentUser.id }),
      ...user,
    };
  }
}
