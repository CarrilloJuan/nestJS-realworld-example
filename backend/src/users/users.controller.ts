import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('users')
  async create(@Body('user') uderData: CreateUserDto) {
    const newUser = await this.usersService.create(uderData);
    return {
      user: await this.authService.login(newUser),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findOne(@Request() req) {
    const userId = req.user?.userId;
    const token = req.headers?.authorization.replace(jwtConstants.scheme, '');
    const { id, password, ...user } = await this.usersService.findOne({
      id: userId,
    });
    return {
      user: {
        token,
        ...user,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('user')
  async update(@Body('user') updateUserDto: UpdateUserDto) {
    const { id, updateAt, ...user } = await this.usersService.update(
      updateUserDto,
    );
    return { user };
  }
}
