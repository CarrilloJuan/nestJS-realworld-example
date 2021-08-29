import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
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
  findArticles(
    @Query('author') author: string,
    @Query('favorited') favoritedByUser: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    const { userId } = currentUser;
    if (author) {
      return this.articlesService.findByAuthor(author, userId);
    }
    if (favoritedByUser) {
      return this.articlesService.favoritedByUser(favoritedByUser, userId);
    }
    return this.articlesService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') articleId: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.articlesService.findOne(currentUser.userId, articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') articleId: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.articlesService.update(
      articleId,
      updateArticleDto,
      currentUser.userId,
    );
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
