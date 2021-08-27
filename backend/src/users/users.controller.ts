import {
  Controller,
  Get,
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
import { CurrentUser } from './current-user.decorator';
import { CurrentUser as CurrentUserEntity } from './entities/current-user.entity';

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
  @UseInterceptors(TransformerUserResponse)
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findOne(@CurrentUser() currentUser: CurrentUserEntity) {
    return this.usersService.findOne({
      id: currentUser.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(
    @CurrentUser() currentUser: CurrentUserEntity,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(currentUser.userId, updateUserDto);
  }
}
