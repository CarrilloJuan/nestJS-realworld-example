import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    const passMatch = await bcrypt.compare(password, user?.password);
    if (passMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(validatedUser: User) {
    const { id, ...user } = validatedUser;
    return {
      token: this.jwtService.sign({ sub: id }),
      ...user,
    };
  }
}
