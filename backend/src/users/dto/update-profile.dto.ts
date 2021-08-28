import { IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  username: string;

  @IsOptional()
  following: boolean;
}
