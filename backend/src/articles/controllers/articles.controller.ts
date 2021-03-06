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
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserDecorator } from 'src/common/current-user.decorator';
import { ArticlesService } from '../services/articles.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

import { CurrentUser } from '../../auth/interfaces/current-user';

@ApiTags('Articles')
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
  @Get('feed')
  findByFeed(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    return this.articlesService.findByfeed({
      userId: currentUser.userId,
      limit,
      offset,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findArticles(
    @Query('author') author: string,
    @Query('favorited') favoritedByUser: string,
    @Query('tag') tag: string,
    @CurrentUserDecorator() currentUser: CurrentUser,
  ) {
    const { userId } = currentUser || {};
    // TODO: change to factory
    if (author) {
      return this.articlesService.findByAuthor(author, { userId });
    }
    if (favoritedByUser) {
      return this.articlesService.favoritedByUser(favoritedByUser, { userId });
    }
    if (tag) {
      return this.articlesService.findByTag(tag, { userId });
    }
    return this.articlesService.findAll({ userId });
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
