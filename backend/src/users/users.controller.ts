import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { TransformerUserResponse } from './transform-user-response.interceptor';
import { CurrentUserDecorator } from './current-user.decorator';
import { CurrentUser } from '../auth/models/current-user';

@UseInterceptors(TransformerUserResponse)
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    if (user) {
      return this.authService.login(user);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body('user') updateUserData: UpdateUserDto,
  ) {
    return await this.usersService.update(currentUser.userId, updateUserData);
  }
}
