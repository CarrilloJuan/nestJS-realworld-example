import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  create(@Body('user') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('user')
  async findOne() {
    const { id, ...user } = await this.usersService.findOne();
    return { user };
  }

  @Put('user')
  async update(@Body('user') updateUserDto: UpdateUserDto) {
    const { id, updateAt, ...user } = await this.usersService.update(
      updateUserDto,
    );
    return { user };
  }
}
