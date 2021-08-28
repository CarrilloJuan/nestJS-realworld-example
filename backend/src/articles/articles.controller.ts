import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDecorator } from 'src/users/current-user.decorator';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { CurrentUser } from '../auth/models/current-user';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body('article') createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.create(currentUser.userId, createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/favorite')
  favoriteArticle(
    @Param('slug') slug: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.articlesService.favoriteArticle(slug, currentUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug/favorite')
  unfavoriteArticle(
    @Param('slug') slug: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.articlesService.unFavoriteArticle(slug, currentUser.userId);
  }
}
