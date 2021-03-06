import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  username: string;
}
