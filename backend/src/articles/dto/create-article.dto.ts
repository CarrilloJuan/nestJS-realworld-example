import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  body: string;

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
