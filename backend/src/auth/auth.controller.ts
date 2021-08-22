import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformerUserResponse } from './transformer-user-response.interceptor';
import { CurrentUser } from 'src/users/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(TransformerUserResponse)
  @UseGuards(LocalAuthGuard)
  @Post('users/login')
  async login(@CurrentUser() currentUser: User) {
    return this.authService.login(currentUser);
  }
}
