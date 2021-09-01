import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the post',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  tagList: string[];

  @IsOptional()
  favorited: boolean;

  @IsOptional()
  favoritesCount: number;

  @Expose()
  get slug() {
    return this.title.replace(/\s/g, '-');
  }
}
