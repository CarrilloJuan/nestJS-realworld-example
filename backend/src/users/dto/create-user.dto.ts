import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  image: string;
}
