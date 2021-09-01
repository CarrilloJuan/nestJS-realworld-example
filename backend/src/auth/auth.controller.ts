import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TransformerUserResponse } from './transformer-user-response.interceptor';
import { CurrentUserDecorator } from 'src/users/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './models/current-user';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(TransformerUserResponse)
  @UseGuards(LocalAuthGuard)
  @Post('users/login')
  async login(@CurrentUserDecorator() currentUser: User) {
    return this.authService.login(currentUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransformerUserResponse)
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findOne(@CurrentUserDecorator() currentUser: CurrentUser) {
    return this.authService.currentUser(currentUser.userId);
  }
}
